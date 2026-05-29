import {
  AwardIcon,
  HeartIcon,
  LeafIcon,
  PackageIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const stats = [
  { label: 'Happy Customers', value: '50,000+' },
  { label: 'Products', value: '10,000+' },
  { label: 'Countries Served', value: '30+' },
  { label: 'Years in Business', value: '8+' },
];

const values = [
  {
    icon: <ShieldCheckIcon className="size-6" />,
    title: 'Quality First',
    description:
      'Every product in our catalogue is carefully vetted to meet our high standards. We partner only with trusted suppliers who share our commitment to excellence.',
  },
  {
    icon: <TruckIcon className="size-6" />,
    title: 'Fast & Reliable Shipping',
    description:
      "We know you can't wait to receive your order. That's why we offer same-day dispatch on orders placed before 2 PM and free shipping on orders over $50.",
  },
  {
    icon: <HeartIcon className="size-6" />,
    title: 'Customer Obsessed',
    description:
      "Our support team is available 7 days a week. Whether you have a question, need advice, or want to return an item, we're here to make it effortless.",
  },
  {
    icon: <LeafIcon className="size-6" />,
    title: 'Sustainably Minded',
    description:
      "From eco-friendly packaging to our carbon-offset shipping programme, we're working toward a greener future — one order at a time.",
  },
  {
    icon: <SparklesIcon className="size-6" />,
    title: 'Curated Collections',
    description:
      "Our buyers travel the world to discover unique, trend-forward products you won't find anywhere else. New arrivals land every week.",
  },
  {
    icon: <ZapIcon className="size-6" />,
    title: 'Seamless Experience',
    description:
      "From first click to doorstep delivery, we've designed every touchpoint to be smooth, secure, and enjoyable on any device.",
  },
];

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder & CEO',
    bio: 'Former retail executive with 15 years of experience. Sarah founded the company with a vision to make premium products accessible to everyone.',
  },
  {
    name: 'James Okafor',
    role: 'Head of Product',
    bio: 'James curates our catalogue with a meticulous eye for quality and trend. He has sourced products from over 40 countries.',
  },
  {
    name: 'Priya Nair',
    role: 'Chief Technology Officer',
    bio: 'Priya leads our engineering team, building the technology that powers a seamless shopping experience for millions of customers.',
  },
  {
    name: 'Lucas Herrera',
    role: 'Head of Customer Success',
    bio: 'Lucas and his team ensure every customer interaction is exceptional. Under his leadership, our satisfaction score consistently exceeds 98%.',
  },
];

const milestones = [
  { year: '2016', event: 'Founded in a small garage with just 50 products and a big dream.' },
  { year: '2018', event: 'Reached 10,000 customers and launched our mobile app.' },
  { year: '2020', event: 'Expanded internationally, shipping to 20+ countries.' },
  { year: '2022', event: 'Surpassed 1 million orders and launched our sustainability programme.' },
  { year: '2024', event: 'Introduced same-day delivery in 15 major cities.' },
  { year: '2026', event: 'Now serving 50,000+ happy customers across 30+ countries.' },
];

export function AboutView() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Badge variant="secondary" className="w-fit">
                <AwardIcon className="mr-1.5 size-3.5" />
                Trusted since 2016
              </Badge>
              <h1 className="text-4xl leading-tight font-bold text-balance md:text-5xl">
                Shopping reimagined for the modern world
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We started with a simple belief: everyone deserves access to quality products at
                fair prices, delivered with care. Today we&apos;re a team of passionate people
                serving customers across 30+ countries — and we&apos;re just getting started.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="https://placehold.co/800x600/e2e8f0/94a3b8?text=Our+Story"
                alt="Our story"
                width={800}
                height={600}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="flex flex-col gap-1 py-8">
                  <p className="text-4xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Mission ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl lg:order-first">
              <Image
                src="https://placehold.co/800x600/e2e8f0/94a3b8?text=Our+Mission"
                alt="Our mission"
                width={800}
                height={600}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <Badge variant="outline" className="mb-4 w-fit">
                  <PackageIcon className="mr-1.5 size-3.5" />
                  Our Mission
                </Badge>
                <h2 className="mb-4 text-3xl font-bold text-balance">
                  Making great products accessible to all
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to connect people with the products they love — whether it&apos;s
                  everyday essentials or something truly special — at prices that feel fair and with
                  service that feels personal.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We believe commerce should be built on trust. That means honest pricing, transparent
                policies, genuine reviews, and a support team that actually helps. No gimmicks, no
                hidden fees, no fine print surprises.
              </p>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <StarIcon className="size-5 shrink-0 fill-yellow-500 text-yellow-500" />
                <p className="text-sm">
                  <span className="font-semibold">4.9 / 5</span>
                  <span className="text-muted-foreground">
                    {' '}
                    average rating from over 48,000 verified reviews
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 w-fit">
              <HeartIcon className="mr-1.5 size-3.5" />
              What we stand for
            </Badge>
            <h2 className="text-3xl font-bold text-balance">Our core values</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
              These aren&apos;t just words on a wall. They&apos;re the principles that guide every
              decision we make — from the products we carry to the way we respond to a complaint.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="flex flex-col gap-3 pt-6">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 w-fit">
              Our Journey
            </Badge>
            <h2 className="text-3xl font-bold text-balance">How we got here</h2>
          </div>
          <div className="relative flex flex-col gap-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative flex gap-6">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="bg-border my-1 w-px flex-1" />}
                </div>
                <div className="pt-1.5 pb-8">
                  <p className="text-primary mb-1 text-sm font-semibold">{m.year}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4 w-fit">
              <UsersIcon className="mr-1.5 size-3.5" />
              The people behind it
            </Badge>
            <h2 className="text-3xl font-bold text-balance">Meet the team</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
              A small, dedicated group united by a shared passion for great products and even better
              customer experiences.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden pt-0">
                <div className="overflow-hidden">
                  <Image
                    src={`https://placehold.co/400x400/e2e8f0/94a3b8?text=${encodeURIComponent(member.name.split(' ')[0])}`}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <CardContent className="flex flex-col gap-1 pt-4 pb-5">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-primary text-xs font-medium">{member.role}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
