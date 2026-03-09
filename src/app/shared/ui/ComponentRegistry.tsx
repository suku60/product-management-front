'use client';

import Link from 'next/link';

// Component registry - Update this when adding new components
export const COMPONENTS = [
  {
    slug: 'loader',
    name: 'Loader',
    description: 'Loading spinner component with size variants',
    category: 'Feedback'
  },
  {
    slug: 'button',
    name: 'Button',
    description: 'Interactive button component with variants and loading states',
    category: 'Actions'
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'Status and label badges with color variants',
    category: 'Data Display'
  },
  {
    slug: 'kpi-card',
    name: 'KpiCard',
    description: 'Key performance indicator cards with loading states',
    category: 'Data Display'
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Page navigation controls',
    category: 'Navigation'
  }
];

const CATEGORIES = ['Actions', 'Data Display', 'Feedback', 'Navigation'];

export function ComponentGallery() {
  const componentsByCategory = CATEGORIES.map(category => ({
    category,
    components: COMPONENTS.filter(comp => comp.category === category)
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
        UI Components Gallery
      </h1>
      <p style={{ marginBottom: '2rem', color: 'var(--color-neutral-600)' }}>
        Review and test all shared UI components. Click on any component to see examples and usage.
      </p>

      {componentsByCategory.map(({ category, components }) => (
        <section key={category} style={{ marginBottom: '2rem' }}>
          <h2 style={{
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--color-neutral-700)',
            borderBottom: '1px solid var(--color-neutral-200)',
            paddingBottom: '0.5rem'
          }}>
            {category}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {components.map((component) => (
              <ComponentCard key={component.slug} component={component} />
            ))}
          </div>
        </section>
      ))}

      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: 'var(--color-neutral-50)',
        borderRadius: '8px',
        border: '1px solid var(--color-neutral-200)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
          Adding New Components
        </h3>
        <p style={{ margin: '0 0 1rem 0', color: 'var(--color-neutral-600)' }}>
          To add a new component to this gallery:
        </p>
        <ol style={{
          margin: '0',
          paddingLeft: '1.5rem',
          color: 'var(--color-neutral-600)',
          fontSize: '0.875rem'
        }}>
          <li>Create the component in <code>src/shared/components/ui/</code></li>
          <li>Add it to the <code>COMPONENTS</code> array in <code>src/app/shared/ui/ComponentRegistry.tsx</code></li>
          <li>Add examples to <code>src/app/shared/ui/[component]/ComponentViewClient.tsx</code></li>
          <li>See <code>UI_COMPONENTS.md</code> for detailed instructions</li>
        </ol>
      </div>
    </div>
  );
}

function ComponentCard({ component }: { component: typeof COMPONENTS[0] }) {
  return (
    <Link
      href={`/shared/ui/${component.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        border: '1px solid var(--color-neutral-200)',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: 'var(--color-neutral-0)',
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-brand-300)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--color-brand-600)'
        }}>
          {component.name}
        </h3>
        <p style={{
          margin: '0',
          color: 'var(--color-neutral-600)',
          fontSize: '0.875rem',
          lineHeight: '1.4'
        }}>
          {component.description}
        </p>
      </div>
    </Link>
  );
}
