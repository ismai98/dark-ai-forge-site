
import { useState, useCallback } from 'react';
import { sanitizeInput, validateEmail } from '@/lib/security';

interface FormData {
  [key: string]: any;
}

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export const useSecureForm = <T extends FormData>(
  initialData: T,
  validationRules: ValidationRules = {}
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((key: string, value: any): string | null => {
    const rules = validationRules[key];
    if (!rules) return null;

    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Dieses Feld ist erforderlich';
    }

    if (value && rules.email && !validateEmail(value.toString())) {
      return 'Ungültige E-Mail-Adresse';
    }

    if (value && rules.minLength && value.toString().length < rules.minLength) {
      return `Mindestens ${rules.minLength} Zeichen erforderlich`;
    }

    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      return `Maximal ${rules.maxLength} Zeichen erlaubt`;
    }

    if (value && rules.pattern && !rules.pattern.test(value.toString())) {
      return 'Ungültiges Format';
    }

    return null;
  }, [validationRules]);

  const updateField = useCallback((key: keyof T, value: any) => {
    const sanitized = typeof value === 'string' ? sanitizeInput(value) : value;
    
    setData(prev => ({
      ...prev,
      [key]: sanitized
    }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: undefined
      }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const error = validateField(key, data[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, validateField, validationRules]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    data,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateForm,
    reset
  };
};
