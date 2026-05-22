import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CustomerPageView } from '@/features/admin/views/customer-page-view';

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Customers' }]} />

      <CustomerPageView />
    </div>
  );
}
