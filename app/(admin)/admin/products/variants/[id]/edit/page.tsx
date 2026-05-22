import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ProductVariantEditView } from '@/features/admin/views/product-variant-edit-view';

interface ProductVariantEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductVariantEditPage({ params }: ProductVariantEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Variant</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Variants', href: '/admin/products/variants' },
          { label: 'Edit' },
        ]}
      />

      <ProductVariantEditView id={id} />
    </div>
  );
}
