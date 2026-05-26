import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { SettingsView } from '@/features/admin/views/settings-view';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Settings' }]} />

      <SettingsView />
    </div>
  );
}
