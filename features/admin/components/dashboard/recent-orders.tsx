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

const orders = [
  {
    id: '#1023',
    customer: 'Theodore Bell',
    product: 'Tire Doodad',
    amount: '$300.00',
    status: 'Processing',
  },
  {
    id: '#2045',
    customer: 'Amelia Grant',
    product: 'Engine Kit',
    amount: '$450.00',
    status: 'Paid',
  },
  {
    id: '#3067',
    customer: 'Eleanor Ward',
    product: 'Brake Pad',
    amount: '$200.00',
    status: 'Success',
  },
  {
    id: '#4089',
    customer: 'Henry Carter',
    product: 'Fuel Pump',
    amount: '$500.00',
    status: 'Processing',
  },
  {
    id: '#5102',
    customer: 'Olivia Harris',
    product: 'Steering Wheel',
    amount: '$350.00',
    status: 'Failed',
  },
  {
    id: '#6123',
    customer: 'James Robinson',
    product: 'Air Filter',
    amount: '$180.00',
    status: 'Paid',
  },
  {
    id: '#7145',
    customer: 'Sophia Martinez',
    product: 'Oil Filter',
    amount: '$220.00',
    status: 'Success',
  },
  {
    id: '#8167',
    customer: 'Liam Thompson',
    product: 'Radiator Cap',
    amount: '$290.00',
    status: 'Processing',
  },
];

function getStatusVariant(status: string) {
  switch (status) {
    case 'Success':
    case 'Paid':
      return 'default' as const;
    case 'Processing':
      return 'secondary' as const;
    case 'Failed':
      return 'destructive' as const;
    default:
      return 'outline' as const;
  }
}

export function RecentOrders() {
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-4 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
