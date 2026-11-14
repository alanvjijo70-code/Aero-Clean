import { Request, Response } from 'express';
import { projectService } from '../services/project.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class ProjectController {
  async getProjects(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const projects = await projectService.getProjectsByUser(userId);
      return sendSuccess(res, projects, 'Cleaning projects retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_PROJECTS_FAILED', 500);
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const project = await projectService.getProjectById(req.params.id, userId);
      if (!project) return sendError(res, 'Cleaning project not found', 'NOT_FOUND', 404);
      return sendSuccess(res, project, 'Cleaning project retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'FETCH_PROJECT_FAILED', 500);
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const newProject = await projectService.createProject(userId, req.body);
      return sendSuccess(res, newProject, 'Cleaning project created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 'CREATE_PROJECT_FAILED', 500);
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const updated = await projectService.updateProject(req.params.id, userId, req.body);
      if (!updated) return sendError(res, 'Project not found or unauthorized', 'NOT_FOUND', 404);
      return sendSuccess(res, updated, 'Cleaning project updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'UPDATE_PROJECT_FAILED', 500);
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      const deleted = await projectService.deleteProject(req.params.id, userId);
      if (!deleted) return sendError(res, 'Project not found or unauthorized', 'NOT_FOUND', 404);
      return sendSuccess(res, { id: req.params.id }, 'Cleaning project deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 'DELETE_PROJECT_FAILED', 500);
    }
  }
}

export const projectController = new ProjectController();
