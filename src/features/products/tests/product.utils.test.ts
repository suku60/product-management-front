import {
  computeFinalPrice,
  formatPrice,
  isLowStock,
  isOutOfStock,
  matchesFilters,
  sortProducts,
  computeTotalInventoryValue,
  computeAverageRating,
  LOW_STOCK_THRESHOLD,
} from '../utils/product.utils';
import type { Product, ProductFilters, ProductSortConfig } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  category: 'electronics',
  price: 100,
  discountPercentage: 0,
  rating: 4.5,
  stock: 50,
  tags: [],
  brand: 'TestBrand',
  sku: 'TEST-001',
  weight: 1,
  dimensions: { width: 10, height: 10, depth: 10 },
  warrantyInformation: '1 year',
  shippingInformation: 'Ships in 2-3 days',
  availabilityStatus: 'In Stock',
  reviews: [],
  returnPolicy: '30 days',
  minimumOrderQuantity: 1,
  meta: { createdAt: '', updatedAt: '', barcode: '', qrCode: '' },
  images: [],
  thumbnail: '',
  ...overrides,
});

const DEFAULT_FILTERS: ProductFilters = {
  category: null,
  minRating: null,
  minPrice: null,
  maxPrice: null,
  availabilityStatus: null,
  searchQuery: '',
};

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

describe('computeFinalPrice', () => {
  it('returns original price when discount is 0', () => {
    expect(computeFinalPrice(100, 0)).toBe(100);
  });

  it('applies 10% discount correctly', () => {
    expect(computeFinalPrice(100, 10)).toBe(90);
  });

  it('applies 33.33% discount and rounds to 2 decimal places', () => {
    expect(computeFinalPrice(100, 33.33)).toBe(66.67);
  });

  it('handles 100% discount', () => {
    expect(computeFinalPrice(100, 100)).toBe(0);
  });
});

describe('formatPrice', () => {
  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats an integer price', () => {
    expect(formatPrice(99)).toBe('$99.00');
  });

  it('formats a price with cents', () => {
    expect(formatPrice(49.99)).toBe('$49.99');
  });
});

describe('isLowStock', () => {
  it('returns true when stock is at threshold', () => {
    expect(isLowStock(LOW_STOCK_THRESHOLD)).toBe(true);
  });

  it('returns true when stock is below threshold', () => {
    expect(isLowStock(1)).toBe(true);
  });

  it('returns false when stock is above threshold', () => {
    expect(isLowStock(LOW_STOCK_THRESHOLD + 1)).toBe(false);
  });

  it('returns false when stock is 0 (out of stock, not low)', () => {
    expect(isLowStock(0)).toBe(false);
  });
});

describe('isOutOfStock', () => {
  it('returns true when stock is 0', () => {
    expect(isOutOfStock(0)).toBe(true);
  });

  it('returns false when stock is > 0', () => {
    expect(isOutOfStock(1)).toBe(false);
  });
});

describe('matchesFilters', () => {
  it('returns true when all filters are null', () => {
    const product = makeProduct();
    expect(matchesFilters(product, DEFAULT_FILTERS)).toBe(true);
  });

  it('filters by category', () => {
    const product = makeProduct({ category: 'electronics' });
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, category: 'electronics' })).toBe(true);
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, category: 'furniture' })).toBe(false);
  });

  it('filters by minimum rating', () => {
    const product = makeProduct({ rating: 3.5 });
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, minRating: 3.0 })).toBe(true);
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, minRating: 4.0 })).toBe(false);
  });

  it('filters by price range', () => {
    const product = makeProduct({ price: 50 });
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, minPrice: 30, maxPrice: 80 })).toBe(true);
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, minPrice: 60 })).toBe(false);
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, maxPrice: 40 })).toBe(false);
  });

  it('filters by search query (case-insensitive, matches title)', () => {
    const product = makeProduct({ title: 'Wireless Headphones', brand: 'Sony' });
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, searchQuery: 'wireless' })).toBe(true);
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, searchQuery: 'SONY' })).toBe(true);
    expect(matchesFilters(product, { ...DEFAULT_FILTERS, searchQuery: 'keyboard' })).toBe(false);
  });
});

describe('sortProducts', () => {
  const products = [
    makeProduct({ id: 1, title: 'Banana', price: 30 }),
    makeProduct({ id: 2, title: 'Apple', price: 10 }),
    makeProduct({ id: 3, title: 'Cherry', price: 20 }),
  ];

  it('sorts by title ascending', () => {
    const sort: ProductSortConfig = { field: 'title', direction: 'asc' };
    const result = sortProducts(products, sort);
    expect(result.map((p) => p.title)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('sorts by title descending', () => {
    const sort: ProductSortConfig = { field: 'title', direction: 'desc' };
    const result = sortProducts(products, sort);
    expect(result.map((p) => p.title)).toEqual(['Cherry', 'Banana', 'Apple']);
  });

  it('sorts by price ascending', () => {
    const sort: ProductSortConfig = { field: 'price', direction: 'asc' };
    const result = sortProducts(products, sort);
    expect(result.map((p) => p.price)).toEqual([10, 20, 30]);
  });

  it('does not mutate the original array', () => {
    const original = [...products];
    sortProducts(products, { field: 'price', direction: 'asc' });
    expect(products).toEqual(original);
  });
});

describe('computeTotalInventoryValue', () => {
  it('returns 0 for empty list', () => {
    expect(computeTotalInventoryValue([])).toBe(0);
  });

  it('computes value with no discounts', () => {
    const products = [makeProduct({ price: 10, discountPercentage: 0, stock: 5 })];
    expect(computeTotalInventoryValue(products)).toBe(50);
  });

  it('applies discount to each unit', () => {
    const products = [makeProduct({ price: 100, discountPercentage: 50, stock: 2 })];
    expect(computeTotalInventoryValue(products)).toBe(100);
  });
});

describe('computeAverageRating', () => {
  it('returns 0 for empty array', () => {
    expect(computeAverageRating([])).toBe(0);
  });

  it('computes average correctly', () => {
    const products = [
      makeProduct({ rating: 4.0 }),
      makeProduct({ rating: 5.0 }),
      makeProduct({ rating: 3.0 }),
    ];
    expect(computeAverageRating(products)).toBe(4.0);
  });
});
