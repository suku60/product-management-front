import {
  validateStoreForm,
  hasFormErrors,
  matchesStoreFilters,
  formatCategoryCount,
} from '../utils/store.utils';
import storesReducer, {
  createStore,
  updateStore,
  deleteStore,
  toggleStoreStatus,
} from '../store/storesSlice';
import type { StoreFormData, Store } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────

const validFormData: StoreFormData = {
  name: 'Test Store',
  location: 'Austin, TX',
  manager: 'John Doe',
  assignedCategories: ['electronics'],
  status: 'active',
};

// ─────────────────────────────────────────────────────────────
// Validation tests
// ─────────────────────────────────────────────────────────────

describe('validateStoreForm', () => {
  it('returns no errors for valid data', () => {
    expect(hasFormErrors(validateStoreForm(validFormData))).toBe(false);
  });

  it('requires name', () => {
    const errors = validateStoreForm({ ...validFormData, name: '' });
    expect(errors.name).toBeDefined();
  });

  it('requires name to be at least 3 characters', () => {
    const errors = validateStoreForm({ ...validFormData, name: 'AB' });
    expect(errors.name).toMatch(/3 characters/);
  });

  it('requires location', () => {
    const errors = validateStoreForm({ ...validFormData, location: '' });
    expect(errors.location).toBeDefined();
  });

  it('requires manager', () => {
    const errors = validateStoreForm({ ...validFormData, manager: '' });
    expect(errors.manager).toBeDefined();
  });

  it('requires at least one assigned category', () => {
    const errors = validateStoreForm({ ...validFormData, assignedCategories: [] });
    expect(errors.assignedCategories).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────
// matchesStoreFilters
// ─────────────────────────────────────────────────────────────

const makeStore = (overrides: Partial<Store> = {}): Store => ({
  id: 'store-test',
  name: 'My Store',
  location: 'Chicago, IL',
  manager: 'Alice',
  assignedCategories: [],
  status: 'active',
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

describe('matchesStoreFilters', () => {
  it('returns true when status is "all"', () => {
    const store = makeStore({ status: 'inactive' });
    expect(matchesStoreFilters(store, { status: 'all', searchQuery: '' })).toBe(true);
  });

  it('filters by active status', () => {
    const active = makeStore({ status: 'active' });
    const inactive = makeStore({ status: 'inactive' });
    expect(matchesStoreFilters(active, { status: 'active', searchQuery: '' })).toBe(true);
    expect(matchesStoreFilters(inactive, { status: 'active', searchQuery: '' })).toBe(false);
  });

  it('filters by search query on name', () => {
    const store = makeStore({ name: 'Flagship Store' });
    expect(matchesStoreFilters(store, { status: 'all', searchQuery: 'flagship' })).toBe(true);
    expect(matchesStoreFilters(store, { status: 'all', searchQuery: 'outlet' })).toBe(false);
  });

  it('filters by search query on location', () => {
    const store = makeStore({ location: 'Denver, CO' });
    expect(matchesStoreFilters(store, { status: 'all', searchQuery: 'denver' })).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// Stores slice reducer tests
// ─────────────────────────────────────────────────────────────

const INITIAL_STATE = storesReducer(undefined, { type: '@@INIT' });

describe('storesSlice reducers', () => {
  describe('createStore', () => {
    it('adds a new store to the collection', () => {
      const state = storesReducer(INITIAL_STATE, createStore(validFormData));
      const ids = state.ids as string[];
      expect(ids.length).toBe(INITIAL_STATE.ids.length + 1);
    });

    it('assigns an id, createdAt, and updatedAt', () => {
      const state = storesReducer(INITIAL_STATE, createStore(validFormData));
      const newId = (state.ids as string[]).find((id) => !INITIAL_STATE.ids.includes(id))!;
      const newStore = state.entities[newId];
      expect(newStore?.id).toBeTruthy();
      expect(newStore?.createdAt).toBeTruthy();
      expect(newStore?.updatedAt).toBeTruthy();
    });
  });

  describe('updateStore', () => {
    it('updates specified fields', () => {
      const firstId = INITIAL_STATE.ids[0] as string;
      const state = storesReducer(
        INITIAL_STATE,
        updateStore({ id: firstId, changes: { name: 'Updated Name' } }),
      );
      expect(state.entities[firstId]?.name).toBe('Updated Name');
    });
  });

  describe('deleteStore', () => {
    it('removes the store by id', () => {
      const firstId = INITIAL_STATE.ids[0] as string;
      const state = storesReducer(INITIAL_STATE, deleteStore(firstId));
      expect(state.entities[firstId]).toBeUndefined();
      expect(state.ids.length).toBe(INITIAL_STATE.ids.length - 1);
    });
  });

  describe('toggleStoreStatus', () => {
    it('toggles active to inactive', () => {
      const activeId = (INITIAL_STATE.ids as string[]).find(
        (id) => INITIAL_STATE.entities[id]?.status === 'active',
      )!;
      const state = storesReducer(INITIAL_STATE, toggleStoreStatus(activeId));
      expect(state.entities[activeId]?.status).toBe('inactive');
    });

    it('toggles inactive to active', () => {
      const inactiveId = (INITIAL_STATE.ids as string[]).find(
        (id) => INITIAL_STATE.entities[id]?.status === 'inactive',
      )!;
      const state = storesReducer(INITIAL_STATE, toggleStoreStatus(inactiveId));
      expect(state.entities[inactiveId]?.status).toBe('active');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────────────────────

describe('formatCategoryCount', () => {
  it('handles singular', () => {
    expect(formatCategoryCount(1)).toBe('1 category');
  });

  it('handles plural', () => {
    expect(formatCategoryCount(3)).toBe('3 categories');
  });
});
