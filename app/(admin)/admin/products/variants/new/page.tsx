import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ProductVariantCreateView } from '@/features/admin/views/product-variant-create-view';

export default function AddProductVariantPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Variant</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Variants', href: '/admin/products/variants' },
          { label: 'New' },
        ]}
      />

      <ProductVariantCreateView />
    </div>
  );
}
