'use client';

import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { IProductVariantItem } from '@/types';

interface ProductVariantSelectorProps {
  variants: IProductVariantItem[];
  selectedVariant: IProductVariantItem | null;
  onSelect: (variant: IProductVariantItem | null) => void;
}

export function ProductVariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: ProductVariantSelectorProps) {
  // Group unique colors and sizes
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size))], [variants]);

  const selectedColor = selectedVariant?.color ?? null;
  const selectedSize = selectedVariant?.size ?? null;

  function handleColorSelect(color: string) {
    // Find the variant matching this color + current size (or first available)
    const match =
      variants.find((v) => v.color === color && v.size === selectedSize && v.stock > 0) ??
      variants.find((v) => v.color === color && v.stock > 0) ??
      variants.find((v) => v.color === color);
    onSelect(match ?? null);
  }

  function handleSizeSelect(size: string) {
    // Find the variant matching current color + this size
    const match =
      variants.find((v) => v.size === size && v.color === selectedColor && v.stock > 0) ??
      variants.find((v) => v.size === size && v.stock > 0) ??
      variants.find((v) => v.size === size);
    onSelect(match ?? null);
  }

  // Check if a color/size combo is available
  function isColorAvailable(color: string) {
    if (!selectedSize) return variants.some((v) => v.color === color && v.stock > 0);
    return variants.some((v) => v.color === color && v.size === selectedSize && v.stock > 0);
  }

  function isSizeAvailable(size: string) {
    if (!selectedColor) return variants.some((v) => v.size === size && v.stock > 0);
    return variants.some((v) => v.size === size && v.color === selectedColor && v.stock > 0);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            Color{selectedColor ? `: ${selectedColor}` : ''}
          </Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const available = isColorAvailable(color);
              return (
                <Button
                  key={color}
                  type="button"
                  variant={selectedColor === color ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'cursor-pointer text-xs',
                    !available && 'cursor-not-allowed line-through opacity-40',
                  )}
                  disabled={!available}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            Size{selectedSize ? `: ${selectedSize}` : ''}
          </Label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = isSizeAvailable(size);
              return (
                <Button
                  key={size}
                  type="button"
                  variant={selectedSize === size ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'min-w-10 cursor-pointer text-xs',
                    !available && 'cursor-not-allowed line-through opacity-40',
                  )}
                  disabled={!available}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
