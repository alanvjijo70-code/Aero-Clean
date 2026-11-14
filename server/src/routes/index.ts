import { Router } from 'express';
import aiRoutes from './ai.routes.js';
import buildingRoutes from './building.routes.js';
import projectRoutes from './project.routes.js';
import estimateRoutes from './estimate.routes.js';
import { contactRouter, demoRouter, newsletterRouter } from './inquiry.routes.js';
import { sendSuccess } from '../utils/response.js';

const apiRouter = Router();

// Health & Status check endpoint
apiRouter.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'ONLINE',
    service: 'AeroClean AI Backend Platform',
    telemetry: 'ALL SYSTEMS OPERATIONAL (SIMULATION)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }, 'AeroClean AI API is operating normally');
});

// Mount modules under /api/v1
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/buildings', buildingRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/estimates', estimateRoutes);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/demo-requests', demoRouter);
apiRouter.use('/newsletter', newsletterRouter);

export default apiRouter;
