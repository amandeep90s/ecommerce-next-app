import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Address from '@/models/address.model';

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const addresses = await Address.find({
      user: auth.user.id,
      deletedAt: null,
    }).sort({ is_default: -1, createdAt: -1 });

    return successResponse({
      message: 'Addresses fetched successfully',
      data: addresses,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch addresses',
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

    const body = await request.json();
    const { name, phone, address_line1, address_line2, city, state, postal_code, country, type } =
      body;

    // If this will be set as default, unset any existing default
    if (body.is_default) {
      await Address.updateMany({ user: auth.user.id, deletedAt: null }, { is_default: false });
    }

    // If no address exists yet, make this one default
    const existingCount = await Address.countDocuments({ user: auth.user.id, deletedAt: null });
    const isDefault = existingCount === 0 ? true : (body.is_default ?? false);

    const address = await Address.create({
      user: auth.user.id,
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      type,
      is_default: isDefault,
    });

    return successResponse({
      message: 'Address created successfully',
      data: address,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create address',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
