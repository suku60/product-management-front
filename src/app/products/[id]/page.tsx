import type { Metadata } from 'next';
import { ProductDetailView } from '@/features/products/components/ProductDetailView';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Product Detail' };

export async function generateStaticParams() {
  const productIds = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  return productIds.map((id) => ({
    id,
  }));
}

export default function ProductDetailPage({ params }: Props) {
  const productId = parseInt(params.id, 10);
  return <ProductDetailView productId={productId} />;
}
