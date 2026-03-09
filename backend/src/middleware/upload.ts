import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { NextFunction, Request, Response } from 'express';
import { FILE_UPLOAD } from '@/constants/fileUpload';
import { ValidationError } from '@/utils/errorHandler';

// ── Disk storage (local fallback) ──────────────────────────────────────────

const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, FILE_UPLOAD.AVATAR.DIRECTORY),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${Date.now()}${ext}`);
    },
});

const resumeMemoryStorage = multer.memoryStorage();

// ── File filters ─────────────────────────────────────────────────────────

const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = FILE_UPLOAD.AVATAR.ALLOWED_MIME_TYPES;
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'));
    }
};

const documentFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = FILE_UPLOAD.RESUME.ALLOWED_MIME_TYPES;
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'));
    }
};

async function readHeader(file: Express.Multer.File, size = 16): Promise<Buffer> {
    if (file.buffer && file.buffer.length > 0) {
        return file.buffer.subarray(0, size);
    }

    if (file.path) {
        const handle = await fs.open(file.path, 'r');
        try {
            const header = Buffer.alloc(size);
            await handle.read(header, 0, size, 0);
            return header;
        } finally {
            await handle.close();
        }
    }

    throw new ValidationError('Could not inspect uploaded file content');
}

function hasBytes(header: Buffer, bytes: number[], offset = 0): boolean {
    if (header.length < bytes.length + offset) {
        return false;
    }

    return bytes.every((value, index) => header[index + offset] === value);
}

function hasAscii(header: Buffer, value: string, offset = 0): boolean {
    const bytes = Buffer.from(value, 'ascii');
    return hasBytes(header, Array.from(bytes), offset);
}

function matchesMimeSignature(mimeType: string, header: Buffer): boolean {
    switch (mimeType) {
        case 'image/jpeg':
            return hasBytes(header, [0xff, 0xd8, 0xff]);
        case 'image/png':
            return hasBytes(header, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        case 'image/gif':
            return hasAscii(header, 'GIF87a') || hasAscii(header, 'GIF89a');
        case 'image/webp':
            return hasAscii(header, 'RIFF') && hasAscii(header, 'WEBP', 8);
        case 'application/pdf':
            return hasAscii(header, '%PDF-');
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return hasBytes(header, [0x50, 0x4b, 0x03, 0x04]);
        default:
            return false;
    }
}

async function safelyDeleteUploadedFile(file: Express.Multer.File): Promise<void> {
    if (!file.path) {
        return;
    }

    try {
        await fs.unlink(file.path);
    } catch {
        // Best-effort cleanup for rejected uploads.
    }
}

function createMagicBytesValidator(expectedMimeTypes: readonly string[]) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const file = req.file;
        if (!file) {
            next();
            return;
        }

        try {
            if (!expectedMimeTypes.includes(file.mimetype)) {
                await safelyDeleteUploadedFile(file);
                next(new ValidationError('Uploaded file type is not allowed'));
                return;
            }

            const header = await readHeader(file);
            const validSignature = matchesMimeSignature(file.mimetype, header);
            if (!validSignature) {
                await safelyDeleteUploadedFile(file);
                next(new ValidationError('File content does not match declared MIME type'));
                return;
            }

            next();
        } catch (error) {
            await safelyDeleteUploadedFile(file);
            next(error);
        }
    };
}

// ── Multer instances ─────────────────────────────────────────────────────

export const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: FILE_UPLOAD.AVATAR.MAX_FILE_SIZE_BYTES },
    fileFilter: imageFilter,
});

export const uploadResume = multer({
    storage: resumeMemoryStorage,
    limits: { fileSize: FILE_UPLOAD.RESUME.MAX_FILE_SIZE_BYTES },
    fileFilter: documentFilter,
});

export const validateAvatarMagicBytes = createMagicBytesValidator(FILE_UPLOAD.AVATAR.ALLOWED_MIME_TYPES);
export const validateResumeMagicBytes = createMagicBytesValidator(FILE_UPLOAD.RESUME.ALLOWED_MIME_TYPES);
