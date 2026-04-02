import { Link } from "react-router-dom";

const brands = [
  { name: "AFIA", description: "Fruit drinks, energy drinks & boost beverages" },
  { name: "Pick N Peel", description: "Premium natural fruit juices" },
  { name: "Acacia Kids", description: "Healthy drinks for children" },
  { name: "Mt Kenyan Water", description: "Pure natural drinking water" },
  { name: "Kevian Sauces", description: "Delicious African sauces" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Pure African <span className="text-accent">Delights</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Kevian Kenya Ltd — East Africa's leading manufacturer of premium fruit
            juices, drinking water, and beverages. Shop wholesale or retail.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="bg-accent text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/register"
              className="border border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-10">Our Brands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={`/products?brand=${encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, "_"))}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-accent mb-2">{brand.name}</h3>
                <p className="text-gray-600">{brand.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Wholesale Buyers</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Register as a wholesale customer to access discounted bulk pricing on all our
            products. Minimum order quantities apply.
          </p>
          <Link
            to="/register"
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Register for Wholesale
          </Link>
        </div>
      </section>
    </div>
  );
}
