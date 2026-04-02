import { api } from "./api";

type EventName = "product_view" | "search" | "add_to_cart" | "checkout" | "partner_click";

export function track(event: EventName, productId?: string, metadata?: Record<string, unknown>) {
  api.post("/analytics/track", { event, productId, metadata }).catch(() => {
    // analytics should never block UX
  });
}
