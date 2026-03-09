import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  return (
    <div
      className={`${styles.loader} ${styles[size]} ${className || ''}`}
      role="status"
      aria-label="Loading"
    />
  );
}