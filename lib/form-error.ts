import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export type FieldErrors<T> = Partial<Record<keyof T, string[]>>;

export class ValidationError<T> extends Error {
  fieldErrors: FieldErrors<T>;

  constructor(message: string, fieldErrors: FieldErrors<T>) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export function handleFormError<T extends FieldValues>(error: Error, form: UseFormReturn<T>): void {
  if (error instanceof ValidationError) {
    Object.entries(error.fieldErrors).forEach(([field, messages]) => {
      form.setError(field as Path<T>, {
        type: 'server',
        message: (messages as string[])[0],
      });
    });
  } else {
    toast.error(error.message);
  }
}
