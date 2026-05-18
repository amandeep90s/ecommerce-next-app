import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your orders here</p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Orders' }]} />
    </div>
  );
}
