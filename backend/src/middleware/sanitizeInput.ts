import { NextFunction, Request, Response } from 'express';

const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const SCRIPT_TAG_REGEX = /<\s*\/?\s*script\b[^>]*>/gi;
const JAVASCRIPT_PROTOCOL_REGEX = /javascript:/gi;

function sanitizeString(value: string): string {
  return value
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(SCRIPT_TAG_REGEX, '')
    .replace(JAVASCRIPT_PROTOCOL_REGEX, '')
    .trim();
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      output[key] = sanitizeValue(nestedValue);
    }

    return output;
  }

  return value;
}

export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  req.body = sanitizeValue(req.body) as Request['body'];
  req.query = sanitizeValue(req.query) as Request['query'];
  req.params = sanitizeValue(req.params) as Request['params'];

  next();
}
