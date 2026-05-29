import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { ContactPageView } from '@/features/admin/views/contact-page-view';

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Contact' }]} />

      <ContactPageView />
    </div>
  );
}
