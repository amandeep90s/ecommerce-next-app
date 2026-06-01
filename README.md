# E-Store — Full-Stack E-Commerce Application

A feature-rich e-commerce platform built with **Next.js 16**, **MongoDB**, **Stripe**, and **Cloudinary**. It includes a public storefront, customer portal, and a full admin dashboard.

---

## Features

### Storefront (Public)

- Product listing with search, filtering, and sorting
- Product collections, featured & trending sections
- Shopping cart with persistent state (Redux + redux-persist)
- Checkout with Stripe payment integration
- Coupon / discount code support
- Product reviews
- Contact, FAQ, Support, and policy pages (Privacy, Refund, Shipping, Terms)

### Customer Portal

- Authentication — sign-up, sign-in, email verification, forgot/reset password (OTP via email)
- Dashboard with order history and account overview
- Manage saved addresses
- Wishlist management
- Profile and password settings

### Admin Dashboard

- Product & product-variant management with rich-text descriptions (Tiptap editor)
- Category management
- Order management and status updates
- Customer management
- Coupon / discount management
- Media library (Cloudinary)
- Newsletter subscriber list
- Support ticket management
- Review moderation
- Site settings
- Analytics overview

---

## Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | Next.js 16 (App Router)              |
| Language      | TypeScript                           |
| Database      | MongoDB (Mongoose)                   |
| Auth          | JWT (jose), bcryptjs                 |
| Payments      | Stripe (Checkout + Webhooks)         |
| Media         | Cloudinary / next-cloudinary         |
| Email         | Nodemailer                           |
| UI            | Tailwind CSS v4, shadcn/ui, Radix UI |
| State         | Redux Toolkit + redux-persist        |
| Data fetching | TanStack Query v5                    |
| Forms         | React Hook Form + Zod                |
| Rich text     | Tiptap                               |
| Tables        | TanStack Table                       |

---

## Prerequisites

- Node.js ≥ 20 or Bun ≥ 1
- MongoDB instance (local or Atlas)
- Cloudinary account
- Stripe account
- SMTP email service

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd ecommerce-next-app
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Configure environment variables

Copy the example file and fill in all values:

```bash
cp env.local.example .env.local
```

| Variable                             | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| `NODE_ENV`                           | `development` or `production`                      |
| `MONGO_URI`                          | MongoDB connection string                          |
| `DB_NAME`                            | Database name                                      |
| `SECRET_KEY`                         | JWT secret key                                     |
| `EMAIL_SERVICE`                      | Email provider (e.g. `gmail`)                      |
| `EMAIL_USER`                         | SMTP username / email address                      |
| `EMAIL_PASSWORD`                     | SMTP password or app password                      |
| `EMAIL_FROM`                         | Sender display address                             |
| `EMAIL_HOST`                         | SMTP host                                          |
| `EMAIL_PORT`                         | SMTP port                                          |
| `NEXT_PUBLIC_APP_BASE_URL`           | Base URL of the app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME`               | App name displayed in the UI                       |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name                              |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`     | Cloudinary API key                                 |
| `CLOUDINARY_API_SECRET`              | Cloudinary API secret                              |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                             |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                                  |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret                      |

### 4. Seed the database (optional)

```bash
# Seed with sample data
bun run seed

# Seed fresh (clears existing data first)
bun run seed:fresh
```

### 5. Start the development server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
Admin dashboard is available at [http://localhost:3000/admin](http://localhost:3000/admin).

### 6. Stripe webhook (local development)

Forward Stripe events to your local server:

```bash
bun run stripe:webhook:listen
```

---

## Available Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `dev`                   | Start the development server         |
| `build`                 | Build for production                 |
| `start`                 | Start the production server          |
| `seed`                  | Seed the database with sample data   |
| `seed:fresh`            | Clear and re-seed the database       |
| `lint`                  | Run ESLint                           |
| `lint:fix`              | Run ESLint and auto-fix issues       |
| `format`                | Format code with Prettier            |
| `format:check`          | Check formatting without writing     |
| `stripe:webhook:listen` | Forward Stripe webhooks to localhost |

---

## Project Structure

```
app/
  (admin)/admin/        # Admin dashboard pages
  (auth)/               # Auth pages (sign-in, sign-up, etc.)
  (customer)/           # Customer portal pages
  (public)/             # Public storefront pages
  api/                  # API route handlers
components/             # Shared UI components
config/                 # Service configurations (DB, Stripe, Cloudinary)
email/                  # Email templates
features/               # Feature-based slices (admin, auth, customer, app)
lib/                    # Utility helpers and server-side logic
models/                 # Mongoose models
store/                  # Redux store and providers
types/                  # TypeScript type definitions
seeders/                # Database seed scripts
```
