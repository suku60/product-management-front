'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api';
import {
  computeTotalInventoryValue,
  computeAverageRating,
  LOW_STOCK_THRESHOLD,
} from '@/features/products/utils/product.utils';
import type { ProductKPIs } from '@/shared/types';

const DASHBOARD_QUERY_KEY = ['dashboard', 'kpis'] as const;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches ALL products and computes dashboard KPIs.
 * Uses React Query for caching — avoids re-fetching on re-mount.
 */
export function useDashboardKPIs() {
  const { data, status, error } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: productsApi.getAllForKPIs,
    staleTime: STALE_TIME,
    select: (products): ProductKPIs => ({
      totalProducts: products.length,
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      lowStockCount: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length,
      outOfStockCount: products.filter((p) => p.stock === 0).length,
      totalInventoryValue: computeTotalInventoryValue(products),
      averageRating: computeAverageRating(products),
    }),
  });

  return {
    kpis: data ?? null,
    status,
    error: error instanceof Error ? error.message : null,
    isLoading: status === 'pending',
    isError: status === 'error',
  };
}
