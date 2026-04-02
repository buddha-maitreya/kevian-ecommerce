import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { PaginatedProducts } from "../lib/types";
import ProductCard from "../components/ProductCard";
import { track } from "../lib/analytics";

const brands = ["afia", "pick_n_peel", "acacia_kids", "mt_kenyan_water", "kevian_sauces"];
const brandLabels: Record<string, string> = {
  afia: "AFIA",
  pick_n_peel: "Pick N Peel",
  acacia_kids: "Acacia Kids",
  mt_kenyan_water: "Mt Kenyan Water",
  kevian_sauces: "Kevian Sauces",
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const brand = searchParams.get("brand") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (brand) params.set("brand", brand);
    params.set("page", String(page));
    params.set("limit", "20");

    api
      .get<PaginatedProducts>(`/products?${params}`)
      .then((result) => {
        setData(result);
        if (search) track("search", undefined, { query: search, brand, results: result.pagination.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, brand, page]);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateParams({ q: e.target.value });
          }}
          className="border border-gray-300 rounded px-4 py-2 w-64 focus:border-accent focus:ring-accent"
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateParams({ brand: "" })}
            className={`px-4 py-2 rounded text-sm ${
              !brand
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => updateParams({ brand: b })}
              className={`px-4 py-2 rounded text-sm ${
                brand === b
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {brandLabels[b]}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : !data || data.products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set("page", String(i + 1));
                    setSearchParams(next);
                  }}
                  className={`w-10 h-10 rounded ${
                    page === i + 1
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
