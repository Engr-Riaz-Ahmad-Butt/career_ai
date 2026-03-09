import { Router } from 'express';
import {
    getMe,
    updateMe,
    deleteMe,
    changePassword,
    uploadAvatar,
    getCredits,
    getUsage,
    getReferrals,
} from '@/controllers/user.controller';
import { authenticate } from '@/middleware/auth';
import { uploadAvatar as avatarUpload, validateAvatarMagicBytes } from '@/middleware/upload';
import { validate } from '@/middleware/validate';
import { userUpdateProfileSchema, userChangePasswordSchema } from '@/utils/validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/me', getMe);
router.put('/me', validate(userUpdateProfileSchema), updateMe);
router.delete('/me', deleteMe);
router.put('/me/password', validate(userChangePasswordSchema), changePassword);
router.post('/me/avatar', avatarUpload.single('file'), validateAvatarMagicBytes, uploadAvatar);
router.get('/me/credits', getCredits);
router.get('/me/usage', getUsage);
router.get('/me/referrals', getReferrals);

export default router;

