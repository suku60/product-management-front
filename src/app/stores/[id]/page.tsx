import type { Metadata } from 'next';
import { StoreDetailView } from '@/features/stores/components/StoreDetailView';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Edit Store' };

export async function generateStaticParams() {
  const storeSimpleIds = Array.from({ length: 5 }, (_, i) => (i + 1).toString());
  const storeIds = ['store-001', 'store-002', 'store-003', 'store-004', 'store-005'];

  return storeIds.map((id) => ({
    id,
  }));
}

export default function StoreDetailPage({ params }: Props) {
  return <StoreDetailView storeId={params.id} />;
}
