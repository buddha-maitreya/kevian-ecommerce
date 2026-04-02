import { Router, Request, Response } from "express";
import { eq, ilike, and, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, partnerLinks } from "../db/schema.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      q,
      brand,
      category,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [eq(products.active, true)];

    if (q) {
      conditions.push(ilike(products.name, `%${q}%`));
    }
    if (brand) {
      conditions.push(eq(products.brand, brand));
    }
    if (category) {
      conditions.push(eq(products.category, category));
    }

    const where = and(...conditions);

    const [items, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(where)
        .limit(limitNum)
        .offset(offset)
        .orderBy(products.name),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(where),
    ]);

    const total = countResult[0].count;
    const userRole = req.user?.role || "retail";

    const mapped = items.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      brand: p.brand,
      category: p.category,
      imageUrl: p.imageUrl,
      price: userRole === "wholesale" ? p.wholesalePrice : p.retailPrice,
      retailPrice: p.retailPrice,
      wholesalePrice: userRole === "wholesale" ? p.wholesalePrice : undefined,
      wholesaleMinQty: userRole === "wholesale" ? p.wholesaleMinQty : undefined,
      stock: p.stock,
    }));

    res.json({
      products: mapped,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Products list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const userRole = req.user?.role || "retail";

    // Fetch partner e-commerce links
    const partners = await db
      .select({ partner: partnerLinks.partner, url: partnerLinks.url })
      .from(partnerLinks)
      .where(and(eq(partnerLinks.productId, id), eq(partnerLinks.active, true)));

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      price: userRole === "wholesale" ? product.wholesalePrice : product.retailPrice,
      retailPrice: product.retailPrice,
      wholesalePrice: userRole === "wholesale" ? product.wholesalePrice : undefined,
      wholesaleMinQty: userRole === "wholesale" ? product.wholesaleMinQty : undefined,
      stock: product.stock,
      partnerLinks: partners,
    });
  } catch (err) {
    console.error("Product detail error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
