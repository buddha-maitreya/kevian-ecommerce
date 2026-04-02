import { useState, useEffect } from "react";
import { api } from "../../lib/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Customer[]>("/admin/customers")
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Customers</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Phone</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Type</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Orders</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Total Spent</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.role === "wholesale"
                      ? "bg-accent/10 text-accent"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {c.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{c.orderCount}</td>
                <td className="px-4 py-3 text-right font-medium">
                  KES {parseFloat(c.totalSpent).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No customers yet</div>
        )}
      </div>
    </div>
  );
}
