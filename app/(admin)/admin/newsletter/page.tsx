import { AdminBreadcrumb } from '@/features/admin/components/breadcrumb';
import { NewsletterPageView } from '@/features/admin/views/newsletter-page-view';

export default function NewsletterPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Newsletter</h1>
      </div>

      <AdminBreadcrumb breadcrumbItems={[{ label: 'Newsletter' }]} />

      <NewsletterPageView />
    </div>
  );
}
