import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    getPlans, createCheckout, createPortal, getSubscription,
    cancelSubscription, reactivateSubscription, purchaseCredits, listInvoices, handleWebhook,
} from '../controllers/billing.controller';

const router = Router();

// Webhook must come BEFORE auth middleware (raw body already parsed via server.ts)
router.post('/webhook', handleWebhook);

// Public
router.get('/plans', getPlans);

// Authenticated
router.use(authenticate);
router.post('/checkout', createCheckout);
router.post('/portal', createPortal);
router.get('/subscription', getSubscription);
router.post('/cancel', cancelSubscription);
router.post('/reactivate', reactivateSubscription);
router.post('/credits/purchase', purchaseCredits);
router.get('/invoices', listInvoices);

export default router;
