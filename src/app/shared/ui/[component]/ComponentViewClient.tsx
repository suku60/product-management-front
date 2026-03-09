'use client';

import { AppShell } from '@/shared/components/layout/AppShell';
import { Loader } from '@/shared/components/ui/Loader';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { KpiCard } from '@/shared/components/ui/KpiCard';
import { Pagination } from '@/shared/components/ui/Pagination';
import { ComponentShowcase } from '../ComponentShowcase';

// Component registry - maps URL slugs to component info
const COMPONENT_REGISTRY: Record<string, {
  name: string;
  component: React.ComponentType<any>;
  examples: Array<{
    title: string;
    props?: Record<string, any>;
    description?: string;
  }>;
}> = {
  'loader': {
    name: 'Loader',
    component: Loader,
    examples: [
      {
        title: 'Default (Medium)',
        description: 'Default size loader',
        props: {}
      },
      {
        title: 'Small Size',
        description: 'Small loader for tight spaces',
        props: { size: 'sm' }
      }
    ]
  },
  'button': {
    name: 'Button',
    component: Button,
    examples: [
      {
        title: 'Primary Button',
        description: 'Default primary action button',
        props: { children: 'Click me' }
      },
      {
        title: 'Secondary Button',
        description: 'Secondary action button',
        props: { variant: 'secondary', children: 'Cancel' }
      },
      {
        title: 'Danger Button',
        description: 'Destructive action button',
        props: { variant: 'danger', children: 'Delete' }
      },
      {
        title: 'Ghost Button',
        description: 'Subtle action button',
        props: { variant: 'ghost', children: 'Edit' }
      },
      {
        title: 'Loading Button',
        description: 'Button with loading state',
        props: { isLoading: true, children: 'Saving...' }
      }
    ]
  },
  'badge': {
    name: 'Badge',
    component: Badge,
    examples: [
      {
        title: 'Default Badge',
        description: 'Default neutral badge',
        props: { children: 'Default' }
      },
      {
        title: 'Success Badge',
        description: 'Success state badge',
        props: { variant: 'success', children: 'Active' }
      },
      {
        title: 'Warning Badge',
        description: 'Warning state badge',
        props: { variant: 'warning', children: 'Low Stock' }
      },
      {
        title: 'Danger Badge',
        description: 'Danger/error state badge',
        props: { variant: 'danger', children: 'Out of Stock' }
      },
      {
        title: 'Info Badge',
        description: 'Info state badge',
        props: { variant: 'info', children: 'New' }
      }
    ]
  },
  'kpi-card': {
    name: 'KpiCard',
    component: KpiCard,
    examples: [
      {
        title: 'Default KPI Card',
        description: 'Basic KPI display',
        props: {
          label: 'Total Sales',
          value: '$12,345'
        }
      },
      {
        title: 'KPI with Subtext',
        description: 'KPI with additional context',
        props: {
          label: 'Conversion Rate',
          value: '3.2%',
          subtext: 'Last 30 days'
        }
      },
      {
        title: 'Warning KPI',
        description: 'KPI with warning styling',
        props: {
          label: 'Low Stock Items',
          value: '5',
          variant: 'warning',
          subtext: 'Needs attention'
        }
      },
      {
        title: 'Loading KPI',
        description: 'KPI in loading state',
        props: {
          label: 'Total Revenue',
          value: '-',
          isLoading: true
        }
      }
    ]
  },
  'pagination': {
    name: 'Pagination',
    component: Pagination,
    examples: [
      {
        title: 'Basic Pagination',
        description: 'Standard pagination controls',
        props: {
          currentPage: 1,
          totalPages: 10,
          onPageChange: () => {}
        }
      },
      {
        title: 'Middle Page',
        description: 'Pagination on a middle page',
        props: {
          currentPage: 5,
          totalPages: 10,
          onPageChange: () => {}
        }
      }
    ]
  }
};

interface ComponentViewClientProps {
  componentSlug: string;
}

export function ComponentViewClient({ componentSlug }: ComponentViewClientProps) {
  const componentInfo = COMPONENT_REGISTRY[componentSlug];

  if (!componentInfo) {
    return (
      <AppShell title="Component Not Found">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Component Not Found
          </h1>
          <p style={{ color: 'var(--color-neutral-600)', marginBottom: '2rem' }}>
            The component &quot;{componentSlug}&quot; does not exist in the gallery.
          </p>
          <a
            href="/shared/ui/"
            style={{
              color: 'var(--color-brand-500)',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Back to Components Gallery
          </a>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={`${componentInfo.name} Component`}>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
          {componentInfo.name} Component
        </h1>
        <p style={{ marginBottom: '2rem', color: 'var(--color-neutral-600)' }}>
          Review and test the {componentInfo.name} component with different props and states.
        </p>

        <ComponentShowcase
          componentName={componentInfo.name}
          component={componentInfo.component}
          examples={componentInfo.examples}
        />
      </div>
    </AppShell>
  );
}