'use client';

import { useQuery } from '@tanstack/react-query';
import { Heart, Package, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }[];
}

async function getDashboard(): Promise<{ data: DashboardData }> {
  const response = await fetchWithAuth('/api/customers/dashboard');
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch dashboard');
  return result;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function DashboardView() {
  const { data, isLoading } = useQuery({
    queryKey: ['customer', 'dashboard'],
    queryFn: getDashboard,
  });

  const dashboard = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.totalOrders ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Truck className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.pendingOrders ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.wishlistCount ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Package className="text-muted-foreground size-10" />
              <p className="text-muted-foreground text-sm">No orders yet</p>
              <Button size="sm" asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}

          {dashboard?.recentOrders && dashboard.recentOrders.length > 0 && (
            <div className="space-y-3">
              {dashboard.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">#{order.orderNumber}</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                    <Badge variant="secondary" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
