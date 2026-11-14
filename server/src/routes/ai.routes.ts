import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  suitabilityInputSchema,
  operationalPlanInputSchema,
  buildingAdvisoryInputSchema
} from '../validators/ai.schema.js';

const router = Router();

router.post(
  '/cleaning-analysis',
  aiRateLimiter,
  optionalAuth,
  validateBody(suitabilityInputSchema),
  aiController.analyzeSuitability
);

router.post(
  '/operational-plan',
  aiRateLimiter,
  validateBody(operationalPlanInputSchema),
  aiController.generatePlan
);

router.post(
  '/advisor',
  aiRateLimiter,
  optionalAuth,
  validateBody(buildingAdvisoryInputSchema),
  aiController.generateAdvisory
);

router.get('/history', authenticateUser, aiController.getHistory);
router.get('/history/:id', authenticateUser, aiController.getHistoryById);

export default router;
