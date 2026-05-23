import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ChangePasswordView } from '@/features/admin/views/change-password-view';

export default function ChangePassword() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Change Password</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Change Password' }]} />

      <ChangePasswordView />
    </div>
  );
}
