interface ProductDetailsPageProps {
  params: Promise<{ id: string; productId: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id, productId } = await params;
  return (
    <div>
      ProductDetailsPage collection:{id} product:{productId}
    </div>
  );
}
