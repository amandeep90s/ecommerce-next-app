'use client';

import { Loader2, PackageSearchIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  selling_price: number;
  price: number;
  media?: { path: string; alt?: string }[];
  category?: { name: string };
}

interface ProductSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductSearchDialog({ open, onOpenChange }: ProductSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset state and abort any in-flight request when the dialog closes
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setQuery('');
      setResults([]);
      setIsLoading(false);
      abortRef.current?.abort();
    }
    onOpenChange(next);
  };

  const searchProducts = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();

    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/products/public?q=${encodeURIComponent(q.trim())}&limit=8`, {
        signal: controller.signal,
      });
      const data = await res.json();
      if (data.success && data.data?.items) {
        setResults(data.data.items);
      } else {
        setResults([]);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setResults([]);
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => searchProducts(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  const handleSelect = (slug: string) => {
    handleOpenChange(false);
    router.push(`/shop/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>Search for products by name or description</DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          <SearchIcon className="text-muted-foreground mr-2 size-4 shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="h-12 border-0 shadow-none focus-visible:ring-0"
          />
          {isLoading && <Loader2 className="text-muted-foreground size-4 shrink-0 animate-spin" />}
        </div>

        {/* Results */}
        <ScrollArea className="max-h-80">
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <PackageSearchIcon className="text-muted-foreground mb-2 size-8" />
              <p className="text-muted-foreground text-sm">No products found</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex flex-col py-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product.slug)}
                  className="hover:bg-muted/50 flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                >
                  {product.media?.[0]?.path ? (
                    <Image
                      src={product.media[0].path}
                      alt={product.media[0].alt || product.name}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md border object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md border">
                      <PackageSearchIcon className="text-muted-foreground size-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    {product.category?.name && (
                      <p className="text-muted-foreground truncate text-xs">
                        {product.category.name}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium">${product.selling_price.toFixed(2)}</p>
                    {product.selling_price < product.price && (
                      <p className="text-muted-foreground text-xs line-through">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="flex flex-col items-center justify-center py-12">
              <SearchIcon className="text-muted-foreground mb-2 size-8" />
              <p className="text-muted-foreground text-sm">Start typing to search products</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
