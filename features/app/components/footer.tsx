import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

import Logo from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { APP_NAME } from '@/config/env';

export function Footer() {
  return (
    <footer className="py-8">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0">
          <Logo className="h-9 w-auto" />

          <nav className="text-muted-foreground [&_a]:hover:text-primary flex flex-wrap justify-center gap-4 [&_a]:text-sm">
            <Link href="/">Home</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faqs">FAQs</Link>
          </nav>

          <div className="text-muted-foreground flex justify-center space-x-6 [&_a]:text-sm">
            <Link
              href="https://www.facebook.com/profile.php?id=61589412350092"
              target="_blank"
              className="hover:text-blue-500"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://www.instagram.com/amandeep90s"
              target="_blank"
              className="hover:text-pink-500"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://www.youtube.com/@amandeep90s"
              target="_blank"
              className="hover:text-red-500"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </Link>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link
              className="text-muted-foreground hover:text-primary text-xs hover:underline"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary text-xs hover:underline"
              href="/terms-conditions"
            >
              Terms of Service
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary text-xs hover:underline"
              href="/refund-policy"
            >
              Refund Policy
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary text-xs hover:underline"
              href="/support"
            >
              Support Ticket
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
