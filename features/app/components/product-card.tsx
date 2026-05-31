import { Heart } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const productData = {
  name: 'Vintage Denim Jacket',
  description:
    'A classic denim jacket with a vintage wash and durable stitching. Perfect for everyday streetwear.',
  price: 180.0,
  image:
    'https://images.unsplash.com/photo-1649937408746-4d2f603f91c8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1226',
  isBestSeller: true,
  isFavorited: false,
};

export function ProductCardOne() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent>
        {/* Product Image */}
        <div className="relative mb-6">
          <div className="relative flex h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={productData.image}
              alt={productData.name}
              className="object-fit h-full w-full"
            />

            <Button variant="ghost" size="icon" className="absolute top-2 right-2">
              <Heart
                className={cn(
                  'h-6 w-6 transition-colors',
                  productData.isFavorited
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-800 hover:text-red-500',
                )}
              />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <CardTitle className="mb-2 text-xl leading-tight">{productData.name}</CardTitle>
          <CardDescription className="text-sm">{productData.description}</CardDescription>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">${productData.price.toFixed(2)}</p>

          <Button>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  );
}
