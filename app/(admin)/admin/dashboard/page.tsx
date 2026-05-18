import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">Welcome to your admin dashboard</p>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Dashboard' }]} />
    </div>
  );
}
