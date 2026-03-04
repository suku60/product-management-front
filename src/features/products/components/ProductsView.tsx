'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Table } from '@/shared/components/table/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Pagination } from '@/shared/components/ui/Pagination';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/product.utils';
import type { ProductSummary, AvailabilityStatus } from '@/shared/types';
import type { ColumnDef } from '@/shared/components/table/Table';
import styles from './ProductsView.module.css';

// ─────────────────────────────────────────────────────────────
// Column definitions — outside component to prevent re-creation
// ─────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<ProductSummary>[] = [
  {
    key: 'thumbnail',
    header: '',
    width: '3.5rem',
    render: (row) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={row.thumbnail}
        alt={row.title}
        className={styles.thumbnail}
        width={40}
        height={40}
      />
    ),
  },
  {
    key: 'title',
    header: 'Product',
    sortable: true,
    render: (row) => (
      <div>
        <p className={styles.productTitle}>{row.title}</p>
        <p className={styles.productBrand}>{row.brand}</p>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (row) => <Badge variant="neutral">{row.category}</Badge>,
  },
  {
    key: 'price',
    header: 'Price',
    sortable: true,
    render: (row) => (
      <div className={styles.priceCell}>
        <span className={styles.finalPrice}>{formatPrice(row.finalPrice)}</span>
        {row.discountPercentage > 0 && (
          <>
            <span className={styles.originalPrice}>{formatPrice(row.price)}</span>
            <Badge variant="warning">-{row.discountPercentage.toFixed(0)}%</Badge>
          </>
        )}
      </div>
    ),
  },
  {
    key: 'rating',
    header: 'Rating',
    sortable: true,
    render: (row) => <span className={styles.rating}>★ {row.rating}</span>,
  },
  {
    key: 'stock',
    header: 'Stock',
    sortable: true,
    render: (row) => <span>{row.stock.toLocaleString()}</span>,
  },
  {
    key: 'availabilityStatus',
    header: 'Status',
    render: (row) => <AvailabilityBadge status={row.availabilityStatus} />,
  },
];

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const variantMap: Record<AvailabilityStatus, 'success' | 'warning' | 'danger'> = {
    'In Stock': 'success',
    'Low Stock': 'warning',
    'Out of Stock': 'danger',
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

// ─────────────────────────────────────────────────────────────
// View
// ─────────────────────────────────────────────────────────────

export function ProductsView() {
  const router = useRouter();
  const {
    products,
    total,
    status,
    categories,
    filters,
    sort,
    pagination,
    hasActiveFilters,
    onFilterChange,
    onClearFilters,
    onSortChange,
    onPageChange,
  } = useProducts();

  const handleSortColumn = (key: string) => {
    const isSameField = sort.field === key;
    onSortChange({
      field: key as typeof sort.field,
      direction: isSameField && sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <AppShell title="Products">
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <select
            className={styles.select}
            value={filters.category ?? ''}
            onChange={(e) => onFilterChange({ category: e.target.value || null })}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={filters.availabilityStatus ?? ''}
            onChange={(e) =>
              onFilterChange({ availabilityStatus: (e.target.value as AvailabilityStatus) || null })
            }
            aria-label="Filter by availability"
          >
            <option value="">All availability</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <input
            className={styles.input}
            type="number"
            placeholder="Min rating"
            min={0}
            max={5}
            step={0.1}
            value={filters.minRating ?? ''}
            onChange={(e) =>
              onFilterChange({ minRating: e.target.value ? parseFloat(e.target.value) : null })
            }
            aria-label="Minimum rating"
          />

          <input
            className={styles.input}
            type="text"
            placeholder="Search products…"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            aria-label="Search products"
          />

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </div>

        <p className={styles.resultCount}>
          {total} {total === 1 ? 'product' : 'products'}
        </p>
      </div>

      <Table
        columns={COLUMNS}
        rows={products}
        getRowKey={(row) => row.id}
        sortKey={sort.field}
        sortDirection={sort.direction}
        onSort={handleSortColumn}
        isLoading={status === 'loading'}
        emptyMessage="No products match your current filters."
        onRowClick={(row) => router.push(`/products/${row.id}`)}
      />

      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        total={total}
        onPageChange={onPageChange}
      />
    </AppShell>
  );
}
