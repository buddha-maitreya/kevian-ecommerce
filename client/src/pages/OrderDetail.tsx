import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Order } from "../lib/types";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order>(`/orders/${id}`)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12 text-gray-500">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-accent hover:underline text-sm mb-4 inline-block">
        &larr; Back to orders
      </Link>

      <h1 className="text-3xl font-bold text-primary mb-2">
        Order #{order.id.slice(0, 8)}
      </h1>
      <p className="text-gray-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleDateString()} &middot;{" "}
        <span className="capitalize font-medium">{order.status}</span>
      </p>

      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Product</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Price</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Qty</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{item.product.name}</div>
                    <div className="text-sm text-gray-500">{item.product.brand}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    KES {parseFloat(item.unitPrice).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    KES {(parseFloat(item.unitPrice) * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mt-4 text-right">
        <span className="text-xl font-bold text-primary">
          Total: KES {parseFloat(order.total).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
