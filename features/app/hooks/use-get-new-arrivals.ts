import { useQuery } from '@tanstack/react-query';

interface NewArrivalsResponse {
  success: boolean;
  message: string;
  data: {
    items: Array<{
      id: string;
      name: string;
      slug: string;
      price: number;
      selling_price: number;
      discount: number;
      media: { path: string; alt?: string }[];
      category?: { name: string };
    }>;
  } | null;
}

async function getNewArrivals(limit = 8): Promise<NewArrivalsResponse> {
  const response = await fetch(`/api/products/public?sort=newest&limit=${limit}`);
  return response.json();
}

export function useGetNewArrivals(limit = 8) {
  return useQuery({
    queryKey: ['new-arrivals', limit],
    queryFn: () => getNewArrivals(limit),
  });
}
