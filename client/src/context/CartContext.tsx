import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "../lib/api";
import { CartItem } from "../lib/types";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refresh: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<CartItem[]>("/cart");
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId: string, quantity: number) => {
    await api.post("/cart", { productId, quantity });
    await refresh();
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    await api.patch(`/cart/${cartItemId}`, { quantity });
    await refresh();
  };

  const removeItem = async (cartItemId: string) => {
    await api.delete(`/cart/${cartItemId}`);
    await refresh();
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, addToCart, updateQuantity, removeItem, refresh, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
