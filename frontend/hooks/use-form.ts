/**
 * Generic form state management hook
 * Eliminates repetitive useState patterns for form fields
 */

import { useState, useCallback } from 'react';

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit?: (values: T) => void | Promise<void>;
  validate?: (values: T) => Record<string, string> | null;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (partial: Partial<T>) => void;
  setFieldError: (field: string, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  isDirty: boolean;
}

/**
 * Hook for managing form state with validation
 * 
 * @example
 * const { values, setValue, handleSubmit, errors } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (values) => {
 *     const errors: Record<string, string> = {};
 *     if (!values.email) errors.email = 'Email required';
 *     return Object.keys(errors).length > 0 ? errors : null;
 *   },
 *   onSubmit: async (values) => {
 *     await api.post('/auth/login', values);
 *   }
 * });
 * 
 * <input value={values.email} onChange={(e) => setValue('email', e.target.value)} />
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear field error when value changes
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setMultipleValues = useCallback((partial: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...partial }));
    setIsDirty(true);
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault?.();

      // Validate
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors) {
          setErrors(validationErrors);
          return;
        }
      }

      if (!onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setIsDirty(false);
      } catch (error) {
        // Errors are handled by global error handling
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setValues: setMultipleValues,
    setFieldError,
    clearErrors,
    reset,
    handleSubmit,
    isDirty,
  };
}
