'use client';

import Fuse from 'fuse.js';
import {
  HomeIcon,
  ImageIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  Package2Icon,
  PackageIcon,
  Plus,
  Search,
  ShoppingCartIcon,
  StarIcon,
  TicketIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SearchItem {
  label: string;
  description: string;
  href: string;
  category: string;
  icon: React.ReactNode;
}

const searchItems: SearchItem[] = [
  {
    label: 'Dashboard',
    description: 'Overview and analytics of your store',
    href: '/admin/dashboard',
    category: 'Navigation',
    icon: <HomeIcon className="size-4" />,
  },
  {
    label: 'Customers',
    description: 'View and manage your customers',
    href: '/admin/customers',
    category: 'Customers',
    icon: <UsersIcon className="size-4" />,
  },
  {
    label: 'Orders',
    description: 'Track and manage customer orders',
    href: '/admin/orders',
    category: 'Orders',
    icon: <ShoppingCartIcon className="size-4" />,
  },
  {
    label: 'All Categories',
    description: 'Browse and manage product categories',
    href: '/admin/categories',
    category: 'Categories',
    icon: <LayoutGridIcon className="size-4" />,
  },
  {
    label: 'Add Category',
    description: 'Create a new product category',
    href: '/admin/categories/new',
    category: 'Categories',
    icon: <Plus className="size-4" />,
  },
  {
    label: 'All Products',
    description: 'Browse and manage all your products',
    href: '/admin/products',
    category: 'Products',
    icon: <PackageIcon className="size-4" />,
  },
  {
    label: 'Add Product',
    description: 'Create and publish a new product',
    href: '/admin/products/new',
    category: 'Products',
    icon: <Plus className="size-4" />,
  },
  {
    label: 'All Variants',
    description: 'Manage all product variants and options',
    href: '/admin/products/variants',
    category: 'Products',
    icon: <Package2Icon className="size-4" />,
  },
  {
    label: 'Add Variant',
    description: 'Create a new product variant',
    href: '/admin/products/variants/new',
    category: 'Products',
    icon: <Plus className="size-4" />,
  },
  {
    label: 'All Coupons',
    description: 'View and manage discount coupons',
    href: '/admin/coupons',
    category: 'Coupons',
    icon: <TicketIcon className="size-4" />,
  },
  {
    label: 'Add Coupon',
    description: 'Create a new discount coupon',
    href: '/admin/coupons/new',
    category: 'Coupons',
    icon: <Plus className="size-4" />,
  },
  {
    label: 'Rating & Reviews',
    description: 'Monitor and respond to customer reviews',
    href: '/admin/reviews',
    category: 'Reviews',
    icon: <StarIcon className="size-4" />,
  },
  {
    label: 'Media',
    description: 'Upload and manage media files and images',
    href: '/admin/media',
    category: 'Media',
    icon: <ImageIcon className="size-4" />,
  },
  {
    label: 'Profile',
    description: 'View and edit your admin profile',
    href: '/admin/profile',
    category: 'Settings',
    icon: <UserIcon className="size-4" />,
  },
  {
    label: 'Change Password',
    description: 'Update your account password securely',
    href: '/admin/change-password',
    category: 'Settings',
    icon: <KeyRoundIcon className="size-4" />,
  },
];

const fuseOptions = {
  keys: [
    { name: 'label', weight: 0.6 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
};

interface ResultsListProps {
  query: string;
  results: SearchItem[];
  onSelect: () => void;
  className?: string;
}

function ResultsList({ query, results, onSelect, className }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className={className}>
        <p className="text-muted-foreground px-4 py-6 text-center text-sm">
          No results for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <ul className={className}>
      {results.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onSelect}
            className="hover:bg-muted focus:bg-muted flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus:outline-none"
          >
            <span className="text-muted-foreground shrink-0">{item.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{item.label}</span>
              <span className="text-muted-foreground block truncate text-xs">
                {item.description}
              </span>
            </span>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {item.category}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const isOpen = query.trim().length > 0;
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => new Fuse(searchItems, fuseOptions), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuery('');
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = () => setQuery('');

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages..."
        className="w-52 pl-8 md:w-64"
      />
      {isOpen && (
        <div className="bg-popover ring-foreground/10 absolute top-full left-0 z-50 mt-1 w-full min-w-72 overflow-hidden rounded-lg shadow-lg ring-1">
          <ResultsList
            query={query}
            results={results}
            onSelect={handleSelect}
            className="max-h-72 overflow-y-auto py-1"
          />
        </div>
      )}
    </div>
  );
}
