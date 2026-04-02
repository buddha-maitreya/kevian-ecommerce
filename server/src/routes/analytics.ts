import { Router, Request, Response } from "express";
import { eq, sql, desc, gte } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { analyticsEvents, products } from "../db/schema.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

// Track an event (public — optional auth to capture user if logged in)
const trackSchema = z.object({
  event: z.enum(["product_view", "search", "add_to_cart", "checkout", "partner_click"]),
  productId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

router.post("/track", optionalAuth, async (req: Request, res: Response) => {
  try {
    const body = trackSchema.parse(req.body);
    await db.insert(analyticsEvents).values({
      event: body.event,
      productId: body.productId,
      userId: req.user?.userId,
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Analytics track error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Automated insights endpoint (admin) — no data analyst needed
router.get("/insights", requireAuth, async (req: Request, res: Response) => {
  try {
    const daysBack = parseInt((req.query.days as string) || "30");
    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const [
      topViewed,
      topSearches,
      topPartnerClicks,
      eventCounts,
      dailyActivity,
    ] = await Promise.all([
      // Most viewed products
      db
        .select({
          productId: analyticsEvents.productId,
          productName: products.name,
          brand: products.brand,
          views: sql<number>`count(*)::int`,
        })
        .from(analyticsEvents)
        .innerJoin(products, eq(analyticsEvents.productId, products.id))
        .where(
          sql`${analyticsEvents.event} = 'product_view' AND ${analyticsEvents.createdAt} >= ${since}`
        )
        .groupBy(analyticsEvents.productId, products.name, products.brand)
        .orderBy(desc(sql`count(*)`))
        .limit(10),

      // Top search queries
      db
        .select({
          query: sql<string>`${analyticsEvents.metadata}::json->>'query'`,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsEvents)
        .where(
          sql`${analyticsEvents.event} = 'search' AND ${analyticsEvents.createdAt} >= ${since}`
        )
        .groupBy(sql`${analyticsEvents.metadata}::json->>'query'`)
        .orderBy(desc(sql`count(*)`))
        .limit(10),

      // Partner click distribution
      db
        .select({
          partner: sql<string>`${analyticsEvents.metadata}::json->>'partner'`,
          clicks: sql<number>`count(*)::int`,
        })
        .from(analyticsEvents)
        .where(
          sql`${analyticsEvents.event} = 'partner_click' AND ${analyticsEvents.createdAt} >= ${since}`
        )
        .groupBy(sql`${analyticsEvents.metadata}::json->>'partner'`)
        .orderBy(desc(sql`count(*)`)),

      // Overall event counts
      db
        .select({
          event: analyticsEvents.event,
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsEvents)
        .where(gte(analyticsEvents.createdAt, since))
        .groupBy(analyticsEvents.event),

      // Daily activity (last N days)
      db
        .select({
          date: sql<string>`date(${analyticsEvents.createdAt})`,
          views: sql<number>`count(*) filter (where ${analyticsEvents.event} = 'product_view')::int`,
          searches: sql<number>`count(*) filter (where ${analyticsEvents.event} = 'search')::int`,
          addToCarts: sql<number>`count(*) filter (where ${analyticsEvents.event} = 'add_to_cart')::int`,
          checkouts: sql<number>`count(*) filter (where ${analyticsEvents.event} = 'checkout')::int`,
        })
        .from(analyticsEvents)
        .where(gte(analyticsEvents.createdAt, since))
        .groupBy(sql`date(${analyticsEvents.createdAt})`)
        .orderBy(sql`date(${analyticsEvents.createdAt})`),
    ]);

    res.json({
      period: { days: daysBack, since: since.toISOString() },
      topViewedProducts: topViewed,
      topSearchQueries: topSearches,
      partnerClickDistribution: topPartnerClicks,
      eventSummary: eventCounts,
      dailyActivity,
    });
  } catch (err) {
    console.error("Analytics insights error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
