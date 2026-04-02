import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"retail" | "wholesale">("retail");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined, role });
      navigate("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-6">Create Account</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Full Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border px-3 py-2 focus:border-accent focus:ring-accent"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border px-3 py-2 focus:border-accent focus:ring-accent"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Phone (optional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border px-3 py-2 focus:border-accent focus:ring-accent"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 border px-3 py-2 focus:border-accent focus:ring-accent"
          />
        </label>

        <fieldset className="mb-6">
          <legend className="text-sm font-medium text-gray-700 mb-2">Account Type</legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("retail")}
              className={`p-3 rounded border text-center transition-colors ${
                role === "retail"
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <div className="font-medium">Retail</div>
              <div className="text-xs mt-1">Individual buyer</div>
            </button>
            <button
              type="button"
              onClick={() => setRole("wholesale")}
              className={`p-3 rounded border text-center transition-colors ${
                role === "wholesale"
                  ? "border-accent bg-accent/10 text-accent font-semibold"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <div className="font-medium">Wholesale</div>
              <div className="text-xs mt-1">Bulk buyer</div>
            </button>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-2.5 rounded font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
