import { Minus, Plus, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { IProductItem, IProductVariantItem, IReviewItem } from '@/types';

interface ProductInfoProps {
  product: IProductItem;
  reviews: IReviewItem[];
  averageRating: number;
  quantity: number;
  hasDiscount: boolean;
  isOutOfStock: boolean;
  activePrice: number;
  activeOriginalPrice: number;
  activeStock: number;
  selectedVariant: IProductVariantItem | null;
  requiresVariantSelection: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onAddToCart: () => void;
}

export function AverageStarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  );
}

export function ProductInfo({
  product,
  reviews,
  averageRating,
  quantity,
  hasDiscount,
  isOutOfStock,
  activePrice,
  activeOriginalPrice,
  activeStock,
  selectedVariant,
  requiresVariantSelection,
  onDecrement,
  onIncrement,
  onAddToCart,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Category */}
      <Link
        href={`/shop?category=${product.category.id}`}
        className="text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
      >
        {product.category.name}
      </Link>

      {/* Name */}
      <h1 className="text-3xl leading-tight font-bold">{product.name}</h1>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {hasDiscount && (
          <Badge variant="destructive">-{selectedVariant?.discount ?? product.discount}% OFF</Badge>
        )}
        {product.isFeatured && <Badge>Featured</Badge>}
        {product.isTrending && <Badge variant="secondary">Trending</Badge>}
      </div>

      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2">
          <AverageStarRating rating={averageRating} />
          <span className="text-muted-foreground text-sm">
            {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold">${activePrice.toFixed(2)}</span>
        {hasDiscount && (
          <span className="text-muted-foreground text-base line-through">
            ${activeOriginalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <Separator />

      {/* Description */}
      {product.description && (
        <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
      )}

      {/* Selected variant info */}
      {selectedVariant && (
        <div className="text-muted-foreground text-xs">
          <span className="font-medium">Selected:</span> {selectedVariant.color} /{' '}
          {selectedVariant.size} — SKU: {selectedVariant.sku}
        </div>
      )}

      {/* Stock */}
      <p className={`text-sm font-medium ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}>
        {isOutOfStock ? 'Out of Stock' : `In Stock (${activeStock} available)`}
      </p>

      {/* SKU */}
      {!selectedVariant && <p className="text-muted-foreground text-xs">SKU: {product.sku}</p>}

      {/* Quantity + Add to Cart */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={onDecrement}
              disabled={quantity <= 1}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={onIncrement}
              disabled={quantity >= activeStock}
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <Button
            className="flex-1"
            size="lg"
            onClick={onAddToCart}
            disabled={requiresVariantSelection}
          >
            {requiresVariantSelection ? 'Select Size & Color' : 'Add to Cart'}
          </Button>
        </div>
      )}

      {isOutOfStock && (
        <Button variant="outline" disabled className="w-full">
          Out of Stock
        </Button>
      )}
    </div>
  );
}
