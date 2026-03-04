import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { productsApi } from '@/services/api';
import type {
  Product,
  ProductFilters,
  ProductSortConfig,
  ProductPagination,
  AsyncStatus,
} from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// State shape
// ─────────────────────────────────────────────────────────────

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  categories: string[];
  filters: ProductFilters;
  sort: ProductSortConfig;
  pagination: ProductPagination;
  status: AsyncStatus;
  categoriesStatus: AsyncStatus;
  selectedProductStatus: AsyncStatus;
  error: string | null;
}

const initialFilters: ProductFilters = {
  category: null,
  minRating: null,
  minPrice: null,
  maxPrice: null,
  availabilityStatus: null,
  searchQuery: '',
};

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  categories: [],
  filters: initialFilters,
  sort: { field: 'title', direction: 'asc' },
  pagination: { page: 1, limit: 20, total: 0 },
  status: 'idle',
  categoriesStatus: 'idle',
  selectedProductStatus: 'idle',
  error: null,
};

// ─────────────────────────────────────────────────────────────
// Async thunks
// ─────────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      return await productsApi.getAll(params);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error fetching products';
      return rejectWithValue(message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await productsApi.getById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error fetching product';
      return rejectWithValue(message);
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productsApi.getCategories();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error fetching categories';
      return rejectWithValue(message);
    }
  },
);

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // reset page on filter change
    },

    clearFilters: (state) => {
      state.filters = initialFilters;
      state.pagination.page = 1;
    },

    setSort: (state, action: PayloadAction<ProductSortConfig>) => {
      state.sort = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedProductStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.selectedProductStatus = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProductStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedProductStatus = 'failed';
        state.error = action.payload as string;
      });

    // fetchCategories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearFilters, setSort, setPage, clearSelectedProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
