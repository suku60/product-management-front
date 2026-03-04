import type { Metadata } from 'next';
import { StoreDetailView } from '@/features/stores/components/StoreDetailView';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Edit Store' };

export default function StoreDetailPage({ params }: Props) {
  return <StoreDetailView storeId={params.id} />;
}
