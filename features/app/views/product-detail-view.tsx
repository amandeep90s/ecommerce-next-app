'use client';

import { ChevronLeft, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { addToCart } from '@/features/app/cartSlice';
import { ProductImageGallery } from '@/features/app/components/catalog/product-image-gallery';
import { ProductInfo } from '@/features/app/components/catalog/product-info';
import { ProductReviewsSection } from '@/features/app/components/catalog/product-reviews-section';
import { useGetProductBySlug } from '@/features/app/hooks/use-get-product-by-slug';
import { useGetProductReviews } from '@/features/app/hooks/use-get-product-reviews';
import { useAppDispatch } from '@/store/hooks';

interface ProductDetailViewProps {
  slug: string;
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductBySlug(slug);
  const product = productData?.data ?? null;

  const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviews(
    product?.id ?? '',
    20,
  );
  const reviews = reviewsData?.data ?? [];

  const hasDiscount = (product?.discount ?? 0) > 0;
  const isOutOfStock = (product?.stock ?? 0) === 0;
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(product?.stock ?? 1, q + 1));
  }

  function handleAddToCart() {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.media[0]?.path ?? '/images/placeholder.png',
        price: product.price,
        selling_price: product.selling_price,
        discount: product.discount,
        stock: product.stock,
        quantity,
      }),
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/shop"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to Shop
      </Link>

      {productLoading && <ProductDetailSkeleton />}

      {!productLoading && (productError || !product) && (
        <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-lg border">
          <PackageSearch className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">Product not found.</p>
          <Button variant="outline" asChild>
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </div>
      )}

      {!productLoading && product && (
        <>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <ProductImageGallery images={product.media} productName={product.name} />
            <ProductInfo
              product={product}
              reviews={reviews}
              averageRating={averageRating}
              quantity={quantity}
              hasDiscount={hasDiscount}
              isOutOfStock={isOutOfStock}
              onDecrement={decrement}
              onIncrement={increment}
              onAddToCart={handleAddToCart}
            />
          </div>

          <Separator className="my-12" />

          <ProductReviewsSection
            productId={product.id}
            reviews={reviews}
            reviewsLoading={reviewsLoading}
            averageRating={averageRating}
          />
        </>
      )}
    </div>
  );
}
