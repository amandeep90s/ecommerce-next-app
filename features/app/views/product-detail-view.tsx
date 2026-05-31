'use client';

import { ChevronLeft, Heart, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { addToCart } from '@/features/app/cartSlice';
import { ProductImageGallery } from '@/features/app/components/catalog/product-image-gallery';
import { ProductInfo } from '@/features/app/components/catalog/product-info';
import { ProductReviewsSection } from '@/features/app/components/catalog/product-reviews-section';
import { ProductVariantSelector } from '@/features/app/components/catalog/product-variant-selector';
import { useGetProductBySlug } from '@/features/app/hooks/use-get-product-by-slug';
import { useGetProductReviews } from '@/features/app/hooks/use-get-product-reviews';
import { useGetProductVariants } from '@/features/app/hooks/use-get-product-variants';
import {
  useAddToWishlist,
  useGetWishlist,
  useRemoveFromWishlist,
} from '@/features/customer/hooks/use-wishlist';
import { useAppDispatch } from '@/store/hooks';
import type { IProductVariantItem } from '@/types';

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
  const [selectedVariant, setSelectedVariant] = useState<IProductVariantItem | null>(null);

  const { data: wishlistData } = useGetWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductBySlug(slug);
  const product = productData?.data ?? null;

  const { data: variantsData } = useGetProductVariants(product?.id ?? '');
  const variants = variantsData?.data ?? [];

  const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviews(
    product?.id ?? '',
    20,
  );
  const reviews = reviewsData?.data ?? [];

  // Derive price/stock from selected variant or base product
  const activePrice = selectedVariant?.selling_price ?? product?.selling_price ?? 0;
  const activeOriginalPrice = selectedVariant?.price ?? product?.price ?? 0;
  const activeStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const activeDiscount = selectedVariant?.discount ?? product?.discount ?? 0;
  const hasDiscount = activeDiscount > 0;
  const isOutOfStock = activeStock === 0;

  // Determine which images to show
  const activeImages = useMemo(() => {
    if (selectedVariant && selectedVariant.media.length > 0) {
      return selectedVariant.media;
    }
    return product?.media ?? [];
  }, [selectedVariant, product?.media]);

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(activeStock, q + 1));
  }

  function handleVariantSelect(variant: IProductVariantItem | null) {
    setSelectedVariant(variant);
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        name: product.name,
        slug: product.slug,
        image: activeImages[0]?.path ?? '/images/placeholder.png',
        price: activeOriginalPrice,
        selling_price: activePrice,
        discount: activeDiscount,
        stock: activeStock,
        color: selectedVariant?.color ?? null,
        size: selectedVariant?.size ?? null,
        sku: selectedVariant?.sku ?? product.sku,
        quantity,
      }),
    );
    toast.success(`${product.name} added to cart`);
  }

  const isInWishlist = wishlistData?.data?.some((item) => item.productId?.id === product?.id);

  function handleWishlistToggle() {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product.id, {
        onSuccess: () => toast.success('Removed from wishlist'),
      });
    } else {
      addToWishlistMutation.mutate(product.id, {
        onSuccess: () => toast.success('Added to wishlist'),
      });
    }
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
            <ProductImageGallery images={activeImages} productName={product.name} />
            <div className="flex flex-col gap-6">
              <ProductInfo
                product={product}
                reviews={reviews}
                averageRating={averageRating}
                quantity={quantity}
                hasDiscount={hasDiscount}
                isOutOfStock={isOutOfStock}
                activePrice={activePrice}
                activeOriginalPrice={activeOriginalPrice}
                activeStock={activeStock}
                selectedVariant={selectedVariant}
                requiresVariantSelection={variants.length > 0 && !selectedVariant}
                onDecrement={decrement}
                onIncrement={increment}
                onAddToCart={handleAddToCart}
              />
              {variants.length > 0 && (
                <ProductVariantSelector
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onSelect={handleVariantSelect}
                />
              )}
              <Button
                variant="outline"
                className="w-fit gap-2"
                onClick={handleWishlistToggle}
                disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
              >
                <Heart className={`size-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
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
