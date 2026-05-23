import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { MediaPageView } from '@/features/admin/views/media-page-view';

export default function MediaPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Media' }]} />

      <MediaPageView />
    </div>
  );
}
