# UI Components Documentation

This guide explains how to create, register, and showcase new UI components in the Store Manager Pro project.

## Directory Structure

UI components are located in:
```
src/shared/components/ui/
├── Badge.tsx
├── Badge.module.css
├── Button.tsx
├── Button.module.css
├── Loader.tsx
├── Loader.module.css
├── KpiCard.tsx
├── KpiCard.module.css
├── Pagination.tsx
├── Pagination.module.css
└── ... (add new components here)
```

Component showcase and gallery:
```
src/app/shared/ui/
├── page.tsx                           # Gallery index page
├── ComponentRegistry.tsx               # Component registry & gallery UI
├── ComponentShowcase.tsx               # Component example renderer
└── [component]/
    ├── page.tsx                       # Server component for static routes
    └── ComponentViewClient.tsx        # Client component with examples
```

## Step 1: Create the Component

Create a new file in `src/shared/components/ui/` with your component name:

```tsx
// src/shared/components/ui/YourComponent.tsx

interface YourComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
}

export function YourComponent({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
}: YourComponentProps) {
  return (
    <div className={`${styles.component} ${styles[variant]} ${styles[size]}`} disabled={disabled}>
      {children}
    </div>
  );
}
```

## Step 2: Create the Component Stylesheet

Create a CSS Module alongside your component:

```css
/* src/shared/components/ui/YourComponent.module.css */

.component {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-weight: var(--font-weight-medium);
}

/* Variants */
.primary {
  background-color: var(--color-brand-500);
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: var(--color-brand-600);
}

/* Sizes */
.sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}
```

## Step 3: Create Storybook Stories (Optional)

For complex components, create a Storybook story file:

```tsx
// src/shared/components/ui/YourComponent.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'UI/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
```

Run Storybook with: `npm run storybook`

## Step 4: Register the Component in the Gallery

Update `src/app/shared/ui/ComponentRegistry.tsx`:

```tsx
export const COMPONENTS = [
  // ... existing components
  {
    slug: 'your-component',          // URL slug (lowercase, hyphenated)
    name: 'YourComponent',           // Display name
    description: 'Brief description of what this component does',
    category: 'Actions'              // Category: Actions, Data Display, Feedback, Navigation
  }
];
```

## Step 5: Add Component Examples

Update `src/app/shared/ui/[component]/ComponentViewClient.tsx`:

Add your component to the imports:
```tsx
import { YourComponent } from '@/shared/components/ui/YourComponent';
```

Update the `COMPONENT_REGISTRY`:

```tsx
const COMPONENT_REGISTRY: Record<string, { ... }> = {
  // ... existing entries
  'your-component': {
    name: 'YourComponent',
    component: YourComponent,
    examples: [
      {
        title: 'Default',
        description: 'Standard component appearance',
        props: { children: 'Default' }
      },
      {
        title: 'Primary Variant',
        description: 'Primary action style',
        props: { children: 'Primary', variant: 'primary' }
      },
      {
        title: 'Disabled State',
        description: 'Component in disabled state',
        props: { children: 'Disabled', disabled: true }
      },
      {
        title: 'Small Size',
        description: 'Compact version',
        props: { children: 'Small', size: 'sm' }
      },
      {
        title: 'Large Size',
        description: 'Expanded version',
        props: { children: 'Large', size: 'lg' }
      }
    ]
  }
};
```

## Step 6: View Your Component

1. Start the development server: `npm run dev`
2. Visit the components gallery: `http://localhost:3000/product-management-front/shared/ui/`
3. Click on your new component to view examples and code snippets

## Best Practices

### Naming
- Use PascalCase for component names: `MyButton`, `DataTable`, `Modal`
- Use kebab-case for slugs: `my-button`, `data-table`, `modal`
- Be descriptive: `SelectInput` is better than `Selector`

### CSS Modules
- Use CSS Variables from `src/shared/styles/tokens.css`
- Follow the BEM-style naming within modules
- Always include responsive design considerations
- Use `var(--transition-fast)` for consistent animations

### Props
- Keep props simple and focused
- Use TypeScript for type safety
- Document props with JSDoc comments
- Provide sensible defaults

### Accessibility
- Include proper ARIA labels when needed
- Ensure keyboard navigation support
- Use semantic HTML when possible
- Test with screen readers

### Examples
- Provide 3-5 diverse examples in the gallery
- Show different states (default, loading, error, disabled)
- Show different variants and sizes
- Include edge cases

## Categories

Choose an appropriate category for your component:

- **Actions**: Buttons, form controls, interactive elements
- **Data Display**: Badges, cards, tables, lists
- **Feedback**: Loaders, spinners, alerts, toasts
- **Navigation**: Pagination, breadcrumbs, menus

## Component Template

Use this template for quickly creating new components:

```tsx
// src/shared/components/ui/MyComponent.tsx

import styles from './MyComponent.module.css';

interface MyComponentProps {
  // Define your props
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}

/**
 * MyComponent - A brief description of what this component does
 * 
 * @example
 * <MyComponent variant="primary">Hello World</MyComponent>
 */
export function MyComponent({
  children,
  variant = 'default',
}: MyComponentProps) {
  return (
    <div className={`${styles.component} ${styles[variant]}`}>
      {children}
    </div>
  );
}
```

## Testing Your Component

Create tests in `src/shared/components/ui/__tests__/`:

```tsx
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('renders with children', () => {
    render(<YourComponent>Test Content</YourComponent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<YourComponent variant="primary">Test</YourComponent>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('primary');
  });
});
```

## Deployment

When you deploy to GitHub Pages, the component gallery is automatically included and will showcase all components added to the registry.

Visit: `https://suku60.github.io/product-management-front/shared/ui/`

## Troubleshooting

### Component not showing in gallery
- Verify the slug matches your file/component name
- Check that the component is imported in `ComponentViewClient.tsx`
- Ensure the component export is named correctly

### Examples not rendering
- Check that all props match the component interface
- Verify event handlers like `onPageChange` are provided
- Make sure children are passed when required

### Styling not applied
- CSS Modules must be imported in the component
- Verify class names match module exports
- Check that CSS Variables are defined in `tokens.css`

## Useful Links

- [Component Gallery](/product-management-front/shared/ui/)
- [CSS Tokens Reference](/src/shared/styles/tokens.css)
- [Storybook Docs](https://storybook.js.org/)
- [React Best Practices](https://react.dev/)
