import type { Store, StoreFilters, StoreFormErrors, StoreFormData } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// ID generation
// ─────────────────────────────────────────────────────────────

export function generateStoreId(): string {
  return `store-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getCurrentISODate(): string {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────
// Filter logic
// ─────────────────────────────────────────────────────────────

export function matchesStoreFilters(store: Store, filters: StoreFilters): boolean {
  if (filters.status !== 'all' && store.status !== filters.status) return false;

  if (filters.searchQuery.trim().length > 0) {
    const query = filters.searchQuery.toLowerCase();
    const searchableText = `${store.name} ${store.location} ${store.manager}`.toLowerCase();
    if (!searchableText.includes(query)) return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// Form validation
// ─────────────────────────────────────────────────────────────

export function validateStoreForm(data: StoreFormData): StoreFormErrors {
  const errors: StoreFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Store name is required';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Store name must be at least 3 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Store name must be under 100 characters';
  }

  if (!data.location.trim()) {
    errors.location = 'Location is required';
  }

  if (!data.manager.trim()) {
    errors.manager = 'Manager name is required';
  }

  if (data.assignedCategories.length === 0) {
    errors.assignedCategories = 'At least one category must be assigned';
  }

  return errors;
}

export function hasFormErrors(errors: StoreFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ─────────────────────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────────────────────

export function formatStoreStatus(status: Store['status']): string {
  return status === 'active' ? 'Active' : 'Inactive';
}

export function formatCategoryCount(count: number): string {
  return count === 1 ? '1 category' : `${count} categories`;
}
