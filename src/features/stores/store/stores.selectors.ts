import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { storesAdapter } from './storesSlice';
import { matchesStoreFilters } from '../utils/store.utils';

// ─────────────────────────────────────────────────────────────
// Adapter selectors
// ─────────────────────────────────────────────────────────────

const { selectAll: selectAllStores, selectById: selectStoreById } =
  storesAdapter.getSelectors<RootState>((state) => state.stores);

export { selectAllStores, selectStoreById };

// ─────────────────────────────────────────────────────────────
// Base selectors
// ─────────────────────────────────────────────────────────────

export const selectStoreFilters = (state: RootState) => state.stores.filters;
export const selectSelectedStoreId = (state: RootState) => state.stores.selectedStoreId;

// ─────────────────────────────────────────────────────────────
// Memoized selectors
// ─────────────────────────────────────────────────────────────

export const selectFilteredStores = createSelector(
  [selectAllStores, selectStoreFilters],
  (stores, filters) => stores.filter((store) => matchesStoreFilters(store, filters)),
);

export const selectSelectedStore = createSelector(
  [selectAllStores, selectSelectedStoreId],
  (stores, id) => (id ? stores.find((s) => s.id === id) ?? null : null),
);

export const selectActiveStoresCount = createSelector(
  [selectAllStores],
  (stores) => stores.filter((s) => s.status === 'active').length,
);

export const selectStoreStats = createSelector([selectAllStores], (stores) => ({
  total: stores.length,
  active: stores.filter((s) => s.status === 'active').length,
  inactive: stores.filter((s) => s.status === 'inactive').length,
}));
