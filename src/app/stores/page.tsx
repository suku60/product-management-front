import type { Metadata } from 'next';
import { StoresView } from '@/features/stores/components/StoresView';

export const metadata: Metadata = { title: 'Stores' };

export default function StoresPage() {
  return <StoresView />;
}
