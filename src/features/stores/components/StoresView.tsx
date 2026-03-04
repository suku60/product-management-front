'use client';

import Link from 'next/link';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Table } from '@/shared/components/table/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useStores } from '../hooks/useStores';
import { formatCategoryCount } from '../utils/store.utils';
import type { Store } from '@/shared/types';
import type { ColumnDef } from '@/shared/components/table/Table';
import styles from './StoresView.module.css';

const COLUMNS: ColumnDef<Store>[] = [
  {
    key: 'name',
    header: 'Store Name',
    sortable: true,
    render: (row) => (
      <div>
        <p className={styles.storeName}>{row.name}</p>
        <p className={styles.storeLocation}>{row.location}</p>
      </div>
    ),
  },
  {
    key: 'manager',
    header: 'Manager',
    render: (row) => <span>{row.manager}</span>,
  },
  {
    key: 'assignedCategories',
    header: 'Categories',
    render: (row) => (
      <div className={styles.categories}>
        {row.assignedCategories.slice(0, 3).map((cat) => (
          <Badge key={cat} variant="info">{cat}</Badge>
        ))}
        {row.assignedCategories.length > 3 && (
          <Badge variant="neutral">+{row.assignedCategories.length - 3}</Badge>
        )}
        {row.assignedCategories.length === 0 && (
          <span className={styles.noCategories}>None assigned</span>
        )}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>
        {row.status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: '',
    width: '8rem',
    render: (row) => <StoreActions storeId={row.id} />,
  },
];

function StoreActions({ storeId }: { storeId: string }) {
  const { onToggleStatus, onDelete } = useStores();
  return (
    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
      <Link href={`/stores/${storeId}`}>
        <Button variant="ghost" size="sm">Edit</Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={() => onToggleStatus(storeId)}>
        Toggle
      </Button>
    </div>
  );
}

export function StoresView() {
  const { stores, stats, filters, onFilterChange } = useStores();

  return (
    <AppShell title="Stores">
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: 'var(--color-success)' }}>
            {stats.active}
          </span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: 'var(--color-neutral-400)' }}>
            {stats.inactive}
          </span>
          <span className={styles.statLabel}>Inactive</span>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search stores…"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            aria-label="Search stores"
          />
          <select
            className={styles.select}
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ status: e.target.value as typeof filters.status })
            }
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Link href="/stores/new">
          <Button variant="primary" size="sm">+ New Store</Button>
        </Link>
      </div>

      <Table
        columns={COLUMNS}
        rows={stores}
        getRowKey={(row) => row.id}
        emptyMessage="No stores found. Create your first store."
      />
    </AppShell>
  );
}
