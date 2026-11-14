import { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export class AiController {
  async analyzeSuitability(req: Request, res: Response) {
    try {
      const result = await geminiService.analyzeCleaningSuitability(req.body, req.user?.id);
      return sendSuccess(res, result, 'Cleaning suitability analysis generated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to analyze cleaning suitability', 'AI_ANALYSIS_FAILED', 500);
    }
  }

  async generatePlan(req: Request, res: Response) {
    try {
      const result = await geminiService.generateOperationalPlan(req.body);
      return sendSuccess(res, result, 'Operational cleaning plan generated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to generate operational plan', 'AI_PLAN_FAILED', 500);
    }
  }

  async generateAdvisory(req: Request, res: Response) {
    try {
      const result = await geminiService.generateBuildingAdvisory(req.body, req.user?.id);
      return sendSuccess(res, result, 'Building advisory generated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to generate building advisory', 'AI_ADVISORY_FAILED', 500);
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      }

      if (isSupabaseConfigured && supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('ai_consultations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return sendSuccess(res, data || [], 'Consultation history retrieved');
      }

      // Fallback demo history
      return sendSuccess(res, [
        {
          id: 'hist-001',
          question: 'What is the optimal cleaning strategy for 46-storey commercial tower in urban core?',
          response: {
            summary: 'Bi-monthly autonomous hybrid cycle with ultrasonic surfactant application.',
            suitability: 'suitable',
            confidence: 0.91
          },
          created_at: new Date(Date.now() - 2 * 86400000).toISOString()
        }
      ], 'Consultation history retrieved');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch consultation history', 'AI_HISTORY_FAILED', 500);
    }
  }

  async getHistoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
      }

      if (isSupabaseConfigured && supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('ai_consultations')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error || !data) {
          return sendError(res, 'Consultation not found', 'NOT_FOUND', 404);
        }
        return sendSuccess(res, data, 'Consultation retrieved');
      }

      return sendSuccess(res, {
        id,
        question: 'Sample consultation query',
        response: { summary: 'Sample recommendation' },
        created_at: new Date().toISOString()
      });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch consultation', 'AI_GET_FAILED', 500);
    }
  }
}

export const aiController = new AiController();
