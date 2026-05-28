import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Product from '@/models/product.model';

const ALLOWED_SORTS = ['featured', 'newest', 'price-low', 'price-high'] as const;
type SortOption = (typeof ALLOWED_SORTS)[number];

function buildSortQuery(sort: SortOption): Record<string, 1 | -1> {
  switch (sort) {
    case 'newest':
      return { createdAt: -1 };
    case 'price-low':
      return { selling_price: 1 };
    case 'price-high':
      return { selling_price: -1 };
    case 'featured':
    default:
      return { isFeatured: -1, createdAt: -1 };
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(48, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const q = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category') || '';
    const rawSort = searchParams.get('sort') || '';
    const sort: SortOption = ALLOWED_SORTS.includes(rawSort as SortOption)
      ? (rawSort as SortOption)
      : 'featured';
    const priceMin = parseFloat(searchParams.get('priceMin') || '');
    const priceMax = parseFloat(searchParams.get('priceMax') || '');

    const query: Record<string, unknown> = { isActive: true, deletedAt: null };

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (!Number.isNaN(priceMin) || !Number.isNaN(priceMax)) {
      const priceFilter: Record<string, number> = {};
      if (!Number.isNaN(priceMin)) priceFilter.$gte = priceMin;
      if (!Number.isNaN(priceMax)) priceFilter.$lte = priceMax;
      query.selling_price = priceFilter;
    }

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate('category')
        .populate('media')
        .sort(buildSortQuery(sort))
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return successResponse({
      message: 'Products fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch products',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
