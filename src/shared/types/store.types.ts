// ─────────────────────────────────────────────────────────────
// Store domain types — local / mocked entity
// ─────────────────────────────────────────────────────────────

export type StoreStatus = 'active' | 'inactive';

export interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
  assignedCategories: string[];
  status: StoreStatus;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Form types
// ─────────────────────────────────────────────────────────────

export type StoreFormData = Omit<Store, 'id' | 'createdAt' | 'updatedAt'>;

export interface StoreFormErrors {
  name?: string;
  location?: string;
  manager?: string;
  assignedCategories?: string;
}

// ─────────────────────────────────────────────────────────────
// Filter types
// ─────────────────────────────────────────────────────────────

export interface StoreFilters {
  status: StoreStatus | 'all';
  searchQuery: string;
}

// ─────────────────────────────────────────────────────────────
// Future-ready: role-based access shape (not implemented yet)
// This type is intentionally left minimal — extend as auth grows
// ─────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'viewer';

export interface StorePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canToggleStatus: boolean;
}
