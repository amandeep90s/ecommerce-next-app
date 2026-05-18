import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function AddProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-2 text-sm">Create a new product</p>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Add New Product' },
        ]}
      />
    </div>
  );
}
