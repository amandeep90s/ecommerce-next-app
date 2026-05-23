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

const products = [
  {
    name: 'Sports Shoes',
    image: '/products/placeholder.svg',
    price: '$316.00',
    sold: 10,
  },
  {
    name: 'Black T-Shirt',
    image: '/products/placeholder.svg',
    price: '$274.00',
    sold: 20,
  },
  {
    name: 'Jeans',
    image: '/products/placeholder.svg',
    price: '$195.00',
    sold: 15,
  },
  {
    name: 'Red Sneakers',
    image: '/products/placeholder.svg',
    price: '$402.00',
    sold: 40,
  },
  {
    name: 'Red Scarf',
    image: '/products/placeholder.svg',
    price: '$280.00',
    sold: 37,
  },
  {
    name: 'Kitchen Accessory',
    image: '/products/placeholder.svg',
    price: '$150.00',
    sold: 18,
  },
  {
    name: 'Bicycle',
    image: '/products/placeholder.svg',
    price: '$316.00',
    sold: 25,
  },
  {
    name: 'Sports Shoes',
    image: '/products/placeholder.svg',
    price: '$290.00',
    sold: 12,
  },
];

export function BestSellingProducts() {
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
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted size-10 overflow-hidden rounded-md">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.sold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
