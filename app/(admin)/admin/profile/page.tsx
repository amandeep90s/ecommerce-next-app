import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Profile' }]} />
    </div>
  );
}
