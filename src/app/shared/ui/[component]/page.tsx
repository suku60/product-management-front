import { AppShell } from '@/shared/components/layout/AppShell';
import { ComponentViewClient } from './ComponentViewClient';

// Component registry - only needed for static params generation
const COMPONENT_REGISTRY: Record<string, {
    name: string;
}> = {
    'loader': { name: 'Loader' },
    'button': { name: 'Button' },
    'badge': { name: 'Badge' },
    'kpi-card': { name: 'KpiCard' },
    'pagination': { name: 'Pagination' }
};

interface ComponentPageProps {
    params: { component: string };
}

export async function generateStaticParams() {
    return Object.keys(COMPONENT_REGISTRY).map((component) => ({
        component,
    }));
}

export default function ComponentPage({ params }: ComponentPageProps) {
    const componentInfo = COMPONENT_REGISTRY[params.component];

    if (!componentInfo) {
        return (
            <AppShell title="Component Not Found">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Component Not Found
                    </h1>
                    <p style={{ color: 'var(--color-neutral-600)', marginBottom: '2rem' }}>
                        The component &quot;{params.component}&quot; does not exist in the gallery.
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

    return <ComponentViewClient componentSlug={params.component} />;
}