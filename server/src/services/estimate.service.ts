import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { CalculateEstimateInput, SaveEstimateInput } from '../validators/estimate.schema.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export interface EstimateResult {
  window_area_sqm: number;
  building_height_m: number;
  traditional_cost: number;
  drone_cost: number;
  estimated_savings: number;
  savings_percentage: number;
  traditional_hours: number;
  drone_hours: number;
  time_saved_hours: number;
  time_saved_percentage: number;
  currency: string;
  assumptions: Record<string, any>;
  disclaimer: string;
}

export interface SavedEstimateRecord extends EstimateResult {
  id: string;
  user_id: string;
  building_id?: string | null;
  project_id?: string | null;
  created_at: string;
}

const memoryEstimates: Map<string, SavedEstimateRecord> = new Map([
  [
    'est-001',
    {
      id: 'est-001',
      user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      building_id: 'bldg-001',
      project_id: null,
      window_area_sqm: 14500,
      building_height_m: 185.5,
      traditional_cost: 652500,
      drone_cost: 319000,
      estimated_savings: 333500,
      savings_percentage: 51.11,
      traditional_hours: 414.29,
      drone_hours: 131.82,
      time_saved_hours: 282.47,
      time_saved_percentage: 68.18,
      currency: 'INR',
      assumptions: {
        traditional_cost_per_sqm: 45,
        drone_cost_per_sqm: 22,
        traditional_productivity_sqm_h: 35,
        drone_productivity_sqm_h: 110
      },
      disclaimer: 'These figures are preliminary planning estimates based on user-provided inputs and configurable assumptions. Actual costs and durations depend on building geometry, access, weather, regulations, cleaning conditions, and operational validation.',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ]
]);

export class EstimateService {
  calculate(input: CalculateEstimateInput): EstimateResult {
    const {
      window_area_sqm,
      building_height_m,
      traditional_cost_per_sqm,
      drone_cost_per_sqm,
      traditional_productivity_sqm_h,
      drone_productivity_sqm_h,
      currency
    } = input;

    // Height factor: extreme heights (>150m) add safety rigging overhead to manual work
    const heightFactor = building_height_m > 150 ? 1 + (building_height_m - 150) * 0.001 : 1.0;
    const adjustedTraditionalRate = traditional_cost_per_sqm * heightFactor;

    const traditional_cost = Math.round(window_area_sqm * adjustedTraditionalRate * 100) / 100;
    const drone_cost = Math.round(window_area_sqm * drone_cost_per_sqm * 100) / 100;
    const estimated_savings = Math.round((traditional_cost - drone_cost) * 100) / 100;
    const savings_percentage = traditional_cost > 0 
      ? Math.round((estimated_savings / traditional_cost) * 10000) / 100 
      : 0;

    const traditional_hours = Math.round((window_area_sqm / traditional_productivity_sqm_h) * 10) / 10;
    const drone_hours = Math.round((window_area_sqm / drone_productivity_sqm_h) * 10) / 10;
    const time_saved_hours = Math.round((traditional_hours - drone_hours) * 10) / 10;
    const time_saved_percentage = traditional_hours > 0
      ? Math.round((time_saved_hours / traditional_hours) * 10000) / 100
      : 0;

    return {
      window_area_sqm,
      building_height_m,
      traditional_cost,
      drone_cost,
      estimated_savings,
      savings_percentage,
      traditional_hours,
      drone_hours,
      time_saved_hours,
      time_saved_percentage,
      currency,
      assumptions: {
        traditional_cost_per_sqm,
        drone_cost_per_sqm,
        traditional_productivity_sqm_h,
        drone_productivity_sqm_h,
        height_rigging_multiplier: Math.round(heightFactor * 100) / 100
      },
      disclaimer: 'These figures are preliminary planning estimates based on user-provided inputs and configurable assumptions. Actual costs and durations depend on building geometry, access, weather, regulations, cleaning conditions, and operational validation.'
    };
  }

  async saveEstimate(userId: string, input: SaveEstimateInput): Promise<SavedEstimateRecord> {
    const time_saved_hours = Math.max(0, input.traditional_hours - input.drone_hours);
    const time_saved_percentage = input.traditional_hours > 0
      ? Math.round((time_saved_hours / input.traditional_hours) * 10000) / 100
      : 0;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cost_estimates')
        .insert({
          user_id: userId,
          building_id: input.building_id || null,
          project_id: input.project_id || null,
          window_area_sqm: input.window_area_sqm,
          building_height_m: input.building_height_m,
          traditional_cost: input.traditional_cost,
          drone_cost: input.drone_cost,
          estimated_savings: input.estimated_savings,
          savings_percentage: input.savings_percentage,
          traditional_hours: input.traditional_hours,
          drone_hours: input.drone_hours,
          currency: input.currency,
          assumptions: input.assumptions
        })
        .select()
        .single();

      if (error) {
        logger.error('Error saving estimate in Supabase:', error);
        throw new Error(error.message);
      }

      return {
        ...data,
        time_saved_hours,
        time_saved_percentage,
        disclaimer: 'These figures are preliminary planning estimates based on user-provided inputs and configurable assumptions. Actual costs and durations depend on building geometry, access, weather, regulations, cleaning conditions, and operational validation.'
      };
    }

    const saved: SavedEstimateRecord = {
      ...input,
      id: `est-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      time_saved_hours,
      time_saved_percentage,
      disclaimer: 'These figures are preliminary planning estimates based on user-provided inputs and configurable assumptions. Actual costs and durations depend on building geometry, access, weather, regulations, cleaning conditions, and operational validation.',
      created_at: new Date().toISOString()
    };
    memoryEstimates.set(saved.id, saved);
    return saved;
  }

  async getEstimatesByUser(userId: string): Promise<SavedEstimateRecord[]> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cost_estimates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return (data || []).map((e: any) => ({
        ...e,
        time_saved_hours: Math.max(0, e.traditional_hours - e.drone_hours),
        time_saved_percentage: e.traditional_hours > 0 ? ((e.traditional_hours - e.drone_hours) / e.traditional_hours) * 100 : 0,
        disclaimer: 'Planning estimate only.'
      }));
    }

    return Array.from(memoryEstimates.values()).filter(
      (e) => e.user_id === userId || userId === 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    );
  }

  async getEstimateById(id: string, userId: string): Promise<SavedEstimateRecord | null> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cost_estimates')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }
      return data;
    }

    const est = memoryEstimates.get(id);
    if (!est || (est.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return null;
    }
    return est;
  }

  async deleteEstimate(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('cost_estimates')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    }

    const est = memoryEstimates.get(id);
    if (!est || (est.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return false;
    }
    return memoryEstimates.delete(id);
  }
}

export const estimateService = new EstimateService();
