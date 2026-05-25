import { HomeCategories } from '@/features/app/components/categories';
import { Hero } from '@/features/app/components/hero';
import { Newsletter } from '@/features/app/components/newsletter';
import { Testimonials } from '@/features/app/components/testimonials';

import { BestDeals } from '../components/best-deals';
import { PopularProducts } from '../components/popular-products';

export function HomeView() {
  return (
    <>
      <Hero />
      <HomeCategories />
      <PopularProducts />
      <BestDeals />
      <Testimonials />
      <Newsletter />
    </>
  );
}
