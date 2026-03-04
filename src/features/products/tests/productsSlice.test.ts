import productsReducer, {
  setFilter,
  clearFilters,
  setSort,
  setPage,
  clearSelectedProduct,
} from '../store/productsSlice';
import type { ProductFilters } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Initial state reference
// ─────────────────────────────────────────────────────────────

const INITIAL_STATE = productsReducer(undefined, { type: '@@INIT' });

describe('productsSlice reducers', () => {
  describe('setFilter', () => {
    it('merges partial filter changes', () => {
      const state = productsReducer(INITIAL_STATE, setFilter({ category: 'electronics' }));
      expect(state.filters.category).toBe('electronics');
      expect(state.filters.searchQuery).toBe(''); // unchanged
    });

    it('resets page to 1 when a filter is applied', () => {
      const withPage = productsReducer(INITIAL_STATE, setPage(3));
      const filtered = productsReducer(withPage, setFilter({ category: 'laptops' }));
      expect(filtered.pagination.page).toBe(1);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters to initial values', () => {
      let state = productsReducer(INITIAL_STATE, setFilter({ category: 'phones', minRating: 4 }));
      state = productsReducer(state, clearFilters());
      expect(state.filters.category).toBeNull();
      expect(state.filters.minRating).toBeNull();
      expect(state.filters.searchQuery).toBe('');
    });

    it('resets page to 1', () => {
      let state = productsReducer(INITIAL_STATE, setPage(5));
      state = productsReducer(state, clearFilters());
      expect(state.pagination.page).toBe(1);
    });
  });

  describe('setSort', () => {
    it('updates sort field and direction', () => {
      const state = productsReducer(
        INITIAL_STATE,
        setSort({ field: 'price', direction: 'desc' }),
      );
      expect(state.sort.field).toBe('price');
      expect(state.sort.direction).toBe('desc');
    });
  });

  describe('setPage', () => {
    it('sets pagination page', () => {
      const state = productsReducer(INITIAL_STATE, setPage(4));
      expect(state.pagination.page).toBe(4);
    });
  });

  describe('clearSelectedProduct', () => {
    it('clears selectedProduct and resets status', () => {
      const state = productsReducer(INITIAL_STATE, clearSelectedProduct());
      expect(state.selectedProduct).toBeNull();
      expect(state.selectedProductStatus).toBe('idle');
    });
  });
});
