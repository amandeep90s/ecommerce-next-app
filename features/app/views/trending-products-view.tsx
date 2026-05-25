'use client';

import { useGetTrendingProducts } from '@/features/app/hooks/use-get-trending-products';

export function TrendingProductsView() {
  const { data, isLoading } = useGetTrendingProducts();
  const products = data?.data ?? [];

  if (isLoading) return <div>Loading trending products…</div>;

  return (
    <section>
      <h2>Trending Products</h2>
      {products.length === 0 ? (
        <p>No trending products available.</p>
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
