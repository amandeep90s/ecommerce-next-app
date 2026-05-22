import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ReviewCreateView } from '@/features/admin/views/review-create-view';

export default function AddReviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Review</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Ratings & Reviews', href: '/admin/reviews' }, { label: 'New' }]}
      />

      <ReviewCreateView />
    </div>
  );
}
