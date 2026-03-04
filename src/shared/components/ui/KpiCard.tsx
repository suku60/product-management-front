import styles from './KpiCard.module.css';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  isLoading?: boolean;
}

export function KpiCard({
  label,
  value,
  subtext,
  variant = 'default',
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className={`${styles.card} ${styles.loading}`} aria-busy="true">
        <div className={styles.skeletonLabel} />
        <div className={styles.skeletonValue} />
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {subtext ? <p className={styles.subtext}>{subtext}</p> : null}
    </div>
  );
}
