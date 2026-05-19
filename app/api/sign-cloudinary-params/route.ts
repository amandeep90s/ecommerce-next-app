import cloudinary from '@/config/cloudinary';
import { CLOUDINARY_API_SECRET } from '@/config/env';
import { ERole } from '@/enums';
import { requireAuth } from '@/lib/require-auth';

export async function POST(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    CLOUDINARY_API_SECRET as string,
  );

  return Response.json({ signature });
}
