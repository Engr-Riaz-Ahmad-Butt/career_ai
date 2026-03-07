import { Router } from 'express';
import { authenticate, requireCredits } from '../middleware/auth';
import {
    generatePortfolio, listPortfolios, getPortfolio,
    updatePortfolio, deployPortfolio, deletePortfolio
} from '../controllers/portfolio.controller';
import { validate } from '../middleware/validate';
import { generatePortfolioSchema, updatePortfolioSchema } from '../utils/validation';

const router = Router();
router.use(authenticate);

// POST /portfolio/generate
router.post('/generate', validate(generatePortfolioSchema), requireCredits(5), generatePortfolio);

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

