import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Address from '@/models/address.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      type,
      is_default,
    } = body;

    const address = await Address.findOne({ _id: id, user: auth.user.id, deletedAt: null });

    if (!address) {
      return errorResponse({
        message: 'Address not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // If marking as default, unset all others first
    if (is_default) {
      await Address.updateMany({ user: auth.user.id, deletedAt: null }, { is_default: false });
    }

    const updated = await Address.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        type,
        is_default,
      },
      { new: true, runValidators: true },
    );

    return successResponse({
      message: 'Address updated successfully',
      data: updated,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update address',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;

    const address = await Address.findOne({ _id: id, user: auth.user.id, deletedAt: null });

    if (!address) {
      return errorResponse({
        message: 'Address not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Unset all others, then set this as default
    await Address.updateMany({ user: auth.user.id, deletedAt: null }, { is_default: false });
    const updated = await Address.findByIdAndUpdate(id, { is_default: true }, { new: true });

    return successResponse({
      message: 'Default address updated successfully',
      data: updated,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to set default address',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;

    const address = await Address.findOne({ _id: id, user: auth.user.id, deletedAt: null });

    if (!address) {
      return errorResponse({
        message: 'Address not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    await Address.findByIdAndUpdate(id, { deletedAt: new Date() });

    // If the deleted address was default, promote the most recent remaining address
    if (address.is_default) {
      const next = await Address.findOne({ user: auth.user.id, deletedAt: null }).sort({
        createdAt: -1,
      });
      if (next) {
        await Address.findByIdAndUpdate(next._id, { is_default: true });
      }
    }

    return successResponse({ message: 'Address deleted successfully' });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete address',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
