import { Router } from 'express';
import {
  contactController,
  demoController,
  newsletterController
} from '../controllers/inquiry.controller.js';
import { authenticateUser, optionalAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { contactSchema } from '../validators/contact.schema.js';
import { demoRequestSchema, updateDemoStatusSchema } from '../validators/demo.schema.js';
import { newsletterSchema } from '../validators/newsletter.schema.js';

export const contactRouter = Router();
contactRouter.post('/', optionalAuth, validateBody(contactSchema), contactController.submitMessage);

export const demoRouter = Router();
demoRouter.post('/', optionalAuth, validateBody(demoRequestSchema), demoController.requestDemo);
demoRouter.get('/', authenticateUser, requireAdmin, demoController.getDemoRequests);
demoRouter.patch('/:id/status', authenticateUser, requireAdmin, validateBody(updateDemoStatusSchema), demoController.updateDemoStatus);

export const newsletterRouter = Router();
newsletterRouter.post('/subscribe', validateBody(newsletterSchema), newsletterController.subscribe);
