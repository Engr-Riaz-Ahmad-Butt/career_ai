import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Resume templates — public with optional auth
router.get('/resume', optionalAuth, (_req, res) => {
    res.json({
        success: true,
        data: {
            templates: [
                { id: 'classic', name: 'Classic', category: 'traditional', previewUrl: '/templates/classic.png', isPro: false },
                { id: 'modern', name: 'Modern', category: 'contemporary', previewUrl: '/templates/modern.png', isPro: false },
                { id: 'creative', name: 'Creative', category: 'design', previewUrl: '/templates/creative.png', isPro: true },
                { id: 'executive', name: 'Executive', category: 'professional', previewUrl: '/templates/executive.png', isPro: true },
                { id: 'academic', name: 'Academic', category: 'academic', previewUrl: '/templates/academic.png', isPro: false },
            ],
        },
    });
});

router.get('/resume/:id', optionalAuth, (req, res) => {
    const templates: Record<string, any> = {
        classic: { id: 'classic', name: 'Classic', previewHtml: '<div>Classic Template</div>', requiredFields: ['personalInfo', 'experience', 'education'] },
        modern: { id: 'modern', name: 'Modern', previewHtml: '<div>Modern Template</div>', requiredFields: ['personalInfo', 'summary', 'experience', 'skills'] },
        creative: { id: 'creative', name: 'Creative', previewHtml: '<div>Creative Template</div>', requiredFields: ['personalInfo', 'summary', 'skills', 'projects'] },
        executive: { id: 'executive', name: 'Executive', previewHtml: '<div>Executive Template</div>', requiredFields: ['personalInfo', 'summary', 'experience'] },
        academic: { id: 'academic', name: 'Academic', previewHtml: '<div>Academic Template</div>', requiredFields: ['personalInfo', 'education', 'experience', 'certifications'] },
    };

    const template = templates[req.params.id];
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: { template } });
});

router.get('/documents', optionalAuth, (_req, res) => {
    res.json({
        success: true,
        data: {
            styles: [
                { id: 'professional', name: 'Professional', forTypes: ['COVER_LETTER', 'SOP', 'MOTIVATION_LETTER'] },
                { id: 'academic', name: 'Academic', forTypes: ['SOP', 'STUDY_PLAN', 'SCHOLARSHIP'] },
                { id: 'modern', name: 'Modern', forTypes: ['BIO', 'COVER_LETTER'] },
                { id: 'minimal', name: 'Minimal', forTypes: ['COVER_LETTER', 'BIO', 'RESIGNATION_LETTER'] },
            ],
        },
    });
});

export default router;
