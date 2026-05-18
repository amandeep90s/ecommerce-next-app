import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function ProductVariantsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Variants</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage product variants here</p>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Products', href: '/admin/products' }, { label: 'Variants' }]}
      />
    </div>
  );
}
