'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/products',  label: 'Products',  icon: '⊞' },
  { href: '/stores',    label: 'Stores',    icon: '⊟' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>SMP</span>
        <span className={styles.logoText}>Store Manager</span>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.navIcon} aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <p className={styles.version}>v1.0.0</p>
      </div>
    </aside>
  );
}
