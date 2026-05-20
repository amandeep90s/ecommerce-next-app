import mongoose from 'mongoose';

import { connectToDatabase } from '@/config/database';
import Category from '@/models/category.model';
import User from '@/models/user.model';

import { categoriesData } from './data/categories';
import { usersData } from './data/users';

const args = process.argv.slice(2);
const shouldFresh = args.includes('--fresh');

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

async function main(): Promise<void> {
  console.log('\n🌱 Starting database seeder...');
  if (shouldFresh) {
    console.log('  ⚠  --fresh flag detected: existing data will be cleared.\n');
  }

  try {
    await connectToDatabase();
    console.log('  ✓ Connected to database\n');

    console.log('👤 Seeding users...');
    await seedUsers();

    console.log('\n📦 Seeding categories...');
    await seedCategories();

    console.log('\n✅ Seeding complete.\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
