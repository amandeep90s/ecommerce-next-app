import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ProductEditView } from '@/features/admin/views/product-edit-view';

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Products', href: '/admin/products' }, { label: 'Edit' }]}
      />

      <ProductEditView id={id} />
    </div>
  );
}
