import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { SupportTicketPageView } from '@/features/admin/views/support-ticket-page-view';

export default function SupportTicketsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Support Tickets' }]} />

      <SupportTicketPageView />
    </div>
  );
}
