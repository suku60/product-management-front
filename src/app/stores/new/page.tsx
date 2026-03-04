import type { Metadata } from 'next';
import { StoreFormView } from '@/features/stores/components/StoreFormView';

export const metadata: Metadata = { title: 'New Store' };

export default function NewStorePage() {
  return <StoreFormView mode="create" />;
}
