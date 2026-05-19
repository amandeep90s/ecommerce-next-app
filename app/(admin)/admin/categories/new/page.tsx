import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CategoryCreateView } from '@/features/admin/views/category-create-view';

export default function AddCategoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Category</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Categories', href: '/admin/categories' }, { label: 'New' }]}
      />

      <CategoryCreateView />
    </div>
  );
}
