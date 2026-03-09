import { Router } from 'express';
import { authenticate, requireCreditsForAction } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { generatePortfolioSchema, updatePortfolioSchema } from '@/utils/validation';
import {
    deletePortfolio,
    deployPortfolio,
    generatePortfolio,
    getPortfolio,
    listPortfolios,
    updatePortfolio,
} from '@/features/portfolio/portfolio.controller';

const router = Router();
router.use(authenticate);

// POST /portfolio/generate
router.post('/generate', validate(generatePortfolioSchema), requireCreditsForAction('PORTFOLIO_GENERATE'), generatePortfolio);

// GET /portfolio
router.get('/', listPortfolios);

// GET /portfolio/:id
router.get('/:id', getPortfolio);

// PUT /portfolio/:id
router.put('/:id', validate(updatePortfolioSchema), updatePortfolio);

// POST /portfolio/:id/deploy
router.post('/:id/deploy', deployPortfolio);

// DELETE /portfolio/:id
router.delete('/:id', deletePortfolio);

export default router;

