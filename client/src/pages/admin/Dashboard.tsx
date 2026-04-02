import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

interface Insights {
  period: { days: number; since: string };
  topViewedProducts: { productName: string; brand: string; views: number }[];
  topSearchQueries: { query: string; count: number }[];
  partnerClickDistribution: { partner: string; clicks: number }[];
  eventSummary: { event: string; count: number }[];
  dailyActivity: { date: string; views: number; searches: number; addToCarts: number; checkouts: number }[];
}

export default function Dashboard() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Insights>("/analytics/insights?days=30")
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const eventMap = Object.fromEntries(
    (insights?.eventSummary || []).map((e) => [e.event, e.count])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="bg-accent text-white px-4 py-2 rounded text-sm font-medium hover:bg-accent/90">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary/90">
            Manage Orders
          </Link>
          <Link to="/admin/customers" className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:border-gray-400">
            Customers
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading analytics...</div>
      ) : !insights ? (
        <div className="text-center py-12 text-gray-500">No analytics data yet</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Product Views", value: eventMap["product_view"] || 0, color: "text-blue-600" },
              { label: "Searches", value: eventMap["search"] || 0, color: "text-purple-600" },
              { label: "Add to Cart", value: eventMap["add_to_cart"] || 0, color: "text-accent" },
              { label: "Checkouts", value: eventMap["checkout"] || 0, color: "text-green-600" },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-lg shadow p-5">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="font-semibold text-primary mb-4">Top Viewed Products</h2>
              {insights.topViewedProducts.length === 0 ? (
                <p className="text-sm text-gray-500">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {insights.topViewedProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{p.productName}</p>
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">{p.views} views</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Searches */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="font-semibold text-primary mb-4">Top Search Queries</h2>
              {insights.topSearchQueries.length === 0 ? (
                <p className="text-sm text-gray-500">No searches yet</p>
              ) : (
                <div className="space-y-3">
                  {insights.topSearchQueries.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm">&ldquo;{s.query}&rdquo;</p>
                      <span className="text-sm font-bold text-primary">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Partner Clicks */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="font-semibold text-primary mb-4">Partner Platform Clicks</h2>
              {insights.partnerClickDistribution.length === 0 ? (
                <p className="text-sm text-gray-500">No partner clicks yet</p>
              ) : (
                <div className="space-y-3">
                  {insights.partnerClickDistribution.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm font-medium capitalize">{p.partner}</p>
                      <span className="text-sm font-bold text-primary">{p.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Activity */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="font-semibold text-primary mb-4">Daily Activity (Last 7 Days)</h2>
              {insights.dailyActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No activity yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-2">Date</th>
                        <th className="pb-2 text-right">Views</th>
                        <th className="pb-2 text-right">Searches</th>
                        <th className="pb-2 text-right">Carts</th>
                        <th className="pb-2 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {insights.dailyActivity.slice(-7).map((d) => (
                        <tr key={d.date}>
                          <td className="py-2">{d.date}</td>
                          <td className="py-2 text-right">{d.views}</td>
                          <td className="py-2 text-right">{d.searches}</td>
                          <td className="py-2 text-right">{d.addToCarts}</td>
                          <td className="py-2 text-right">{d.checkouts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
