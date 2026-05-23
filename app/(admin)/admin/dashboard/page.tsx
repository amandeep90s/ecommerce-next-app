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

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">E-Commerce Dashboard</h1>
      </div>

      <WelcomeBanner />

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <RevenueChart />
        </div>
        <div className="min-w-0">
          <ReturningRateChart />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentOrders />
        </div>
        <div className="min-w-0">
          <SalesByLocation />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <BestSellingProducts />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <StoreVisits />
          <CustomerReviews />
        </div>
      </div>
    </div>
  );
}
