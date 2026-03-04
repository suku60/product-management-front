'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  assignCategories,
  setStoreFilter,
  setSelectedStore,
} from '../store/storesSlice';
import {
  selectFilteredStores,
  selectStoreStats,
  selectStoreFilters,
  selectSelectedStore,
} from '../store/stores.selectors';
import type { StoreFormData, StoreFilters } from '@/shared/types';

/**
 * Primary hook for the stores management view.
 * All business operations flow through this hook.
 */
export function useStores() {
  const dispatch = useAppDispatch();

  const stores = useAppSelector(selectFilteredStores);
  const stats = useAppSelector(selectStoreStats);
  const filters = useAppSelector(selectStoreFilters);
  const selectedStore = useAppSelector(selectSelectedStore);

  const handleCreate = useCallback(
    (data: StoreFormData) => {
      dispatch(createStore(data));
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    (id: string, changes: Partial<StoreFormData>) => {
      dispatch(updateStore({ id, changes }));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteStore(id));
    },
    [dispatch],
  );

  const handleToggleStatus = useCallback(
    (id: string) => {
      dispatch(toggleStoreStatus(id));
    },
    [dispatch],
  );

  const handleAssignCategories = useCallback(
    (storeId: string, categories: string[]) => {
      dispatch(assignCategories({ storeId, categories }));
    },
    [dispatch],
  );

  const handleFilterChange = useCallback(
    (partial: Partial<StoreFilters>) => {
      dispatch(setStoreFilter(partial));
    },
    [dispatch],
  );

  const handleSelectStore = useCallback(
    (id: string | null) => {
      dispatch(setSelectedStore(id));
    },
    [dispatch],
  );

  return {
    stores,
    stats,
    filters,
    selectedStore,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    onAssignCategories: handleAssignCategories,
    onFilterChange: handleFilterChange,
    onSelectStore: handleSelectStore,
  };
}
