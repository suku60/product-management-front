import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { Product, ProductSummary } from '@/shared/types';
import { computeFinalPrice, isLowStock, matchesFilters, sortProducts } from '../utils/product.utils';

// ─────────────────────────────────────────────────────────────
// Base selectors (non-memoized — primitive values)
// ─────────────────────────────────────────────────────────────

export const selectProductsRaw = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectSelectedProductStatus = (state: RootState) => state.products.selectedProductStatus;
export const selectCategories = (state: RootState) => state.products.categories;
export const selectCategoriesStatus = (state: RootState) => state.products.categoriesStatus;
export const selectFilters = (state: RootState) => state.products.filters;
export const selectSort = (state: RootState) => state.products.sort;
export const selectPagination = (state: RootState) => state.products.pagination;

// ─────────────────────────────────────────────────────────────
// Memoized selectors
// ─────────────────────────────────────────────────────────────

/**
 * Products filtered and sorted by current UI state.
 * Re-computes only when items, filters, or sort change.
 */
export const selectFilteredProducts = createSelector(
  [selectProductsRaw, selectFilters, selectSort],
  (products, filters, sort): Product[] => {
    const filtered = products.filter((product) => matchesFilters(product, filters));
    return sortProducts(filtered, sort);
  },
);

/**
 * Products mapped to lightweight summary objects for table rendering.
 */
export const selectProductSummaries = createSelector(
  [selectFilteredProducts],
  (products): ProductSummary[] =>
    products.map((product) => ({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      finalPrice: computeFinalPrice(product.price, product.discountPercentage),
      rating: product.rating,
      stock: product.stock,
      availabilityStatus: product.availabilityStatus,
      thumbnail: product.thumbnail,
      brand: product.brand,
    })),
);

/**
 * Paginated slice of summaries for table display.
 */
export const selectPaginatedProductSummaries = createSelector(
  [selectProductSummaries, selectPagination],
  (summaries, pagination) => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return summaries.slice(start, end);
  },
);

/**
 * Total count of filtered products (for pagination UI).
 */
export const selectFilteredTotal = createSelector(
  [selectFilteredProducts],
  (products) => products.length,
);

/**
 * Whether any filter is currently active.
 */
export const selectHasActiveFilters = createSelector([selectFilters], (filters): boolean => {
  return (
    filters.category !== null ||
    filters.minRating !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.availabilityStatus !== null ||
    filters.searchQuery.trim().length > 0
  );
});

/**
 * Computed detail for the currently selected product.
 * Includes derived values (final price, stock status label).
 */
export const selectEnrichedSelectedProduct = createSelector(
  [selectSelectedProduct],
  (product) => {
    if (!product) return null;

    return {
      ...product,
      finalPrice: computeFinalPrice(product.price, product.discountPercentage),
      isLowStock: isLowStock(product.stock),
      savingsAmount: product.price - computeFinalPrice(product.price, product.discountPercentage),
    };
  },
);
