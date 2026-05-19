import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { MediaEditView } from '@/features/admin/views/media-edit-view';

interface MediaEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function MediaEditPage({ params }: MediaEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <AdminBreadcrumb
        breadcrumbItems={[{ label: 'Media', href: '/admin/media' }, { label: 'Edit Image' }]}
      />

      <MediaEditView id={id} />
    </div>
  );
}
