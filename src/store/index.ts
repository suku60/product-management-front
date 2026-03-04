import { configureStore } from '@reduxjs/toolkit';

import productsReducer from '@/features/products/store/productsSlice';
import storesReducer from '@/features/stores/store/storesSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    stores: storesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Inferred types — these are the source of truth
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
