'use client';

import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSubscribeNewsletter } from '@/features/app/hooks/use-subscribe-newsletter';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    subscribe(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setEmail('');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex flex-col gap-6 py-8 sm:py-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
                <Mail className="text-primary size-6" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">Stay in the Loop</h2>
              <p className="text-muted-foreground mx-auto max-w-xl">
                Be the first to know about new arrivals, exclusive deals, and style tips. No spam —
                just the good stuff, delivered weekly.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                className="h-11 flex-1"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
              />
              <Button type="submit" className="h-11 cursor-pointer px-6" disabled={isPending}>
                {isPending ? (
                  'Subscribing…'
                ) : (
                  <>
                    Subscribe <Send className="ml-1 size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-muted-foreground text-center text-xs">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
