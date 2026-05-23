import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ReviewDetailView } from '@/features/admin/views/review-detail-view';

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Review Details</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[
          { label: 'Ratings & Reviews', href: '/admin/reviews' },
          { label: 'Details' },
        ]}
      />

      <ReviewDetailView id={id} />
    </div>
  );
}
