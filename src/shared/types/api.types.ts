// ─────────────────────────────────────────────────────────────
// Generic API response shapes
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// ─────────────────────────────────────────────────────────────
// Generic async state shape — used across Redux slices
// ─────────────────────────────────────────────────────────────

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState {
  status: AsyncStatus;
  error: string | null;
}

// ─────────────────────────────────────────────────────────────
// Generic pagination params
// ─────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

// ─────────────────────────────────────────────────────────────
// Generic select option (used in filter dropdowns)
// ─────────────────────────────────────────────────────────────

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
}
