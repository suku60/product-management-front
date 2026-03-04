'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProducts,
  fetchCategories,
  setFilter,
  clearFilters,
  setSort,
  setPage,
} from '../store/productsSlice';
import {
  selectPaginatedProductSummaries,
  selectFilteredTotal,
  selectProductsStatus,
  selectProductsError,
  selectCategories,
  selectFilters,
  selectSort,
  selectPagination,
  selectHasActiveFilters,
} from '../store/products.selectors';
import type { ProductFilters, ProductSortConfig } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

/**
 * Primary hook for the products list view.
 * Encapsulates all state access, dispatch, and side effects.
 */
export function useProducts() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectPaginatedProductSummaries);
  const total = useAppSelector(selectFilteredTotal);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const categories = useAppSelector(selectCategories);
  const filters = useAppSelector(selectFilters);
  const sort = useAppSelector(selectSort);
  const pagination = useAppSelector(selectPagination);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);

  useEffect(() => {
    void dispatch(fetchProducts({ page: pagination.page, limit: 100 }));
  }, [dispatch, pagination.page]);

  useEffect(() => {
    void dispatch(fetchCategories());
  }, [dispatch]);

  const handleFilterChange = (partial: Partial<ProductFilters>) => {
    dispatch(setFilter(partial));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSortChange = (config: ProductSortConfig) => {
    dispatch(setSort(config));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  return {
    products,
    total,
    status,
    error,
    categories,
    filters,
    sort,
    pagination,
    hasActiveFilters,
    onFilterChange: handleFilterChange,
    onClearFilters: handleClearFilters,
    onSortChange: handleSortChange,
    onPageChange: handlePageChange,
  };
}
