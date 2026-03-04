import type { Product, ProductFilters, ProductSortConfig, AvailabilityStatus } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Business logic constants
// ─────────────────────────────────────────────────────────────

export const LOW_STOCK_THRESHOLD = 10;

// ─────────────────────────────────────────────────────────────
// Price calculations
// ─────────────────────────────────────────────────────────────

/**
 * Computes the final price after discount.
 * Result is rounded to 2 decimal places.
 */
export function computeFinalPrice(price: number, discountPercentage: number): number {
  const discountMultiplier = 1 - discountPercentage / 100;
  return Math.round(price * discountMultiplier * 100) / 100;
}

/**
 * Formats a numeric price as a USD string.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

// ─────────────────────────────────────────────────────────────
// Stock utilities
// ─────────────────────────────────────────────────────────────

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
}

export function isOutOfStock(stock: number): boolean {
  return stock === 0;
}

export function getStockStatusLabel(status: AvailabilityStatus): string {
  const labels: Record<AvailabilityStatus, string> = {
    'In Stock': 'Available',
    'Low Stock': 'Limited',
    'Out of Stock': 'Unavailable',
  };
  return labels[status];
}

// ─────────────────────────────────────────────────────────────
// Filter logic
// ─────────────────────────────────────────────────────────────

export function matchesFilters(product: Product, filters: ProductFilters): boolean {
  if (filters.category !== null && product.category !== filters.category) return false;

  if (filters.minRating !== null && product.rating < filters.minRating) return false;

  if (filters.minPrice !== null && product.price < filters.minPrice) return false;

  if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

  if (
    filters.availabilityStatus !== null &&
    product.availabilityStatus !== filters.availabilityStatus
  )
    return false;

  if (filters.searchQuery.trim().length > 0) {
    const query = filters.searchQuery.toLowerCase();
    const searchableText = `${product.title} ${product.brand} ${product.category}`.toLowerCase();
    if (!searchableText.includes(query)) return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// Sort logic
// ─────────────────────────────────────────────────────────────

export function sortProducts(products: Product[], sort: ProductSortConfig): Product[] {
  return [...products].sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const comparison = aVal.localeCompare(bVal);
      return sort.direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
}

// ─────────────────────────────────────────────────────────────
// KPI calculations
// ─────────────────────────────────────────────────────────────

export function computeTotalInventoryValue(products: Product[]): number {
  return products.reduce((total, product) => {
    return total + computeFinalPrice(product.price, product.discountPercentage) * product.stock;
  }, 0);
}

export function computeAverageRating(products: Product[]): number {
  if (products.length === 0) return 0;
  const sum = products.reduce((acc, p) => acc + p.rating, 0);
  return Math.round((sum / products.length) * 10) / 10;
}
