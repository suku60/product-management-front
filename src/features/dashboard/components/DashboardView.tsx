'use client';

import { AppShell } from '@/shared/components/layout/AppShell';
import { KpiCard } from '@/shared/components/ui/KpiCard';
import { useDashboardKPIs } from '../hooks/useDashboardKPIs';
import { useAppSelector } from '@/store/hooks';
import { selectStoreStats } from '@/features/stores/store/stores.selectors';
import { formatPrice } from '@/features/products/utils/product.utils';
import styles from './DashboardView.module.css';

export function DashboardView() {
  const { kpis, isLoading, error } = useDashboardKPIs();
  const storeStats = useAppSelector(selectStoreStats);

  return (
    <AppShell title="Dashboard">
      {error ? (
        <div className={styles.error} role="alert">
          <p>Failed to load dashboard data: {error}</p>
        </div>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inventory Overview</h2>
        <div className={styles.kpiGrid}>
          <KpiCard
            label="Total Products"
            value={kpis?.totalProducts ?? '—'}
            isLoading={isLoading}
          />
          <KpiCard
            label="Total Units in Stock"
            value={kpis ? kpis.totalStock.toLocaleString() : '—'}
            isLoading={isLoading}
          />
          <KpiCard
            label="Low Stock Items"
            value={kpis?.lowStockCount ?? '—'}
            subtext="≤ 10 units remaining"
            variant="warning"
            isLoading={isLoading}
          />
          <KpiCard
            label="Out of Stock"
            value={kpis?.outOfStockCount ?? '—'}
            variant={kpis && kpis.outOfStockCount > 0 ? 'danger' : 'default'}
            isLoading={isLoading}
          />
          <KpiCard
            label="Total Inventory Value"
            value={kpis ? formatPrice(kpis.totalInventoryValue) : '—'}
            subtext="After discounts applied"
            variant="success"
            isLoading={isLoading}
          />
          <KpiCard
            label="Average Rating"
            value={kpis ? `${kpis.averageRating} / 5` : '—'}
            isLoading={isLoading}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stores Overview</h2>
        <div className={styles.kpiGrid}>
          <KpiCard label="Total Stores" value={storeStats.total} />
          <KpiCard label="Active Stores" value={storeStats.active} variant="success" />
          <KpiCard
            label="Inactive Stores"
            value={storeStats.inactive}
            variant={storeStats.inactive > 0 ? 'warning' : 'default'}
          />
        </div>
      </section>
    </AppShell>
  );
}
