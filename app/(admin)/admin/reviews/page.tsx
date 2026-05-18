import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage customer ratings and reviews here
        </p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Ratings & Reviews' }]} />
    </div>
  );
}
