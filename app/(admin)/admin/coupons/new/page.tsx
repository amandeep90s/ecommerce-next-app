import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CouponCreateView } from '@/features/admin/views/coupon-create-view';

export default function AddCouponPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Coupon</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Coupons', href: '/admin/coupons' }, { label: 'New' }]}
      />

      <CouponCreateView />
    </div>
  );
}
