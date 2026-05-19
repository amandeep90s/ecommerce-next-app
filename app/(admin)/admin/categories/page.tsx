import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { CategoryPageView } from '@/features/admin/views/category-page-view';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Categories' }]} />

      <CategoryPageView />
    </div>
  );
}
