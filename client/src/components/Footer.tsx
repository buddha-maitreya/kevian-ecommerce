export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-accent font-bold text-lg mb-2">Kevian Kenya Ltd</h3>
            <p className="text-sm">Pure African Delights</p>
            <p className="text-sm mt-2">P.O Box 25290 - 00603, Nairobi, Kenya</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-sm">+254 20 2024492</p>
            <p className="text-sm">+254 722 398802</p>
            <p className="text-sm">info@keviankenya.com</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Our Brands</h4>
            <p className="text-sm">AFIA &middot; Pick N Peel &middot; Acacia Kids</p>
            <p className="text-sm">Mt Kenyan Water &middot; Kevian Sauces</p>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-6 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Kevian Kenya Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
