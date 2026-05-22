import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CouponEditView } from '@/features/admin/views/coupon-edit-view';

interface CouponEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CouponEditPage({ params }: CouponEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Coupon</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Coupons', href: '/admin/coupons' }, { label: 'Edit' }]}
      />

      <CouponEditView id={id} />
    </div>
  );
}
