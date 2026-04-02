import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-accent">KEVIAN</span>
          <span className="text-sm hidden sm:inline">Pure African Delights</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="hover:text-accent transition-colors">
            Products
          </Link>
          <Link to="/resources" className="hover:text-accent transition-colors">
            Resources
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="hover:text-accent transition-colors relative">
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-accent transition-colors">
                Orders
              </Link>
              <Link to="/admin" className="hover:text-accent transition-colors">
                Admin
              </Link>
              <div className="flex items-center gap-3">
                <Link to="/account" className="text-sm text-gray-300 hover:text-accent transition-colors">
                  {user.name}{" "}
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-accent transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-accent text-white px-4 py-1.5 rounded hover:bg-accent/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
