import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { ValidationError } from '@/lib/form-error';
import { IUploadMediaPayload, IUploadMediaResponse } from '@/types';

async function uploadMedia(data: IUploadMediaPayload): Promise<IUploadMediaResponse> {
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<IUploadMediaPayload>(result.message, result.errors);
    }
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,
  });
}
