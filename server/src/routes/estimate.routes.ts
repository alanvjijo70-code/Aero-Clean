import { Router } from 'express';
import { estimateController } from '../controllers/estimate.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { calculateEstimateSchema, saveEstimateSchema } from '../validators/estimate.schema.js';

const router = Router();

// Public calculation endpoint
router.post('/calculate', validateBody(calculateEstimateSchema), estimateController.calculate);

// Authenticated portfolio operations
router.post('/save', authenticateUser, validateBody(saveEstimateSchema), estimateController.saveEstimate);
router.get('/', authenticateUser, estimateController.getEstimates);
router.get('/:id', authenticateUser, estimateController.getEstimateById);
router.delete('/:id', authenticateUser, estimateController.deleteEstimate);

export default router;
