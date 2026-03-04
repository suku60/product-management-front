import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Store, StoreFilters, StoreStatus, StoreFormData } from '@/shared/types';
import { generateStoreId, getCurrentISODate } from '../utils/store.utils';
import { MOCK_STORES } from '../utils/store.mocks';

// Entity adapter for normalized CRUD state
const storesAdapter = createEntityAdapter<Store>();

interface StoresExtraState {
  filters: StoreFilters;
  selectedStoreId: string | null;
}

const initialExtraState: StoresExtraState = {
  filters: { status: 'all', searchQuery: '' },
  selectedStoreId: null,
};

const storesSlice = createSlice({
  name: 'stores',
  initialState: storesAdapter.getInitialState(initialExtraState, MOCK_STORES),
  reducers: {
    createStore: (state, action: PayloadAction<StoreFormData>) => {
      const now = getCurrentISODate();
      const newStore: Store = {
        ...action.payload,
        id: generateStoreId(),
        createdAt: now,
        updatedAt: now,
      };
      storesAdapter.addOne(state, newStore);
    },

    updateStore: (state, action: PayloadAction<{ id: string; changes: Partial<StoreFormData> }>) => {
      storesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { ...action.payload.changes, updatedAt: getCurrentISODate() },
      });
    },

    deleteStore: (state, action: PayloadAction<string>) => {
      storesAdapter.removeOne(state, action.payload);
    },

    toggleStoreStatus: (state, action: PayloadAction<string>) => {
      const store = state.entities[action.payload];
      if (!store) return;
      const nextStatus: StoreStatus = store.status === 'active' ? 'inactive' : 'active';
      storesAdapter.updateOne(state, {
        id: action.payload,
        changes: { status: nextStatus, updatedAt: getCurrentISODate() },
      });
    },

    assignCategories: (state, action: PayloadAction<{ storeId: string; categories: string[] }>) => {
      storesAdapter.updateOne(state, {
        id: action.payload.storeId,
        changes: { assignedCategories: action.payload.categories, updatedAt: getCurrentISODate() },
      });
    },

    setStoreFilter: (state, action: PayloadAction<Partial<StoreFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    setSelectedStore: (state, action: PayloadAction<string | null>) => {
      state.selectedStoreId = action.payload;
    },
  },
});

export const {
  createStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  assignCategories,
  setStoreFilter,
  setSelectedStore,
} = storesSlice.actions;

export { storesAdapter };
export default storesSlice.reducer;
