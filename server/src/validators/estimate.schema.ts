import { z } from 'zod';

export const calculateEstimateSchema = z.object({
  window_area_sqm: z.number().positive('Window area must be greater than 0').max(10000000),
  building_height_m: z.number().positive('Building height must be greater than 0').max(1000),
  traditional_cost_per_sqm: z.number().positive().default(45),
  drone_cost_per_sqm: z.number().positive().default(22),
  traditional_productivity_sqm_h: z.number().positive().default(35),
  drone_productivity_sqm_h: z.number().positive().default(110),
  currency: z.string().default('INR')
});

export const saveEstimateSchema = z.object({
  building_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  window_area_sqm: z.number().positive(),
  building_height_m: z.number().positive(),
  traditional_cost: z.number().nonnegative(),
  drone_cost: z.number().nonnegative(),
  estimated_savings: z.number(),
  savings_percentage: z.number(),
  traditional_hours: z.number().nonnegative(),
  drone_hours: z.number().nonnegative(),
  currency: z.string().default('INR'),
  assumptions: z.record(z.any()).default({})
});

export type CalculateEstimateInput = z.infer<typeof calculateEstimateSchema>;
export type SaveEstimateInput = z.infer<typeof saveEstimateSchema>;
