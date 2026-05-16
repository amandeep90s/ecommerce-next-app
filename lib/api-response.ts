import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { z, type ZodError } from 'zod';

interface SuccessResponseOptions<T> {
  message: string;
  data?: T;
  statusCode?: number;
}

interface ErrorResponseOptions {
  message: string;
  errors?: unknown;
  statusCode?: number;
}

function formatErrors(errors: unknown) {
  if (errors instanceof z.ZodError) {
    return z.flattenError(errors).fieldErrors;
  }
  return errors;
}

export function successResponse<T>({
  message,
  data,
  statusCode = StatusCodes.OK,
}: SuccessResponseOptions<T>) {
  return NextResponse.json(
    {
      success: true,
      message,
      data: data ?? null,
    },
    { status: statusCode },
  );
}

export function errorResponse({
  message,
  errors,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
}: ErrorResponseOptions) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors: formatErrors(errors),
    },
    { status: statusCode },
  );
}
