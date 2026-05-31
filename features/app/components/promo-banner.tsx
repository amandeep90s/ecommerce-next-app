'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActiveCoupon {
  code: string;
  discount: number;
  minimumPurchase: number;
  validTo: string;
}

function buildMessages(coupons: ActiveCoupon[]): string[] {
  if (coupons.length === 0) {
    return ['🛍️ Free shipping on orders above ₹499 — Shop now!'];
  }
  return coupons.map((c) => {
    const expiry = new Date(c.validTo).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `Get ${c.discount}% off on orders above ₹${c.minimumPurchase} — Use code ${c.code} (valid until ${expiry})`;
  });
}

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/coupons/active')
      .then((res) => res.json())
      .then((json) => {
        const coupons: ActiveCoupon[] = json.data || [];
        setMessages(buildMessages(coupons));
      })
      .catch(() => {
        setMessages(buildMessages([]));
      });
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-primary text-primary-foreground relative flex min-h-10 items-center justify-center px-10 py-2.5',
      )}
    >
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        {messages.length > 0 ? (
          <Typewriter
            options={{
              strings: messages,
              autoStart: true,
              loop: true,
              delay: 40,
              deleteSpeed: 20,
            }}
          />
        ) : (
          <span className="opacity-0">.</span>
        )}
        <Link href="/shop" className="shrink-0 underline underline-offset-4 hover:no-underline">
          Shop Now
        </Link>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="hover:bg-primary-foreground/10 absolute right-2"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
