'use client';

import { useState, useCallback } from 'react';
import type { StoreFormData, StoreFormErrors } from '@/shared/types';
import { validateStoreForm, hasFormErrors } from '../utils/store.utils';

const DEFAULT_FORM_DATA: StoreFormData = {
  name: '',
  location: '',
  manager: '',
  assignedCategories: [],
  status: 'active',
};

/**
 * Manages form state and validation for create/edit store forms.
 */
export function useStoreForm(initialData?: Partial<StoreFormData>) {
  const [formData, setFormData] = useState<StoreFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<StoreFormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((field: keyof StoreFormData, value: StoreFormData[keyof StoreFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear field error on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof StoreFormErrors];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors = validateStoreForm(formData);
    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({ ...DEFAULT_FORM_DATA, ...initialData });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isDirty,
    isValid: !hasFormErrors(errors),
    onChange: handleChange,
    validate,
    reset,
  };
}
