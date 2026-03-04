import type { Metadata } from 'next';
import { ProductDetailView } from '@/features/products/components/ProductDetailView';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Product Detail' };

export default function ProductDetailPage({ params }: Props) {
  const productId = parseInt(params.id, 10);
  return <ProductDetailView productId={productId} />;
}
