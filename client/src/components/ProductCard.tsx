import { Link } from "react-router-dom";
import { Product } from "../lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-accent font-medium uppercase">{product.brand}</span>
        <h3 className="font-semibold text-primary mt-1 line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            KES {parseFloat(product.price).toLocaleString()}
          </span>
          {product.wholesaleMinQty && (
            <span className="text-xs text-gray-500">
              min. {product.wholesaleMinQty} units
            </span>
          )}
        </div>
        {product.stock <= 0 && (
          <span className="text-xs text-red-500 font-medium">Out of stock</span>
        )}
      </div>
    </Link>
  );
}
