export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "retail" | "wholesale";
}

export interface PartnerLink {
  partner: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  brand: string;
  category: string;
  imageUrl?: string;
  price: string;
  retailPrice: string;
  wholesalePrice?: string;
  wholesaleMinQty?: number;
  stock: number;
  partnerLinks?: PartnerLink[];
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  status: string;
  total: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  product: {
    id: string;
    name: string;
    brand: string;
    imageUrl?: string;
  };
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
