import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your account information here</p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Profile' }]} />
    </div>
  );
}
