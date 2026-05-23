import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import slugify from 'slugify';

import { connectToDatabase } from '@/config/database';
import { EProductVariantSize, ERole } from '@/enums';
import Category from '@/models/category.model';
import Coupon from '@/models/coupon.model';
import Media from '@/models/media.model';
import Product from '@/models/product.model';
import ProductVariant from '@/models/product-variant.model';
import Review from '@/models/review.model';
import User from '@/models/user.model';

import { categoriesData } from './data/categories';
import { usersData } from './data/users';

const args = process.argv.slice(2);
const shouldFresh = args.includes('--fresh');

function getRandomItems<T>(array: T[], count = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function generateSlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

// ─── Seed Users ─────────────────────────────────────────────
async function seedUsers(): Promise<void> {
  if (shouldFresh) {
    await User.deleteMany({});
    console.log('  ✓ Cleared users collection');
  }

  let inserted = 0;
  for (const data of usersData) {
    const exists = await User.findOne({ email: data.email });
    if (exists) {
      console.log(`  · Skipped user: ${data.email} (already exists)`);
      continue;
    }
    await User.create(data);
    console.log(`  ✓ Created user: ${data.email} [${data.role}]`);
    inserted++;
  }

  if (inserted === 0 && !shouldFresh) {
    console.log('  · All users already seeded. Use --fresh to reseed.');
  }
}

// ─── Seed Categories ────────────────────────────────────────
async function seedCategories(): Promise<void> {
  if (shouldFresh) {
    await Category.deleteMany({});
    console.log('  ✓ Cleared categories collection');
  }

  let inserted = 0;
  for (const data of categoriesData) {
    const exists = await Category.findOne({ slug: data.slug });
    if (exists) {
      console.log(`  · Skipped category: ${data.name} (already exists)`);
      continue;
    }
    await Category.create(data);
    console.log(`  ✓ Created category: ${data.name}`);
    inserted++;
  }

  if (inserted === 0 && !shouldFresh) {
    console.log('  · All categories already seeded. Use --fresh to reseed.');
  }
}

// ─── Seed Customers ─────────────────────────────────────────
async function seedCustomers(): Promise<mongoose.Types.ObjectId[]> {
  if (shouldFresh) {
    await User.deleteMany({ role: ERole.USER });
    console.log('  ✓ Cleared customer users');
  }

  const customerIds: mongoose.Types.ObjectId[] = [];
  const existingCustomers = await User.find({ role: ERole.USER });

  if (existingCustomers.length >= 10 && !shouldFresh) {
    console.log('  · 10 customers already exist. Use --fresh to reseed.');
    return existingCustomers.map((c) => c._id as mongoose.Types.ObjectId);
  }

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) {
      customerIds.push(exists._id as mongoose.Types.ObjectId);
      console.log(`  · Skipped customer: ${email} (already exists)`);
      continue;
    }

    const customer = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: 'Customer@1234',
      role: ERole.USER,
      is_email_verified: true,
      phone: faker.phone.number({ style: 'international' }),
    });
    customerIds.push(customer._id as mongoose.Types.ObjectId);
    console.log(`  ✓ Created customer: ${email}`);
  }

  return customerIds;
}

// ─── Seed Coupons ───────────────────────────────────────────
async function seedCoupons(): Promise<void> {
  if (shouldFresh) {
    await Coupon.deleteMany({});
    console.log('  ✓ Cleared coupons collection');
  }

  const existingCount = await Coupon.countDocuments();
  if (existingCount > 0 && !shouldFresh) {
    console.log('  · Coupons already exist. Use --fresh to reseed.');
    return;
  }

  const now = new Date();
  const future = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const past = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const coupons = [
    // Active coupons
    {
      code: 'WELCOME10',
      discount: 10,
      minimumPurchase: 499,
      validFrom: past(1),
      validTo: future(90),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'SAVE20',
      discount: 20,
      minimumPurchase: 999,
      validFrom: past(1),
      validTo: future(60),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'FLAT15',
      discount: 15,
      minimumPurchase: 799,
      validFrom: past(1),
      validTo: future(45),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'SUMMER25',
      discount: 25,
      minimumPurchase: 1499,
      validFrom: past(1),
      validTo: future(30),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'MEGA30',
      discount: 30,
      minimumPurchase: 1999,
      validFrom: past(1),
      validTo: future(15),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'ETHNIC40',
      discount: 40,
      minimumPurchase: 2499,
      validFrom: past(1),
      validTo: future(20),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'FIRST5',
      discount: 5,
      minimumPurchase: 299,
      validFrom: past(1),
      validTo: future(120),
      isActive: true,
      deletedAt: null,
    },
    {
      code: 'ACTIVE15',
      discount: 15,
      minimumPurchase: 899,
      validFrom: past(1),
      validTo: future(30),
      isActive: true,
      deletedAt: null,
    },
    // Inactive (disabled by admin)
    {
      code: 'FLASH50',
      discount: 50,
      minimumPurchase: 3999,
      validFrom: past(10),
      validTo: future(5),
      isActive: false,
      deletedAt: null,
    },
    {
      code: 'PAYDAY35',
      discount: 35,
      minimumPurchase: 2999,
      validFrom: past(5),
      validTo: future(10),
      isActive: false,
      deletedAt: null,
    },
    // Expired
    {
      code: 'DIWALI20',
      discount: 20,
      minimumPurchase: 999,
      validFrom: past(60),
      validTo: past(1),
      isActive: false,
      deletedAt: null,
    },
    {
      code: 'NEWYEAR15',
      discount: 15,
      minimumPurchase: 799,
      validFrom: past(150),
      validTo: past(30),
      isActive: false,
      deletedAt: null,
    },
  ];

  await Coupon.insertMany(coupons);
  console.log(`  ✓ Created ${coupons.length} coupons`);
}

// ─── Seed Media ─────────────────────────────────────────────
// Creates 30 placeholder media records using picsum.photos so products
// can always be seeded without requiring real Cloudinary uploads.
// ─── Product Catalogue ──────────────────────────────────────
// 13 products per category × 8 categories = 104 products total
const productCatalogue: Record<string, string[]> = {
  'mens-t-shirts': [
    'Classic Crew Neck Tee',
    'Graphic Print T-Shirt',
    'V-Neck Essential Tee',
    'Oversized Streetwear Tee',
    'Striped Polo T-Shirt',
    'Pocket Logo Tee',
    'Plain Slim Fit Tee',
    'Henley Long Sleeve Tee',
    'Vintage Wash T-Shirt',
    'Color Block Tee',
    'Drop Shoulder Tee',
    'Tie-Dye Casual Tee',
    'Rugby Stripe Tee',
  ],
  'mens-shirts': [
    'Oxford Button-Down Shirt',
    'Slim Fit Formal Shirt',
    'Linen Casual Shirt',
    'Checkered Flannel Shirt',
    'Denim Western Shirt',
    'Mandarin Collar Shirt',
    'Chambray Work Shirt',
    'Poplin Short Sleeve Shirt',
    'Seersucker Stripe Shirt',
    'Tropical Printed Shirt',
    'Plaid Overshirt',
    'Classic White Dress Shirt',
    'Tech Performance Shirt',
  ],
  'mens-jeans': [
    'Slim Fit Dark Wash Jeans',
    'Relaxed Straight Jeans',
    'Skinny Black Jeans',
    'Distressed Denim Jeans',
    'Tapered Stretch Jeans',
    'Wide Leg Denim Jeans',
    'Cropped Ankle Jeans',
    'Raw Hem Jeans',
    'Vintage Wash Bootcut Jeans',
    'High Rise Comfort Jeans',
    'Patched Knee Jeans',
    'Acid Wash Jeans',
    'Classic Five Pocket Jeans',
  ],
  'womens-tops': [
    'Floral Blouse',
    'Ribbed Crop Top',
    'Off-Shoulder Top',
    'Satin Camisole',
    'Ruffle Sleeve Blouse',
    'Tie-Front Knot Top',
    'Puff Sleeve Blouse',
    'Racerback Tank Top',
    'Lace Trim Camisole',
    'Peasant Blouse',
    'Halter Neck Top',
    'Shirred Smock Top',
    'Bardot Neckline Top',
  ],
  'womens-dresses': [
    'Floral Maxi Dress',
    'Bodycon Mini Dress',
    'A-Line Midi Dress',
    'Wrap Dress',
    'Shirt Dress',
    'Sundress with Pockets',
    'Lace Overlay Dress',
    'Slip Dress',
    'Tiered Ruffle Dress',
    'Backless Evening Dress',
    'Smocked Waist Dress',
    'Boho Print Maxi Dress',
    'Classic Shift Dress',
  ],
  'jackets-coats': [
    'Leather Biker Jacket',
    'Puffer Winter Jacket',
    'Denim Trucker Jacket',
    'Wool Blend Overcoat',
    'Windbreaker Jacket',
    'Trench Coat',
    'Sherpa Fleece Jacket',
    'Quilted Puffer Vest',
    'Bomber Jacket',
    'Classic Peacoat',
    'Rain Mac Jacket',
    'Faux Fur Coat',
    'Double-Breasted Blazer',
  ],
  activewear: [
    'Performance Running Tee',
    'Yoga Leggings',
    'Training Shorts',
    'Compression Tank Top',
    'Track Jacket',
    'Sports Bra',
    'Cycling Shorts',
    'Running Shorts',
    'Moisture-Wicking Polo',
    'Gym Hoodie',
    'Quick-Dry Leggings',
    'Seamless Workout Set',
    'Reflective Running Jacket',
  ],
  'ethnic-wear': [
    'Embroidered Kurta Set',
    'Silk Saree',
    'Anarkali Suit',
    'Printed Kurta',
    'Palazzo Pants Set',
    'Churidar Suit',
    'Bandhani Dupatta Set',
    'Lehenga Choli',
    'Salwar Kameez',
    'Sherwani Set',
    'Pathani Kurta',
    'Chikankari Embroidered Kurta',
    'Indo-Western Fusion Jacket',
  ],
};

// ─── Seed Products & Variants ───────────────────────────────
async function seedProducts(
  mediaIds: mongoose.Types.ObjectId[],
): Promise<mongoose.Types.ObjectId[]> {
  if (shouldFresh) {
    await Product.deleteMany({});
    await ProductVariant.deleteMany({});
    console.log('  ✓ Cleared products and variants collections');
  }

  const existingProducts = await Product.find();
  if (existingProducts.length > 0 && !shouldFresh) {
    console.log('  · Products already exist. Use --fresh to reseed.');
    return existingProducts.map((p) => p._id as mongoose.Types.ObjectId);
  }

  const categories = await Category.find();
  if (categories.length === 0) {
    console.log('  ✗ No categories found. Skipping products.');
    return [];
  }

  const colors = ['Black', 'White', 'Navy', 'Grey', 'Red', 'Olive', 'Beige', 'Blue'];
  const sizes = Object.values(EProductVariantSize); // XS, S, M, L, XL, XXL

  const allProducts: Array<Record<string, unknown>> = [];
  const allVariants: Array<Record<string, unknown>> = [];

  for (const category of categories) {
    const names = productCatalogue[category.slug] ?? [];

    for (const productName of names) {
      const baseSlug = generateSlug(productName);
      const slug = `${baseSlug}-${faker.string.alphanumeric(4).toLowerCase()}`;
      const price = faker.number.int({ min: 799, max: 4999 });
      const discount = faker.number.int({ min: 5, max: 40 });
      const selling_price = Math.round(price - (price * discount) / 100);
      const productMedia = getRandomItems(mediaIds, faker.number.int({ min: 3, max: 5 }));
      const sku = `PRD-${faker.string.alphanumeric(8).toUpperCase()}`;

      allProducts.push({
        name: productName,
        slug,
        category: category._id,
        price,
        selling_price,
        discount,
        description: faker.commerce.productDescription(),
        media: productMedia,
        sku,
        stock: faker.number.int({ min: 50, max: 500 }),
        isActive: true,
        deletedAt: null,
      });
    }
  }

  const insertedProducts = await Product.insertMany(allProducts);
  console.log(`  ✓ Created ${insertedProducts.length} products`);

  // Create variants using the auto-generated product IDs
  for (const product of insertedProducts) {
    const colors_for_product = ['Black', 'White', 'Navy', 'Grey', 'Red', 'Olive', 'Beige', 'Blue'];
    const variantColors = getRandomItems(colors_for_product, 3);
    const variantSizes = getRandomItems(sizes, 4);
    const discount = product.discount as number;
    const price = product.price as number;

    for (const color of variantColors) {
      for (const size of variantSizes) {
        const variantPrice = faker.number.int({
          min: Math.max(299, price - 200),
          max: price + 300,
        });
        const variantSellingPrice = Math.round(variantPrice - (variantPrice * discount) / 100);
        const variantMedia = getRandomItems(mediaIds, faker.number.int({ min: 2, max: 4 }));
        const colorSlug = color.toLowerCase().replace(/\s+/g, '-');

        allVariants.push({
          product: product._id,
          color,
          size,
          price: variantPrice,
          selling_price: variantSellingPrice,
          discount,
          sku: `VAR-${faker.string.alphanumeric(8).toUpperCase()}-${colorSlug}-${size}`,
          media: variantMedia,
          stock: faker.number.int({ min: 5, max: 80 }),
          isActive: true,
          deletedAt: null,
        });
      }
    }
  }

  await ProductVariant.insertMany(allVariants);
  console.log(`  ✓ Created ${allVariants.length} variants`);

  return insertedProducts.map((p) => p._id as mongoose.Types.ObjectId);
}

// ─── Seed Reviews ───────────────────────────────────────────
async function seedReviews(
  productIds: mongoose.Types.ObjectId[],
  customerIds: mongoose.Types.ObjectId[],
): Promise<void> {
  if (shouldFresh) {
    await Review.deleteMany({});
    console.log('  ✓ Cleared reviews collection');
  }

  const existingReviews = await Review.countDocuments();
  if (existingReviews > 0 && !shouldFresh) {
    console.log('  · Reviews already exist. Use --fresh to reseed.');
    return;
  }

  if (productIds.length === 0 || customerIds.length === 0) {
    console.log('  ✗ No products or customers to create reviews for.');
    return;
  }

  const reviewTitles = [
    'Excellent quality!',
    'Great value for money',
    'Fits perfectly',
    'Love the fabric',
    'Comfortable and stylish',
    'Exceeded expectations',
    'Good but could be better',
    'Average quality',
    'Not as expected',
    'Decent purchase',
    'Would buy again',
    'Perfect for daily wear',
    'Nice color and design',
    'Very soft material',
    'Highly recommend',
    'Absolutely love it',
    'Great product overall',
    'Satisfied with purchase',
    'Good stitching quality',
    'Better than expected',
  ];

  const allReviews: Array<Record<string, unknown>> = [];

  // Each customer reviews 8–15 random products
  for (const customerId of customerIds) {
    const reviewCount = faker.number.int({ min: 8, max: Math.min(15, productIds.length) });
    const productsToReview = getRandomItems(productIds, reviewCount);

    for (const productId of productsToReview) {
      allReviews.push({
        product: productId,
        user: customerId,
        rating: faker.number.int({ min: 2, max: 5 }),
        title: faker.helpers.arrayElement(reviewTitles),
        comment: faker.lorem.sentences({ min: 1, max: 3 }),
        deletedAt: null,
      });
    }
  }

  // Deduplicate: Review schema has unique index on { product, user }
  const seen = new Set<string>();
  const uniqueReviews = allReviews.filter((r) => {
    const key = `${r.user}-${r.product}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  await Review.insertMany(uniqueReviews);
  console.log(`  ✓ Created ${uniqueReviews.length} reviews`);
}

// ─── Main ───────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('\n🌱 Starting database seeder...');
  if (shouldFresh) {
    console.log('  ⚠  --fresh flag detected: existing data will be cleared.\n');
  }

  try {
    await connectToDatabase();
    console.log('  ✓ Connected to database\n');

    console.log('👤 Seeding admin & base users...');
    await seedUsers();

    console.log('\n📦 Seeding categories...');
    await seedCategories();

    console.log('\n👥 Seeding customers...');
    const customerIds = await seedCustomers();

    console.log('\n🎟️  Seeding coupons...');
    await seedCoupons();

    console.log('\n🖼️  Fetching media...');
    const mediaIds = await Media.find({ deletedAt: null }).then((media) =>
      media.map((m) => m._id as mongoose.Types.ObjectId),
    );
    console.log(`  ✓ Fetched ${mediaIds.length} media records`);

    console.log('\n🛍️  Seeding products & variants...');
    const productIds = await seedProducts(mediaIds);

    console.log('\n⭐ Seeding reviews...');
    await seedReviews(productIds, customerIds);

    console.log('\n✅ Seeding complete.\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
