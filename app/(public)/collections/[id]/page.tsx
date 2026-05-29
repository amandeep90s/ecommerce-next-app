import { CategoryView } from '@/features/app/views/category-view';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id: slug } = await params;
  return <CategoryView slug={slug} />;
}
