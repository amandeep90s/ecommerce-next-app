import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { IProductItem } from '@/types';

interface ProductCardProps {
  product: IProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.media[0]?.path ?? '/images/placeholder.png';
  const hasDiscount = product.discount > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                -{product.discount}%
              </Badge>
            )}
            {!hasDiscount && product.isFeatured && (
              <Badge className="absolute top-2 left-2">Featured</Badge>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-gray-800">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 p-3">
            <p className="text-muted-foreground truncate text-xs">{product.category.name}</p>
            <h3 className="line-clamp-2 text-sm leading-snug font-medium">{product.name}</h3>

            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold">${product.selling_price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-muted-foreground text-xs line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <Button size="sm" className="mt-1 w-full" disabled={isOutOfStock}>
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
