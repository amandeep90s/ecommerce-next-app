import { OrderDetailView } from '@/features/customer/views/order-detail-view';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailView id={id} />;
}
