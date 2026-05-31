'use client';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductItem {
  name: string;
  image: string;
  price: number;
  sold: number;
}

export function BestSellingProducts({ data }: { data?: ProductItem[] }) {
  const products = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground py-8 text-center">
                  No sales data yet
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted size-10 overflow-hidden rounded-md">
                        <Image
                          src={product.image ?? '/products/placeholder.svg'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="size-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
