import { Router, Request, Response } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { products, orders, orderItems, users, partnerLinks } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Admin guard — for now, any authenticated user can access admin
// In production, add an "admin" role to the user schema
router.use(requireAuth);

// ─── Products CRUD ───

router.get("/products", async (_req: Request, res: Response) => {
  try {
    const all = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));
    res.json(all);
  } catch (err) {
    console.error("Admin products list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().optional(),
  retailPrice: z.string(),
  wholesalePrice: z.string(),
  wholesaleMinQty: z.number().int().min(1).default(12),
  stock: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

router.post("/products", async (req: Request, res: Response) => {
  try {
    const body = productSchema.parse(req.body);
    const [product] = await db.insert(products).values(body).returning();
    res.status(201).json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Admin product create error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = productSchema.partial().parse(req.body);
    const [updated] = await db
      .update(products)
      .set(body)
      .where(eq(products.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Admin product update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.update(products).set({ active: false }).where(eq(products.id, id));
    res.status(204).send();
  } catch (err) {
    console.error("Admin product delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Partner Links CRUD ───

const partnerLinkSchema = z.object({
  productId: z.string().uuid(),
  partner: z.string().min(1),
  url: z.string().url(),
  active: z.boolean().default(true),
});

router.get("/partner-links", async (_req: Request, res: Response) => {
  try {
    const all = await db
      .select({
        id: partnerLinks.id,
        productId: partnerLinks.productId,
        partner: partnerLinks.partner,
        url: partnerLinks.url,
        active: partnerLinks.active,
        productName: products.name,
      })
      .from(partnerLinks)
      .innerJoin(products, eq(partnerLinks.productId, products.id));
    res.json(all);
  } catch (err) {
    console.error("Admin partner links error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/partner-links", async (req: Request, res: Response) => {
  try {
    const body = partnerLinkSchema.parse(req.body);
    const [link] = await db.insert(partnerLinks).values(body).returning();
    res.status(201).json(link);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Admin partner link create error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/partner-links/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.delete(partnerLinks).where(eq(partnerLinks.id, id));
    res.status(204).send();
  } catch (err) {
    console.error("Admin partner link delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Orders Management ───

router.get("/orders", async (_req: Request, res: Response) => {
  try {
    const all = await db
      .select({
        id: orders.id,
        status: orders.status,
        total: orders.total,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
        userRole: users.role,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));
    res.json(all);
  } catch (err) {
    console.error("Admin orders list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

router.patch("/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = updateOrderSchema.parse(req.body);
    const [updated] = await db
      .update(orders)
      .set({ status: body.status })
      .where(eq(orders.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Admin order update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Customers ───

router.get("/customers", async (_req: Request, res: Response) => {
  try {
    const all = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
        orderCount: sql<number>`(select count(*)::int from orders where orders.user_id = ${users.id})`,
        totalSpent: sql<string>`coalesce((select sum(total::numeric)::text from orders where orders.user_id = ${users.id}), '0')`,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
    res.json(all);
  } catch (err) {
    console.error("Admin customers error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
