import { useState, useEffect } from "react";
import { api } from "../../lib/api";

interface AdminOrder {
  id: string;
  status: string;
  total: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  userRole: string;
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get<AdminOrder[]>("/admin/orders")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (orderId: string, status: string) => {
    await api.patch(`/admin/orders/${orderId}`, { status });
    load();
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Manage Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Order</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.userName}</div>
                  <div className="text-xs text-gray-500">{o.userEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{o.userRole}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  KES {parseFloat(o.total).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status] || "bg-gray-100"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No orders yet</div>
        )}
      </div>
    </div>
  );
}
