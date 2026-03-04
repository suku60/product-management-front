import styles from './Table.module.css';
import type { SortDirection } from '@/shared/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ColumnDef<TRow> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render: (row: TRow) => React.ReactNode;
}

interface TableProps<TRow> {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string | number;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TRow) => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function Table<TRow>({
  columns,
  rows,
  getRowKey,
  sortKey,
  sortDirection,
  onSort,
  isLoading = false,
  emptyMessage = 'No results found.',
  onRowClick,
}: TableProps<TRow>) {
  if (isLoading) {
    return <TableSkeleton columns={columns.length} />;
  }

  return (
    <div className={styles.wrapper} role="region" aria-label="Data table">
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={styles.th}
                style={col.width ? { width: col.width } : undefined}
                aria-sort={
                  sortKey === col.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {col.sortable && onSort ? (
                  <button
                    className={styles.sortButton}
                    onClick={() => onSort(col.key)}
                    type="button"
                  >
                    {col.header}
                    <SortIndicator active={sortKey === col.key} direction={sortDirection} />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={`${styles.tr} ${onRowClick ? styles.trClickable : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') onRowClick(row);
                      }
                    : undefined
                }
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction?: SortDirection;
}) {
  if (!active) return <span className={styles.sortIcon} aria-hidden="true">↕</span>;
  return (
    <span className={`${styles.sortIcon} ${styles.sortIconActive}`} aria-hidden="true">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className={styles.th}>
                <div className={styles.skeletonHeader} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className={styles.tr}>
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className={styles.td}>
                  <div className={styles.skeletonCell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
