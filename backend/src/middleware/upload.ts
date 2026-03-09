import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FILE_UPLOAD } from '@/constants/fileUpload';

// ── Disk storage (local fallback) ──────────────────────────────────────────

const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, FILE_UPLOAD.AVATAR.DIRECTORY),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${Date.now()}${ext}`);
    },
});

const resumeStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, FILE_UPLOAD.RESUME.DIRECTORY),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume-${Date.now()}${ext}`);
    },
});

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

// ── Multer instances ─────────────────────────────────────────────────────

export const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: FILE_UPLOAD.AVATAR.MAX_FILE_SIZE_BYTES },
    fileFilter: imageFilter,
});

export const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: FILE_UPLOAD.RESUME.MAX_FILE_SIZE_BYTES },
    fileFilter: documentFilter,
});
