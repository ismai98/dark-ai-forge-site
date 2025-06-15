
import { useState, useCallback } from 'react';
import { sanitizeInput, validateEmail, detectSqlInjection, validateLength } from '@/lib/security';

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
    url?: boolean;
    noSqlInjection?: boolean;
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

    const stringValue = value?.toString() || '';

    // Required validation
    if (rules.required && !stringValue.trim()) {
      return 'Dieses Feld ist erforderlich';
    }

    // Skip other validations if field is empty and not required
    if (!stringValue.trim() && !rules.required) {
      return null;
    }

    // SQL injection detection
    if (rules.noSqlInjection !== false && detectSqlInjection(stringValue)) {
      return 'Ungültige Zeichen erkannt';
    }

    // Email validation
    if (rules.email && !validateEmail(stringValue)) {
      return 'Ungültige E-Mail-Adresse';
    }

    // Length validation
    if (rules.minLength && !validateLength(stringValue, rules.minLength, Infinity)) {
      return `Mindestens ${rules.minLength} Zeichen erforderlich`;
    }

    if (rules.maxLength && !validateLength(stringValue, 0, rules.maxLength)) {
      return `Maximal ${rules.maxLength} Zeichen erlaubt`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      return 'Ungültiges Format';
    }

    // URL validation
    if (rules.url) {
      try {
        new URL(stringValue);
      } catch {
        return 'Ungültige URL';
      }
    }

    return null;
  }, [validationRules]);

  const updateField = useCallback((key: keyof T, value: any) => {
    // Sanitize string inputs
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

  const secureSubmit = useCallback(async (
    submitFn: (data: T) => Promise<void>
  ) => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await submitFn(data);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validateForm]);

  return {
    data,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateForm,
    reset,
    secureSubmit
  };
};
