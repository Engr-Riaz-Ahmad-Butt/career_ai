import { env } from '@/config/env';

const BYTES_PER_MB = 1024 * 1024;

function parseMimeList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const avatarMimeTypes = parseMimeList(env.UPLOAD_AVATAR_ALLOWED_MIME_TYPES);
const resumeMimeTypes = parseMimeList(env.UPLOAD_RESUME_ALLOWED_MIME_TYPES);

export const FILE_UPLOAD = {
  AVATAR: {
    DIRECTORY: env.UPLOAD_AVATAR_DIR,
    URL_PREFIX: env.UPLOAD_AVATAR_URL_PREFIX,
    MAX_FILE_SIZE_BYTES: Math.round(env.UPLOAD_AVATAR_MAX_MB * BYTES_PER_MB),
    ALLOWED_MIME_TYPES: avatarMimeTypes,
  },
  RESUME: {
    DIRECTORY: env.UPLOAD_RESUME_DIR,
    MAX_FILE_SIZE_BYTES: Math.round(env.UPLOAD_RESUME_MAX_MB * BYTES_PER_MB),
    ALLOWED_MIME_TYPES: resumeMimeTypes,
  },
  MIME_TYPES: {
    PDF: 'application/pdf',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
} as const;
