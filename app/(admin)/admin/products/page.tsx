import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your products here</p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Products' }]} />
    </div>
  );
}
