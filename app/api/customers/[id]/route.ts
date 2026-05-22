import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Address from '@/models/address.model';
import User from '@/models/user.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const customer = await User.findOne({ _id: id, role: ERole.USER }).select(
      '-password -refresh_token -__v',
    );

    if (!customer) {
      return errorResponse({
        message: 'Customer not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const addresses = await Address.find({ user: id, deletedAt: null });

    return successResponse({
      message: 'Customer fetched successfully',
      data: { ...customer.toJSON(), addresses },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch customer',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const customer = await User.findOneAndUpdate(
      { _id: id, role: ERole.USER },
      { deleteAt: new Date() },
      { returnDocument: 'after' },
    ).select('-password -refresh_token -__v');

    if (!customer) {
      return errorResponse({
        message: 'Customer not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Customer moved to trash',
      data: customer,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete customer',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
