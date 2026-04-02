import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import { Order } from "../lib/types";
import { track } from "../lib/analytics";

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, refresh } = useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError("");
    try {
      const order = await api.post<Order>("/orders", {});
      track("checkout", undefined, { orderId: order.id, total });
      await refresh();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="text-accent font-semibold hover:underline"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No img</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-semibold text-primary hover:text-accent"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-gray-500">{item.product.brand}</div>
                  <div className="text-sm font-medium mt-1">
                    KES {parseFloat(item.product.price).toLocaleString()} each
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 1;
                      updateQuantity(item.id, qty);
                    }}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                  >
                    Remove
                  </button>
                </div>

                <div className="text-right font-semibold w-28">
                  KES {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-primary">
                Total: KES {total.toLocaleString()}
              </span>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
