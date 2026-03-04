import styles from './Pagination.module.css';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination} role="navigation" aria-label="Pagination">
      <p className={styles.info}>
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong> results
      </p>
      <div className={styles.controls}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ← Prev
        </Button>

        <span className={styles.pageIndicator}>
          Page {page} of {totalPages}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
