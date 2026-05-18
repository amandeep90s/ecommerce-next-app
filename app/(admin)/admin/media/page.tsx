import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { UploadMedia } from '@/features/admin/components/media/upload-media';

export default function MediaPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage your product media and images here
        </p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Media' }]} />

      <UploadMedia />
    </div>
  );
}
