import type { Metadata } from 'next';
import { StoreDetailView } from '@/features/stores/components/StoreDetailView';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Edit Store' };

export async function generateStaticParams() {
  const storeIds = ['store-001', 'store-002', 'store-003'];

  return storeIds.map((id) => ({
    id,
  }));
}

export default function StoreDetailPage({ params }: Props) {
  return <StoreDetailView storeId={params.id} />;
}
