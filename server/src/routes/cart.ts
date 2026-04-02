import { Router, Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { cartItems, products } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        product: {
          id: products.id,
          name: products.name,
          brand: products.brand,
          imageUrl: products.imageUrl,
          retailPrice: products.retailPrice,
          wholesalePrice: products.wholesalePrice,
          wholesaleMinQty: products.wholesaleMinQty,
          stock: products.stock,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, req.user!.userId));

    const userRole = req.user!.role;

    const mapped = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        ...item.product,
        price:
          userRole === "wholesale"
            ? item.product.wholesalePrice
            : item.product.retailPrice,
      },
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Cart list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = addToCartSchema.parse(req.body);
    const userId = req.user!.userId;

    // Check product exists
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, body.productId))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Enforce wholesale min qty
    if (req.user!.role === "wholesale" && body.quantity < product.wholesaleMinQty) {
      res.status(400).json({
        error: `Wholesale minimum quantity is ${product.wholesaleMinQty}`,
      });
      return;
    }

    // Check if already in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, body.productId)))
      .limit(1);

    if (existing) {
      const newQty = existing.quantity + body.quantity;
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: newQty })
        .where(eq(cartItems.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [item] = await db
        .insert(cartItems)
        .values({ userId, productId: body.productId, quantity: body.quantity })
        .returning();
      res.status(201).json(item);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Cart add error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateCartSchema = z.object({
  quantity: z.number().int().min(1),
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const body = updateCartSchema.parse(req.body);

    const id = req.params.id as string;
    const [item] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, req.user!.userId)))
      .limit(1);

    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    // Enforce wholesale min qty
    if (req.user!.role === "wholesale") {
      const [product] = await db
        .select({ wholesaleMinQty: products.wholesaleMinQty })
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (product && body.quantity < product.wholesaleMinQty) {
        res.status(400).json({
          error: `Wholesale minimum quantity is ${product.wholesaleMinQty}`,
        });
        return;
      }
    }

    const [updated] = await db
      .update(cartItems)
      .set({ quantity: body.quantity })
      .where(eq(cartItems.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("Cart update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const [item] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.id, id), eq(cartItems.userId, req.user!.userId)))
      .limit(1);

    if (!item) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    await db.delete(cartItems).where(eq(cartItems.id, id));
    res.status(204).send();
  } catch (err) {
    console.error("Cart delete error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
