import cloudinary from '@/config/cloudinary';
import { CLOUDINARY_API_SECRET } from '@/config/env';

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    CLOUDINARY_API_SECRET as string,
  );

  return Response.json({ signature });
}
