'use client';

import Link from 'next/link';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Badge } from '@/shared/components/ui/Badge';
import { useProductDetail } from '../hooks/useProductDetail';
import { formatPrice } from '../utils/product.utils';
import type { AvailabilityStatus } from '@/shared/types';
import styles from './ProductDetailView.module.css';

interface ProductDetailViewProps {
  productId: number;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { product, status, error } = useProductDetail(productId);

  if (status === 'loading') {
    return (
      <AppShell title="Loading…">
        <div className={styles.skeleton} aria-busy="true" aria-label="Loading product" />
      </AppShell>
    );
  }

  if (status === 'failed' || error) {
    return (
      <AppShell title="Error">
        <div className={styles.errorState} role="alert">
          <p>Failed to load product: {error}</p>
          <Link href="/products">← Back to products</Link>
        </div>
      </AppShell>
    );
  }

  if (!product) return null;

  const availabilityVariant: Record<AvailabilityStatus, 'success' | 'warning' | 'danger'> = {
    'In Stock': 'success',
    'Low Stock': 'warning',
    'Out of Stock': 'danger',
  };

  return (
    <AppShell title={product.title}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/products">Products</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.title}</span>
      </nav>

      <div className={styles.layout}>
        {/* Left — image */}
        <div className={styles.imageColumn}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.mainImage}
          />
          <div className={styles.imageThumbnails}>
            {product.images.slice(0, 4).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img} alt="" className={styles.thumbImage} />
            ))}
          </div>
        </div>

        {/* Right — info */}
        <div className={styles.infoColumn}>
          <div className={styles.headerRow}>
            <Badge variant="neutral">{product.category}</Badge>
            <Badge variant={availabilityVariant[product.availabilityStatus]}>
              {product.availabilityStatus}
            </Badge>
          </div>

          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.brand}>by {product.brand} · SKU: {product.sku}</p>

          <div className={styles.priceBlock}>
            <span className={styles.finalPrice}>{formatPrice(product.finalPrice)}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                <Badge variant="warning">
                  Save {formatPrice(product.savingsAmount)} ({product.discountPercentage.toFixed(0)}% off)
                </Badge>
              </>
            )}
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.stars} aria-label={`Rating: ${product.rating} out of 5`}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className={styles.ratingValue}>{product.rating} / 5</span>
            <span className={styles.reviewCount}>({product.reviews.length} reviews)</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <dt>Stock</dt>
              <dd>{product.stock.toLocaleString()} units</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Min. Order</dt>
              <dd>{product.minimumOrderQuantity}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Weight</dt>
              <dd>{product.weight} kg</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Shipping</dt>
              <dd>{product.shippingInformation}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Warranty</dt>
              <dd>{product.warrantyInformation}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Return Policy</dt>
              <dd>{product.returnPolicy}</dd>
            </div>
          </div>

          {product.tags.length > 0 && (
            <div className={styles.tags}>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
        <div className={styles.reviewsList}>
          {product.reviews.map((review, i) => (
            <article key={i} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <strong className={styles.reviewerName}>{review.reviewerName}</strong>
                <span className={styles.reviewRating} aria-label={`${review.rating} stars`}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
                <time className={styles.reviewDate} dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
