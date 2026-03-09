'use client';

import { useState } from 'react';

interface Example {
  title: string;
  props?: Record<string, any>;
  description?: string;
}

interface ComponentShowcaseProps {
  componentName: string;
  component: React.ComponentType<any>;
  examples: Example[];
}

function ExampleRenderer({ example, Component }: { example: Example; Component: any }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{
      border: '1px solid var(--color-neutral-200)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1rem',
      backgroundColor: 'var(--color-neutral-0)'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
          {example.title}
        </h3>
        {example.description && (
          <p style={{ margin: '0', color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>
            {example.description}
          </p>
        )}
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--color-neutral-50)',
        borderRadius: '4px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px'
      }}>
        <Component {...example.props} />
      </div>

      <button
        onClick={() => setShowCode(!showCode)}
        style={{
          background: 'none',
          border: '1px solid var(--color-neutral-300)',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: 'var(--color-neutral-700)'
        }}
      >
        {showCode ? 'Hide Code' : 'Show Code'}
      </button>

      {showCode && (
        <pre style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--color-neutral-900)',
          color: 'var(--color-neutral-100)',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          <code>
{`<${Component.displayName || 'Component'}
${Object.entries(example.props || {}).map(([key, value]) => {
  if (typeof value === 'string') {
    return `  ${key}="${value}"`;
  } else if (typeof value === 'boolean') {
    return value ? `  ${key}` : `  ${key}={false}`;
  } else if (typeof value === 'function') {
    return `  ${key}={() => {}}`;
  } else {
    return `  ${key}={${JSON.stringify(value)}}`;
  }
}).join('\n')}
/>`}
          </code>
        </pre>
      )}
    </div>
  );
}

export function ComponentShowcase({ componentName, component: Component, examples }: ComponentShowcaseProps) {
  return (
    <div>
      <div style={{
        backgroundColor: 'var(--color-neutral-50)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid var(--color-neutral-200)'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
          Import
        </h2>
        <code style={{
          backgroundColor: 'var(--color-neutral-100)',
          padding: '0.5rem',
          borderRadius: '4px',
          display: 'block',
          fontFamily: 'monospace'
        }}>
          import {`{ ${Component.displayName || componentName} }`} from '@/shared/components/ui/{componentName}';
        </code>
      </div>

      <div>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
          Examples
        </h2>
        {examples.map((example, index) => (
          <ExampleRenderer
            key={index}
            example={example}
            Component={Component}
          />
        ))}
      </div>
    </div>
  );
}