import { db } from "./index.js";
import { users, products, partnerLinks } from "./schema.js";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // ─── Test Users ───
  const retailPass = await bcrypt.hash("retail123", 10);
  const wholesalePass = await bcrypt.hash("wholesale123", 10);
  const adminPass = await bcrypt.hash("admin123", 10);

  await db.insert(users).values([
    { name: "Jane Wanjiku", email: "jane@example.com", passwordHash: retailPass, phone: "+254712345678", role: "retail" },
    { name: "John Ochieng", email: "john@example.com", passwordHash: retailPass, phone: "+254723456789", role: "retail" },
    { name: "Amina Hassan", email: "amina@example.com", passwordHash: wholesalePass, phone: "+254734567890", role: "wholesale" },
    { name: "Peter Kamau", email: "peter@example.com", passwordHash: wholesalePass, phone: "+254745678901", role: "wholesale" },
    { name: "Admin User", email: "admin@keviankenya.com", passwordHash: adminPass, phone: "+254700000000", role: "retail" },
  ]);
  console.log("  ✓ Users created");

  // ─── Products ───
  const productData = [
    // AFIA Fruit Drinks
    { name: "AFIA Mango Fruit Drink 1L", description: "Rich and refreshing mango fruit drink made from the finest African mangoes. Perfect for the whole family.", brand: "afia", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 500, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop" },
    { name: "AFIA Orange Fruit Drink 1L", description: "Tangy and sweet orange fruit drink bursting with citrus flavour. A Kenyan household favourite.", brand: "afia", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 450, imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=600&fit=crop" },
    { name: "AFIA Apple Fruit Drink 1L", description: "Crisp apple fruit drink — an apple a day keeps the doctor away. Natural goodness in every sip.", brand: "afia", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 400, imageUrl: "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=600&h=600&fit=crop" },
    { name: "AFIA Mixed Fruit Drink 1L", description: "A delightful blend of tropical fruits for an explosion of flavour. The taste of Africa in a bottle.", brand: "afia", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 350, imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop" },
    { name: "AFIA Tropical Carrot Drink 1L", description: "Unique blend of tropical fruits and carrot for a nutritious and refreshing beverage.", brand: "afia", category: "fruit_drink", retailPrice: "160.00", wholesalePrice: "128.00", wholesaleMinQty: 24, stock: 300, imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop" },
    { name: "AFIA Pineapple Fruit Drink 1L", description: "Sweet and tangy pineapple drink capturing the tropical essence of East Africa.", brand: "afia", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 380, imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop" },
    { name: "AFIA White Guava Drink 1L", description: "Smooth and exotic white guava fruit drink with a distinctly African twist.", brand: "afia", category: "fruit_drink", retailPrice: "160.00", wholesalePrice: "128.00", wholesaleMinQty: 24, stock: 250, imageUrl: "https://images.unsplash.com/photo-1587015990127-424b954b5890?w=600&h=600&fit=crop" },
    { name: "AFIA Lemon Fruit Drink 1L", description: "Zesty lemon drink that refreshes and revitalises. Perfect for hot Kenyan afternoons.", brand: "afia", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 320, imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=600&fit=crop" },
    { name: "AFIA Hibiscus Fruit Drink 1L", description: "Traditional hibiscus-infused drink with a modern twist. Bold, vibrant, and uniquely African.", brand: "afia", category: "fruit_drink", retailPrice: "170.00", wholesalePrice: "136.00", wholesaleMinQty: 24, stock: 200, imageUrl: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop" },
    { name: "AFIA Multi-Vitamin Drink 1L", description: "Fortified with essential vitamins for daily health support. Great taste meets nutrition.", brand: "afia", category: "fruit_drink", retailPrice: "180.00", wholesalePrice: "144.00", wholesaleMinQty: 24, stock: 280, imageUrl: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&h=600&fit=crop" },
    // AFIA Energy
    { name: "AFIA Energy Drink 250ml", description: "Power-packed energy drink for those who push beyond limits. Fuel your day the African way.", brand: "afia", category: "energy_drink", retailPrice: "120.00", wholesalePrice: "90.00", wholesaleMinQty: 48, stock: 600, imageUrl: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&h=600&fit=crop" },
    { name: "AFIA Energy Drink 500ml", description: "Double the energy, double the power. Extended fuel for extended performance.", brand: "afia", category: "energy_drink", retailPrice: "200.00", wholesalePrice: "160.00", wholesaleMinQty: 24, stock: 400, imageUrl: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&h=600&fit=crop" },
    { name: "AFIA Boost Drink 250ml", description: "Vitality boost drink packed with B-vitamins and natural extracts for sustained energy.", brand: "afia", category: "energy_drink", retailPrice: "100.00", wholesalePrice: "75.00", wholesaleMinQty: 48, stock: 500, imageUrl: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&h=600&fit=crop" },

    // Pick N Peel
    { name: "Pick N Peel Orange Juice 1L", description: "Premium cold-pressed orange juice with no added sugar. Pure, natural, and delicious.", brand: "pick_n_peel", category: "fruit_drink", retailPrice: "250.00", wholesalePrice: "200.00", wholesaleMinQty: 12, stock: 300, imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602d23?w=600&h=600&fit=crop" },
    { name: "Pick N Peel Mango Juice 1L", description: "Luscious mango juice squeezed from sun-ripened East African mangoes. Nature's sweetness preserved.", brand: "pick_n_peel", category: "fruit_drink", retailPrice: "250.00", wholesalePrice: "200.00", wholesaleMinQty: 12, stock: 280, imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&h=600&fit=crop" },
    { name: "Pick N Peel Apple Juice 1L", description: "Freshly pressed apple juice with a crisp, clean taste. No preservatives, just pure fruit.", brand: "pick_n_peel", category: "fruit_drink", retailPrice: "250.00", wholesalePrice: "200.00", wholesaleMinQty: 12, stock: 260, imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2uj38?w=600&h=600&fit=crop" },
    { name: "Pick N Peel Tropical Mix 1L", description: "Exotic tropical fruit blend combining passion fruit, pineapple, and mango.", brand: "pick_n_peel", category: "fruit_drink", retailPrice: "260.00", wholesalePrice: "208.00", wholesaleMinQty: 12, stock: 220, imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&h=600&fit=crop" },
    { name: "Pick N Peel Orange Juice 500ml", description: "Convenient 500ml pack of our premium cold-pressed orange juice. Perfect on the go.", brand: "pick_n_peel", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 400, imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop" },
    { name: "Pick N Peel Mango Juice 500ml", description: "Half-litre of pure mango bliss. Ideal for lunchboxes and quick refreshment.", brand: "pick_n_peel", category: "fruit_drink", retailPrice: "150.00", wholesalePrice: "120.00", wholesaleMinQty: 24, stock: 350, imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=600&fit=crop" },

    // Acacia Kids
    { name: "Acacia Kids Apple Drink 200ml", description: "Specially formulated for children with reduced sugar and added vitamins. Fun and healthy!", brand: "acacia_kids", category: "kids", retailPrice: "50.00", wholesalePrice: "35.00", wholesaleMinQty: 48, stock: 800, imageUrl: "https://images.unsplash.com/photo-1560526860-1f0ece675883?w=600&h=600&fit=crop" },
    { name: "Acacia Kids Orange Drink 200ml", description: "Kid-friendly orange drink with vitamin C fortification. The taste children love, the nutrition parents trust.", brand: "acacia_kids", category: "kids", retailPrice: "50.00", wholesalePrice: "35.00", wholesaleMinQty: 48, stock: 750, imageUrl: "https://images.unsplash.com/photo-1587015990127-424b954b5890?w=600&h=600&fit=crop" },
    { name: "Acacia Kids Mango Drink 200ml", description: "Tropical mango flavour that kids can't resist. Low sugar, high fun.", brand: "acacia_kids", category: "kids", retailPrice: "50.00", wholesalePrice: "35.00", wholesaleMinQty: 48, stock: 700, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop" },
    { name: "Acacia Kids Mixed Berry 200ml", description: "Berrylicious blend of strawberry, blueberry, and raspberry. A colourful treat for little ones.", brand: "acacia_kids", category: "kids", retailPrice: "55.00", wholesalePrice: "38.00", wholesaleMinQty: 48, stock: 650, imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=600&fit=crop" },
    { name: "Acacia Kids Variety Pack (12)", description: "Assorted pack of 12 drinks — 3 each of Apple, Orange, Mango, and Mixed Berry.", brand: "acacia_kids", category: "kids", retailPrice: "550.00", wholesalePrice: "380.00", wholesaleMinQty: 10, stock: 200, imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600&h=600&fit=crop" },

    // Mt Kenyan Water
    { name: "Mt Kenyan Water 500ml", description: "Pure natural spring water from the slopes of Mount Kenya. Crisp, clean, and mineral-rich.", brand: "mt_kenyan_water", category: "water", retailPrice: "30.00", wholesalePrice: "20.00", wholesaleMinQty: 48, stock: 2000, imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=600&fit=crop" },
    { name: "Mt Kenyan Water 1L", description: "One litre of Kenya's finest natural water. Sourced and bottled at the source for maximum freshness.", brand: "mt_kenyan_water", category: "water", retailPrice: "50.00", wholesalePrice: "35.00", wholesaleMinQty: 24, stock: 1500, imageUrl: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&h=600&fit=crop" },
    { name: "Mt Kenyan Water 1.5L", description: "Family-sized natural spring water. Stay hydrated throughout the day.", brand: "mt_kenyan_water", category: "water", retailPrice: "70.00", wholesalePrice: "50.00", wholesaleMinQty: 12, stock: 1000, imageUrl: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&h=600&fit=crop" },
    { name: "Mt Kenyan Water 5L", description: "Bulk 5-litre bottle for home and office use. Pure Mount Kenya spring water.", brand: "mt_kenyan_water", category: "water", retailPrice: "180.00", wholesalePrice: "140.00", wholesaleMinQty: 6, stock: 500, imageUrl: "https://images.unsplash.com/photo-1606168094336-48f205276929?w=600&h=600&fit=crop" },
    { name: "Mt Kenyan Water 18.9L Dispenser", description: "Dispenser-ready 18.9L bottle for homes, offices, and commercial use. The purest hydration.", brand: "mt_kenyan_water", category: "water", retailPrice: "450.00", wholesalePrice: "350.00", wholesaleMinQty: 4, stock: 300, imageUrl: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&h=600&fit=crop" },

    // Kevian Sauces
    { name: "Kevian Tomato Sauce 400g", description: "Rich and tangy tomato sauce made from vine-ripened Kenyan tomatoes. Perfect for every meal.", brand: "kevian_sauces", category: "sauce", retailPrice: "180.00", wholesalePrice: "140.00", wholesaleMinQty: 24, stock: 400, imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&h=600&fit=crop" },
    { name: "Kevian Chilli Sauce 250ml", description: "Fiery chilli sauce for those who like it hot. Authentic African heat in every drop.", brand: "kevian_sauces", category: "sauce", retailPrice: "200.00", wholesalePrice: "160.00", wholesaleMinQty: 24, stock: 300, imageUrl: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&h=600&fit=crop" },
    { name: "Kevian BBQ Sauce 400g", description: "Smoky, sweet, and savory BBQ sauce. The perfect companion for nyama choma.", brand: "kevian_sauces", category: "sauce", retailPrice: "220.00", wholesalePrice: "176.00", wholesaleMinQty: 24, stock: 250, imageUrl: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=600&h=600&fit=crop" },
    { name: "Kevian Soy Sauce 250ml", description: "Premium soy sauce for Asian-inspired cooking. Adds depth and umami to any dish.", brand: "kevian_sauces", category: "sauce", retailPrice: "160.00", wholesalePrice: "128.00", wholesaleMinQty: 24, stock: 350, imageUrl: "https://images.unsplash.com/photo-1585672840563-f2af2ced55c9?w=600&h=600&fit=crop" },
    { name: "Kevian Garlic Sauce 250ml", description: "Creamy garlic sauce that elevates any dish. Made with real garlic cloves.", brand: "kevian_sauces", category: "sauce", retailPrice: "190.00", wholesalePrice: "152.00", wholesaleMinQty: 24, stock: 280, imageUrl: "https://images.unsplash.com/photo-1534483509719-8127d7d0f78d?w=600&h=600&fit=crop" },
  ];

  const insertedProducts = await db.insert(products).values(
    productData.map((p) => ({ ...p, active: true }))
  ).returning({ id: products.id, name: products.name });
  console.log(`  ✓ ${insertedProducts.length} products created`);

  // ─── Partner Links ───
  const partnerData: { productName: string; partner: string; url: string }[] = [];
  for (const p of insertedProducts) {
    partnerData.push(
      { productName: p.name, partner: "jumia", url: `https://www.jumia.co.ke/catalog/?q=${encodeURIComponent(p.name)}` },
      { productName: p.name, partner: "glovo", url: "https://glovoapp.com/ke/en/nairobi/" },
      { productName: p.name, partner: "carrefour", url: `https://www.carrefour.ke/mafken/en/search?q=${encodeURIComponent(p.name)}` },
    );
  }

  await db.insert(partnerLinks).values(
    partnerData.map((pl) => ({
      productId: insertedProducts.find((p) => p.name === pl.productName)!.id,
      partner: pl.partner,
      url: pl.url,
      active: true,
    }))
  );
  console.log(`  ✓ ${partnerData.length} partner links created`);

  console.log("\nSeeding complete!");
  console.log("\nTest accounts:");
  console.log("  Retail:    jane@example.com / retail123");
  console.log("  Wholesale: amina@example.com / wholesale123");
  console.log("  Admin:     admin@keviankenya.com / admin123");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
