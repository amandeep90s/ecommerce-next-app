import { cookies } from 'next/headers';

import {
  BestSellingProducts,
  CustomerReviews,
  RecentOrders,
  ReturningRateChart,
  RevenueChart,
  SalesByLocation,
  StatsCards,
  StoreVisits,
  WelcomeBanner,
} from '@/features/admin/components/dashboard';

async function getDashboardData() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">E-Commerce Dashboard</h1>
      </div>

      <WelcomeBanner data={data?.welcomeBanner} />

      <StatsCards data={data?.stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <RevenueChart data={data?.revenueChart} />
        </div>
        <div className="min-w-0">
          <ReturningRateChart data={data?.ordersTrend} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentOrders data={data?.recentOrders} />
        </div>
        <div className="min-w-0">
          <SalesByLocation data={data?.salesByLocation} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <BestSellingProducts data={data?.bestSelling} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <StoreVisits data={data?.recentOrders} />
          <CustomerReviews data={data?.ratings} />
        </div>
      </div>
    </div>
  );
}
