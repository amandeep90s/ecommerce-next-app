import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ReviewEditView } from '@/features/admin/views/review-edit-view';

interface ReviewEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewEditPage({ params }: ReviewEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Review</h1>
      </div>

      <AdminBreadcrumb
        breadcrumbItems={[
          { label: 'Ratings & Reviews', href: '/admin/reviews' },
          { label: 'Edit' },
        ]}
      />

      <ReviewEditView id={id} />
    </div>
  );
}
