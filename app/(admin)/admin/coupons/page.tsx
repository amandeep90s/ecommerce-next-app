import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CouponPageView } from '@/features/admin/views/coupon-page-view';

export default function CouponsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Coupons' }]} />

      <CouponPageView />
    </div>
  );
}
