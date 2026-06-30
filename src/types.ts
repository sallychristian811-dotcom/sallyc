export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: "woman" | "man" | "kids" | "shoes-bags" | "origins";
  image: string;
  hoverImage?: string;
  description: string;
  sizes: string[];
  isNew?: boolean;
  studio?: boolean;
  subtitle?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export type ViewState = "home" | "woman" | "new-collection" | "wishlist";

export interface FilterState {
  category: string | null;
  sortBy: "price-asc" | "price-desc" | "default";
  searchQuery: string;
}
