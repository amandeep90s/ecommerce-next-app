import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function ChangePassword() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your account password here</p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Change Password' }]} />
    </div>
  );
}
