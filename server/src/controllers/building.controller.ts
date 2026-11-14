import { Request, Response } from 'express';
import { buildingService } from '../services/building.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class BuildingController {
  async getBuildings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const buildings = await buildingService.getBuildingsByUser(userId);
      return sendSuccess(res, buildings, 'Buildings retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_BUILDINGS_FAILED', 500);
    }
  }

  async getBuildingById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const building = await buildingService.getBuildingById(req.params.id, userId);
      if (!building) return sendError(res, 'Building profile not found', 'NOT_FOUND', 404);
      return sendSuccess(res, building, 'Building retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_BUILDING_FAILED', 500);
    }
  }

  async createBuilding(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const newBuilding = await buildingService.createBuilding(userId, req.body);
      return sendSuccess(res, newBuilding, 'Building profile created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 'CREATE_BUILDING_FAILED', 500);
    }
  }

  async updateBuilding(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const updated = await buildingService.updateBuilding(req.params.id, userId, req.body);
      if (!updated) return sendError(res, 'Building not found or unauthorized', 'NOT_FOUND', 404);
      return sendSuccess(res, updated, 'Building profile updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'UPDATE_BUILDING_FAILED', 500);
    }
  }

  async deleteBuilding(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const deleted = await buildingService.deleteBuilding(req.params.id, userId);
      if (!deleted) return sendError(res, 'Building not found or unauthorized', 'NOT_FOUND', 404);
      return sendSuccess(res, { id: req.params.id }, 'Building profile deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'DELETE_BUILDING_FAILED', 500);
    }
  }
}

export const buildingController = new BuildingController();
