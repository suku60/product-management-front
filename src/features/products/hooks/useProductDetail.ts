'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductById, clearSelectedProduct } from '../store/productsSlice';
import {
  selectEnrichedSelectedProduct,
  selectSelectedProductStatus,
  selectProductsError,
} from '../store/products.selectors';

/**
 * Hook for the product detail view.
 * Fetches a product by ID and returns enriched computed data.
 */
export function useProductDetail(id: number) {
  const dispatch = useAppDispatch();

  const product = useAppSelector(selectEnrichedSelectedProduct);
  const status = useAppSelector(selectSelectedProductStatus);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    void dispatch(fetchProductById(id));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  return { product, status, error };
}
