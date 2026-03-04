import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: 'UI/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: { label: 'Total Products', value: '194' },
};

export const WithSubtext: Story = {
  args: { label: 'Low Stock', value: '12', subtext: '10 units remaining', variant: 'warning' },
};

export const Loading: Story = {
  args: { label: 'Total Products', value: '-', isLoading: true },
};
