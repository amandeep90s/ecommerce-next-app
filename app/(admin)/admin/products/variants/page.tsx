import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ProductVariantPageView } from '@/features/admin/views/product-variant-page-view';

export default function ProductVariantsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Variants</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Products', href: '/admin/products' }, { label: 'Variants' }]}
      />

      <ProductVariantPageView />
    </div>
  );
}
