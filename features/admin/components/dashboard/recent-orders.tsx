'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderItem {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  paymentStatus: string;
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'delivered':
    case 'paid':
      return 'default' as const;
    case 'processing':
    case 'shipped':
      return 'secondary' as const;
    case 'cancelled':
    case 'failed':
      return 'destructive' as const;
    default:
      return 'outline' as const;
  }
}

export function RecentOrders({ data }: { data?: OrderItem[] }) {
  const orders = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow key={`${order.id}-${index}`}>
                  <TableCell className="pl-4 font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
