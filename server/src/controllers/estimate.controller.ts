import { Request, Response } from 'express';
import { estimateService } from '../services/estimate.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class EstimateController {
  calculate(req: Request, res: Response) {
    try {
      const result = estimateService.calculate(req.body);
      return sendSuccess(res, result, 'Estimate calculated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'CALCULATION_FAILED', 400);
    }
  }

  async saveEstimate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required to save estimates', 'UNAUTHORIZED', 401);
      const saved = await estimateService.saveEstimate(userId, req.body);
      return sendSuccess(res, saved, 'Estimate saved to portfolio successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 'SAVE_ESTIMATE_FAILED', 500);
    }
  }

  async getEstimates(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const estimates = await estimateService.getEstimatesByUser(userId);
      return sendSuccess(res, estimates, 'Estimates retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_ESTIMATES_FAILED', 500);
    }
  }

  async getEstimateById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const estimate = await estimateService.getEstimateById(req.params.id, userId);
      if (!estimate) return sendError(res, 'Estimate not found', 'NOT_FOUND', 404);
      return sendSuccess(res, estimate, 'Estimate retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_ESTIMATE_FAILED', 500);
    }
  }

  async deleteEstimate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const deleted = await estimateService.deleteEstimate(req.params.id, userId);
      if (!deleted) return sendError(res, 'Estimate not found or unauthorized', 'NOT_FOUND', 404);
      return sendSuccess(res, { id: req.params.id }, 'Estimate deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'DELETE_ESTIMATE_FAILED', 500);
    }
  }
}

export const estimateController = new EstimateController();
