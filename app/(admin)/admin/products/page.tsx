import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ProductPageView } from '@/features/admin/views/product-page-view';

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Products' }]} />

      <ProductPageView />
    </div>
  );
}
