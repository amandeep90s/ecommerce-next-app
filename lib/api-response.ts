import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

interface FormattedError {
  message: string;
  errors?: unknown;
  stack?: string;
}

function isMongoDBError(error: unknown): boolean {
  if (error instanceof Error) {
    const name = (error as Error & Record<string, unknown>).name;
    return (
      name === 'MongoError' ||
      name === 'MongoServerError' ||
      name === 'ValidationError' ||
      name === 'CastError' ||
      name === 'DuplicateKeyError'
    );
  }
  return false;
}

function formatErrors(errors: unknown): FormattedError {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle Zod errors
  if (errors instanceof z.ZodError) {
    return {
      message: 'Validation error',
      errors: z.flattenError(errors).fieldErrors,
    };
  }

  // Handle MongoDB errors
  if (isMongoDBError(errors)) {
    const error = errors as Error & Record<string, unknown>;
    if (isDevelopment) {
      return {
        message: error.message || 'Database error',
        errors: {
          name: error.name,
          code: error.code,
          keyPattern: error.keyPattern,
          keyValue: error.keyValue,
        },
        stack: error.stack,
      };
    }
    return {
      message: 'Database error occurred',
    };
  }

  // Handle generic Error objects
  if (errors instanceof Error) {
    if (isDevelopment) {
      return {
        message: errors.message,
        errors: {
          name: errors.name,
        },
        stack: errors.stack,
      };
    }
    return {
      message: 'An error occurred',
    };
  }

  // Handle plain objects and other errors
  if (isDevelopment) {
    return {
      message: 'Unknown error',
      errors,
    };
  }

  return {
    message: 'An error occurred',
  };
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
  const formattedError = formatErrors(errors);

  const responseBody: Record<string, unknown> = {
    success: false,
    message,
    errors: formattedError.errors || null,
  };

  if (process.env.NODE_ENV === 'development' && formattedError.stack) {
    responseBody.stack = formattedError.stack;
  }

  return NextResponse.json(responseBody, { status: statusCode });
}
