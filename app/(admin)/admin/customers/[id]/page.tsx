import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CustomerDetailView } from '@/features/admin/views/customer-detail-view';

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Details</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Customers', href: '/admin/customers' }, { label: 'Details' }]}
      />

      <CustomerDetailView id={id} />
    </div>
  );
}
