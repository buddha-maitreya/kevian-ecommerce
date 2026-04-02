import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Product } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { track } from "../lib/analytics";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Product>(`/products/${id}`)
      .then((p) => {
        setProduct(p);
        if (p.wholesaleMinQty) setQuantity(p.wholesaleMinQty);
        track("product_view", p.id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    setError("");
    try {
      await addToCart(product!.id, quantity);
      track("add_to_cart", product!.id, { quantity });
      navigate("/cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12 text-gray-500">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-gray-400">No image available</div>
          )}
        </div>

        <div>
          <span className="text-sm text-accent font-medium uppercase">{product.brand}</span>
          <h1 className="text-3xl font-bold text-primary mt-1">{product.name}</h1>
          {product.description && (
            <p className="text-gray-600 mt-4">{product.description}</p>
          )}

          <div className="mt-6">
            <span className="text-3xl font-bold text-primary">
              KES {parseFloat(product.price).toLocaleString()}
            </span>
            {product.wholesalePrice && (
              <span className="text-sm text-gray-500 ml-2">
                (wholesale price)
              </span>
            )}
          </div>

          {product.wholesaleMinQty && (
            <p className="text-sm text-gray-500 mt-2">
              Minimum order: {product.wholesaleMinQty} units
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              min={product.wholesaleMinQty || 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mt-4 text-sm">{error}</div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="mt-6 bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {product.stock <= 0
              ? "Out of Stock"
              : adding
                ? "Adding..."
                : "Add to Cart"}
          </button>

          <div className="mt-4 text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
          </div>

          {/* Partner e-commerce links (Option B) */}
          {product.partnerLinks && product.partnerLinks.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Also available on
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.partnerLinks.map((link) => (
                  <a
                    key={link.partner}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("partner_click", product.id, { partner: link.partner })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                  >
                    {link.partner.charAt(0).toUpperCase() + link.partner.slice(1)}
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
