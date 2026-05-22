import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ProductCreateView } from '@/features/admin/views/product-create-view';

export default function AddProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Products', href: '/admin/products' }, { label: 'New' }]}
      />

      <ProductCreateView />
    </div>
  );
}
