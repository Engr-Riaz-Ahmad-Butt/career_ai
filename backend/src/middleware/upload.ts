import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// ── Disk storage (local fallback) ──────────────────────────────────────────

const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/avatars/'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${Date.now()}${ext}`);
    },
});

const resumeStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/resumes/'),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume-${Date.now()}${ext}`);
    },
});

// ── File filters ─────────────────────────────────────────────────────────

const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'));
    }
};

const documentFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOCX files are allowed'));
    }
};

// ── Multer instances ─────────────────────────────────────────────────────

export const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: imageFilter,
});

export const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: documentFilter,
});
