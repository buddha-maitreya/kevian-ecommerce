import { useState, useEffect } from "react";
import { api } from "../../lib/api";

interface AdminProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  retailPrice: string;
  wholesalePrice: string;
  wholesaleMinQty: number;
  stock: number;
  active: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get<AdminProduct[]>("/admin/products")
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleActive = async (p: AdminProduct) => {
    await api.patch(`/admin/products/${p.id}`, { active: !p.active });
    load();
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Manage Products</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Brand</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Retail</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Wholesale</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">MOQ</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Stock</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className={!p.active ? "opacity-50" : ""}>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                <td className="px-4 py-3 text-right">KES {parseFloat(p.retailPrice).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">KES {parseFloat(p.wholesalePrice).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{p.wholesaleMinQty}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(p)}
                    className="text-sm text-accent hover:underline"
                  >
                    {p.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">No products yet</div>
        )}
      </div>
    </div>
  );
}
