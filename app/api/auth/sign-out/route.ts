import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import User from '@/models/user.model';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      // Best-effort: remove the refresh token from the DB.
      // Ignore DB errors so the client cookies are always cleared.
      try {
        await connectToDatabase();
        await User.updateOne({ refresh_token: refreshToken }, { $unset: { refresh_token: '' } });
      } catch {
        // non-critical — proceed with clearing cookies
      }
    }

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return successResponse({
      message: 'Signed out successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
