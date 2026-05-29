import { useGetPublicCategories } from './use-get-public-categories';

export function useGetCategoryBySlug(slug: string) {
  const { data, isLoading, isError } = useGetPublicCategories();
  const category = data?.data?.find((c) => c.slug === slug) ?? null;
  return { category, isLoading, isError };
}
