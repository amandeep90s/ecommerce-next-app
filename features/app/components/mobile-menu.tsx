'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from '@/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useGetPublicCategories } from '@/features/app/hooks/use-get-public-categories';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIMPLE_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetPublicCategories();
  const categories = categoriesData?.data ?? [];

  function close() {
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full max-w-72 rounded-none p-0">
        {/* Accessible title (visually hidden) */}
        <DrawerHeader className="sr-only">
          <DrawerTitle>Navigation menu</DrawerTitle>
          <DrawerDescription>Site navigation links</DrawerDescription>
        </DrawerHeader>

        {/* Logo */}
        <div className="flex items-center border-b px-4 py-3" onClick={close}>
          <Logo className="h-8 w-auto" />
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col gap-0.5">
            {/* Simple links */}
            {SIMPLE_NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className={`hover:bg-accent flex w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === href ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Accordion: Collections & Shop */}
            <li>
              <Accordion type="multiple">
                <AccordionItem value="collections" className="border-none">
                  <AccordionTrigger className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium hover:no-underline [&>svg]:ml-auto">
                    Collections
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pl-3">
                    <ul className="flex flex-col gap-0.5">
                      <li>
                        <Link
                          href="/trending"
                          onClick={close}
                          className="text-muted-foreground hover:bg-accent hover:text-foreground flex rounded-md px-3 py-2 text-sm transition-colors"
                        >
                          Trending
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/featured"
                          onClick={close}
                          className="text-muted-foreground hover:bg-accent hover:text-foreground flex rounded-md px-3 py-2 text-sm transition-colors"
                        >
                          Featured
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shop" className="border-none">
                  <AccordionTrigger className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium hover:no-underline [&>svg]:ml-auto">
                    Shop
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pl-3">
                    {categoriesLoading ? (
                      <p className="text-muted-foreground px-3 py-2 text-sm">Loading…</p>
                    ) : categories.length === 0 ? (
                      <p className="text-muted-foreground px-3 py-2 text-sm">No categories.</p>
                    ) : (
                      <ul className="flex flex-col gap-0.5">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/collections/${category.slug}`}
                              onClick={close}
                              className="text-muted-foreground hover:bg-accent hover:text-foreground flex rounded-md px-3 py-2 text-sm transition-colors"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
          </ul>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
