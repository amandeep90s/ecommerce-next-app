'use client';

import { useGetFeaturedProducts } from '@/features/app/hooks/use-get-featured-products';

export function FeaturedProductsView() {
  const { data, isLoading } = useGetFeaturedProducts();
  const products = data?.data ?? [];

  if (isLoading) return <div>Loading featured products…</div>;

  return (
    <section>
      <h2>Featured Products</h2>
      {products.length === 0 ? (
        <p>No featured products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
