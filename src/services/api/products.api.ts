import type { ApiResponse, PaginationParams } from '@/shared/types';
import type { Product } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://dummyjson.com';
const DEFAULT_LIMIT = 30;

// ─────────────────────────────────────────────────────────────
// Raw API types — internal to service layer
// ─────────────────────────────────────────────────────────────

type ProductsApiResponse = ApiResponse<Product[]> & { products: Product[] };

// ─────────────────────────────────────────────────────────────
// Fetch helpers
// ─────────────────────────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────
// Products API
// ─────────────────────────────────────────────────────────────

export const productsApi = {
  /**
   * Fetch paginated list of products.
   * dummyjson returns { products, total, skip, limit }
   */
  getAll: async (params: PaginationParams = { page: 1, limit: DEFAULT_LIMIT }) => {
    const skip = (params.page - 1) * params.limit;
    const url = `${BASE_URL}/products?limit=${params.limit}&skip=${skip}`;
    const response = await fetchJson<ProductsApiResponse>(url);

    return {
      data: response.products,
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  },

  /**
   * Fetch a single product by ID.
   */
  getById: async (id: number): Promise<Product> => {
    return fetchJson<Product>(`${BASE_URL}/products/${id}`);
  },

  /**
   * Fetch all products in a category.
   */
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await fetchJson<ProductsApiResponse>(
      `${BASE_URL}/products/category/${encodeURIComponent(category)}`,
    );
    return response.products;
  },

  /**
   * Fetch all available categories.
   * Note: dummyjson returns objects with {slug, name, url}, we extract just the name.
   */
  getCategories: async (): Promise<string[]> => {
    const categories = await fetchJson<Array<{ slug: string; name: string; url: string }>>(
      `${BASE_URL}/products/categories`
    );
    return categories.map((cat) => cat.name);
  },

  /**
   * Search products by query.
   */
  search: async (query: string): Promise<Product[]> => {
    const response = await fetchJson<ProductsApiResponse>(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
    );
    return response.products;
  },

  /**
   * Fetch ALL products (no pagination) — used for KPI calculations.
   * Note: dummyjson max is 194 products total.
   */
  getAllForKPIs: async (): Promise<Product[]> => {
    const response = await fetchJson<ProductsApiResponse>(
      `${BASE_URL}/products?limit=194&skip=0`,
    );
    return response.products;
  },
} as const;
