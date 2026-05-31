import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Wishlist from '@/models/wishlist.model';

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const wishlist = await Wishlist.findOne({ userId: auth.user.id }).populate({
      path: 'products.productId',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'media', select: 'path alt' },
      ],
    });

    return successResponse({
      message: 'Wishlist fetched successfully',
      data: wishlist?.products ?? [],
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch wishlist',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { productId } = await request.json();

    if (!productId) {
      return errorResponse({
        message: 'Product ID is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    // Upsert wishlist: add product if not already present
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: auth.user.id },
      { $addToSet: { products: { productId } } },
      { upsert: true, new: true },
    ).populate({
      path: 'products.productId',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'media', select: 'path alt' },
      ],
    });

    return successResponse({
      message: 'Product added to wishlist',
      data: wishlist.products,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to add to wishlist',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return errorResponse({
        message: 'Product ID is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: auth.user.id },
      { $pull: { products: { productId } } },
      { new: true },
    ).populate({
      path: 'products.productId',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'media', select: 'path alt' },
      ],
    });

    return successResponse({
      message: 'Product removed from wishlist',
      data: wishlist?.products ?? [],
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to remove from wishlist',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
