import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CategoryEditView } from '@/features/admin/views/category-edit-view';

interface CategoryEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Category</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Categories', href: '/admin/categories' }, { label: 'Edit' }]}
      />

      <CategoryEditView id={id} />
    </div>
  );
}
