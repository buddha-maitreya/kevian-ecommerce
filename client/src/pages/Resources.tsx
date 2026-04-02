import { useAuth } from "../context/AuthContext";

const resources = [
  {
    name: "Product Catalogue 2026",
    description: "Complete product listing with specifications, pack sizes, and barcodes",
    type: "PDF",
    wholesaleOnly: false,
  },
  {
    name: "Wholesale Price List",
    description: "Current wholesale pricing for all brands and SKUs",
    type: "PDF",
    wholesaleOnly: true,
  },
  {
    name: "POS Materials — Shelf Talkers",
    description: "Print-ready shelf talker designs for all AFIA and Pick N Peel products",
    type: "ZIP",
    wholesaleOnly: true,
  },
  {
    name: "POS Materials — Posters",
    description: "High-resolution promotional posters for in-store display",
    type: "ZIP",
    wholesaleOnly: true,
  },
  {
    name: "Brand Guidelines",
    description: "Kevian Kenya brand identity guide — logos, colours, typography, usage rules",
    type: "PDF",
    wholesaleOnly: true,
  },
  {
    name: "Distributor Onboarding Guide",
    description: "Step-by-step guide for new trade partners",
    type: "PDF",
    wholesaleOnly: true,
  },
];

export default function Resources() {
  const { user } = useAuth();
  const isWholesale = user?.role === "wholesale";

  const visible = resources.filter((r) => !r.wholesaleOnly || isWholesale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-2">Downloadable Resources</h1>
      <p className="text-gray-600 mb-8">
        Product catalogues, POS materials, and brand guidelines.
        {!isWholesale && (
          <span className="text-sm text-accent ml-1">
            Sign up as a wholesale partner to access all resources.
          </span>
        )}
      </p>

      <div className="space-y-4">
        {visible.map((resource) => (
          <div
            key={resource.name}
            className="bg-white rounded-lg shadow p-5 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-primary">{resource.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {resource.type}
              </span>
              <button className="bg-accent text-white px-4 py-2 rounded text-sm font-medium hover:bg-accent/90 transition-colors">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
