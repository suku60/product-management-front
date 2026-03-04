// ─────────────────────────────────────────────────────────────
// Product domain types — mirrors dummyjson.com/products API
// ─────────────────────────────────────────────────────────────

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: AvailabilityStatus;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

// ─────────────────────────────────────────────────────────────
// Derived / computed types
// ─────────────────────────────────────────────────────────────

export interface ProductSummary {
  id: Product['id'];
  title: Product['title'];
  category: Product['category'];
  price: Product['price'];
  discountPercentage: Product['discountPercentage'];
  finalPrice: number;
  rating: Product['rating'];
  stock: Product['stock'];
  availabilityStatus: Product['availabilityStatus'];
  thumbnail: Product['thumbnail'];
  brand: Product['brand'];
}

export interface ProductKPIs {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  averageRating: number;
}

// ─────────────────────────────────────────────────────────────
// Filter / sorting types
// ─────────────────────────────────────────────────────────────

export type SortField = 'title' | 'price' | 'rating' | 'stock' | 'discountPercentage';
export type SortDirection = 'asc' | 'desc';

export interface ProductFilters {
  category: string | null;
  minRating: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  availabilityStatus: AvailabilityStatus | null;
  searchQuery: string;
}

export interface ProductSortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
}
