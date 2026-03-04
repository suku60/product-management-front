import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = {
  args: { children: 'In Stock', variant: 'success' },
};

export const Warning: Story = {
  args: { children: 'Low Stock', variant: 'warning' },
};

export const Danger: Story = {
  args: { children: 'Out of Stock', variant: 'danger' },
};

export const Info: Story = {
  args: { children: 'electronics', variant: 'info' },
};

export const Neutral: Story = {
  args: { children: 'Category', variant: 'neutral' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};
