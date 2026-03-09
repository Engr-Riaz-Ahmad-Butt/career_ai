type LogMeta = Record<string, unknown> | undefined;

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'set-cookie',
  'secret',
  'apiKey',
  'api_key',
  'smtp_pass',
  'email_pass',
]);

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase();
  if (SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(normalized)) {
    return true;
  }

  return (
    normalized.includes('password') ||
    normalized.includes('token') ||
    normalized.includes('secret') ||
    normalized.includes('authorization') ||
    normalized.includes('cookie')
  );
}

function sanitizeError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { error: error as unknown };
  }

  return {
    name: error.name,
    message: error.message,
  };
}

function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 6) {
    return '[TRUNCATED]';
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, depth + 1));
  }

  if (value instanceof Error) {
    return sanitizeError(value);
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      output[key] = isSensitiveKey(key) ? '[REDACTED]' : redactValue(nestedValue, depth + 1);
    }

    return output;
  }

  return value;
}

function write(level: 'log' | 'warn' | 'error', message: string, meta?: LogMeta): void {
  const safeMeta = meta ? (redactValue(meta) as Record<string, unknown>) : undefined;
  if (safeMeta) {
    console[level](message, safeMeta);
    return;
  }

  console[level](message);
}

export const logger = {
  info: (message: string, meta?: LogMeta) => write('log', message, meta),
  warn: (message: string, meta?: LogMeta) => write('warn', message, meta),
  error: (message: string, meta?: LogMeta) => write('error', message, meta),
};
