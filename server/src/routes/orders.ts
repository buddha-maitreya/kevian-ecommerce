import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { cartItems, orders, orderItems, products } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    // Get cart items with product data
    const items = await db
      .select({
        cartItemId: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        retailPrice: products.retailPrice,
        wholesalePrice: products.wholesalePrice,
        wholesaleMinQty: products.wholesaleMinQty,
        stock: products.stock,
        productName: products.name,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    if (items.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    // Validate stock and wholesale min qty
    for (const item of items) {
      if (item.quantity > item.stock) {
        res.status(400).json({
          error: `Insufficient stock for ${item.productName}`,
        });
        return;
      }
      if (userRole === "wholesale" && item.quantity < item.wholesaleMinQty) {
        res.status(400).json({
          error: `Wholesale minimum for ${item.productName} is ${item.wholesaleMinQty}`,
        });
        return;
      }
    }

    // Calculate total
    let total = 0;
    const orderItemsData = items.map((item) => {
      const unitPrice =
        userRole === "wholesale"
          ? parseFloat(item.wholesalePrice)
          : parseFloat(item.retailPrice);
      total += unitPrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice.toFixed(2),
      };
    });

    // Create order
    const [order] = await db
      .insert(orders)
      .values({ userId, total: total.toFixed(2) })
      .returning();

    // Create order items
    await db.insert(orderItems).values(
      orderItemsData.map((oi) => ({
        orderId: order.id,
        ...oi,
      }))
    );

    // Update stock
    for (const item of items) {
      await db
        .update(products)
        .set({ stock: item.stock - item.quantity })
        .where(eq(products.id, item.productId));
    }

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    res.status(201).json(order);
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, req.user!.userId))
      .orderBy(orders.createdAt);

    res.json(userOrders);
  } catch (err) {
    console.error("Orders list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!order || order.userId !== req.user!.userId) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        product: {
          id: products.id,
          name: products.name,
          brand: products.brand,
          imageUrl: products.imageUrl,
        },
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    res.json({ ...order, items });
  } catch (err) {
    console.error("Order detail error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
