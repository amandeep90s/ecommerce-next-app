'use client';

import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  type CatalogSortOption,
  type CatalogState,
  resetFilters,
  setCategory,
  setPriceRange,
  setSearch,
  setSort,
} from '@/features/app/catalogSlice';
import { useGetPublicCategories } from '@/features/app/hooks/use-get-public-categories';
import { useAppDispatch } from '@/store/hooks';

interface CatalogFiltersProps {
  filters: CatalogState;
}

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $25', min: '', max: '25' },
  { label: '$25 – $50', min: '25', max: '50' },
  { label: '$50 – $100', min: '50', max: '100' },
  { label: 'Over $100', min: '100', max: '' },
] as const;

const SORT_OPTIONS: { id: CatalogSortOption; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

export function CatalogFilters({ filters }: CatalogFiltersProps) {
  const dispatch = useAppDispatch();
  const { data: categoriesData } = useGetPublicCategories();
  const categories = categoriesData?.data ?? [];

  // Local search state — debounced before dispatching to Redux
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Derived-state sync: when filters.search changes externally (e.g. resetFilters),
  // update the input without needing a setState-in-effect.
  const [prevFiltersSearch, setPrevFiltersSearch] = useState(filters.search);
  if (filters.search !== prevFiltersSearch) {
    setPrevFiltersSearch(filters.search);
    setLocalSearch(filters.search);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setSearch(localSearch));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch]);

  const selectedCategory = categories.find((c) => c.id === filters.category);
  const selectedSort = SORT_OPTIONS.find((s) => s.id === filters.sort) ?? SORT_OPTIONS[0];
  const selectedPriceRange =
    PRICE_RANGES.find((r) => r.min === filters.priceMin && r.max === filters.priceMax) ??
    PRICE_RANGES[0];

  type ActiveFilter = { type: string; label: string };
  const activeFilters: ActiveFilter[] = [];
  if (filters.search) activeFilters.push({ type: 'search', label: `"${filters.search}"` });
  if (filters.category && selectedCategory)
    activeFilters.push({ type: 'category', label: selectedCategory.name });
  if (selectedPriceRange !== PRICE_RANGES[0])
    activeFilters.push({ type: 'price', label: selectedPriceRange.label });

  function clearFilter(type: string) {
    if (type === 'search') {
      setLocalSearch('');
      dispatch(setSearch(''));
    }
    if (type === 'category') dispatch(setCategory(''));
    if (type === 'price') dispatch(setPriceRange({ min: '', max: '' }));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search products…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="h-9 pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 w-full cursor-pointer sm:w-auto">
              <SlidersHorizontal data-icon="inline-start" />
              Sort: {selectedSort.label}
              <ChevronDown data-icon="inline-end" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => dispatch(setSort(option.id))}
                className={filters.sort === option.id ? 'bg-accent' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 2: Category + Price filters */}
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 cursor-pointer px-3 text-xs">
              {selectedCategory ? selectedCategory.name : 'All Categories'}
              <ChevronDown data-icon="inline-end" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => dispatch(setCategory(''))}
              className={!filters.category ? 'bg-accent' : ''}
            >
              All Categories
            </DropdownMenuItem>
            {categories.length > 0 && <DropdownMenuSeparator />}
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                onClick={() => dispatch(setCategory(cat.id.toString()))}
                className={filters.category === cat.id.toString() ? 'bg-accent' : ''}
              >
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 cursor-pointer px-3 text-xs">
              {selectedPriceRange.label}
              <ChevronDown data-icon="inline-end" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {PRICE_RANGES.map((range) => (
              <DropdownMenuItem
                key={range.label}
                onClick={() => dispatch(setPriceRange({ min: range.min, max: range.max }))}
                className={selectedPriceRange === range ? 'bg-accent' : ''}
              >
                {range.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">Active filters:</span>
          {activeFilters.map((f) => (
            <Badge key={f.type} variant="secondary" className="gap-1 pr-1.5">
              {f.label}
              <button
                type="button"
                onClick={() => clearFilter(f.type)}
                className="hover:text-destructive ml-0.5 rounded-full"
                aria-label={`Remove ${f.label} filter`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetFilters())}
            className="text-muted-foreground h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
