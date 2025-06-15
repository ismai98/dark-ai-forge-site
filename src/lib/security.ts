
// Security utility functions for input validation and sanitization
import DOMPurify from 'dompurify';

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential XSS patterns
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
    
  return DOMPurify.sanitize(sanitized);
};

// HTML content sanitization
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// URL validation
export const validateUrl = (url: string): boolean => {
  if (!url) return true; // Optional URLs are valid
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// File validation
export const validateFile = (file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Ungültiger Dateityp' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `Datei ist zu groß. Maximum: ${maxSize / 1024 / 1024}MB` };
  }
  
  return { valid: true };
};

// Content length validation
export const validateLength = (content: string, min: number, max: number): boolean => {
  const length = content.trim().length;
  return length >= min && length <= max;
};

// SQL injection pattern detection
export const detectSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\b(OR|AND)\b.*=.*)/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// Rate limiting helper
export const createRateLimit = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Clean old requests
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true;
  };
};

// Security headers helper
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
});
