import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ReviewPageView } from '@/features/admin/views/review-page-view';

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Ratings & Reviews' }]} />

      <ReviewPageView />
    </div>
  );
}
