import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { AdminOrderDetailView } from '@/features/admin/views/order-detail-view';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Orders', href: '/admin/orders' }, { label: 'Order Details' }]}
      />

      <AdminOrderDetailView id={id} />
    </div>
  );
}
