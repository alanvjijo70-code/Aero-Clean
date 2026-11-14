import { z } from 'zod';

// ==========================================
// 15.1 Suitability Analysis Schemas
// ==========================================
export const suitabilityInputSchema = z.object({
  building_id: z.string().optional().nullable(),
  building_type: z.string().min(2).default('Commercial tower'),
  building_height_m: z.number().positive().max(1000),
  window_area_sqm: z.number().positive().max(10000000),
  glass_type: z.string().default('Tempered insulated glass'),
  dirt_severity: z.enum(['light', 'moderate', 'heavy']).default('moderate'),
  environmental_exposure: z.string().default('Urban center with moderate dust and vehicle emissions')
});

export const suitabilityOutputSchema = z.object({
  suitability: z.enum(['suitable', 'conditionally_suitable', 'requires_assessment']),
  confidence: z.number().min(0).max(1),
  building_summary: z.string(),
  cleaning_challenges: z.array(z.string()),
  recommended_approach: z.string(),
  suggested_frequency: z.string(),
  safety_considerations: z.array(z.string()),
  limitations: z.array(z.string()),
  explanation: z.string()
});

// ==========================================
// 15.2 Operational Cleaning Plan Schemas
// ==========================================
export const operationalPlanInputSchema = z.object({
  building_name: z.string().optional().default('Commercial High-Rise'),
  building_height_m: z.number().positive().max(1000),
  window_area_sqm: z.number().positive().max(10000000),
  dirt_severity: z.enum(['light', 'moderate', 'heavy']).default('moderate'),
  operational_constraints: z.string().optional().default('Standard daytime hours, wind speed under 25 km/h')
});

export const cleaningStageSchema = z.object({
  step: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  estimated_minutes: z.number().nonnegative()
});

export const operationalPlanOutputSchema = z.object({
  plan_title: z.string(),
  estimated_duration_hours: z.number().positive(),
  cleaning_stages: z.array(cleaningStageSchema),
  operational_notes: z.array(z.string()),
  safety_notes: z.array(z.string())
});

// ==========================================
// 15.3 AI Building Advisory Schemas
// ==========================================
export const buildingAdvisoryInputSchema = z.object({
  building_id: z.string().optional().nullable(),
  building_height_m: z.number().positive().optional(),
  window_area_sqm: z.number().positive().optional(),
  dirt_severity: z.enum(['light', 'moderate', 'heavy']).optional(),
  question: z.string().min(3, 'Query must be at least 3 characters').max(1500)
});

export const recommendationItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high'])
});

export const buildingAdvisoryOutputSchema = z.object({
  summary: z.string(),
  observations: z.array(z.string()),
  recommendations: z.array(recommendationItemSchema),
  estimated_benefits: z.array(z.string()),
  risks: z.array(z.string()),
  next_steps: z.array(z.string()),
  disclaimer: z.string()
});

export type SuitabilityInput = z.infer<typeof suitabilityInputSchema>;
export type SuitabilityOutput = z.infer<typeof suitabilityOutputSchema>;
export type OperationalPlanInput = z.infer<typeof operationalPlanInputSchema>;
export type OperationalPlanOutput = z.infer<typeof operationalPlanOutputSchema>;
export type BuildingAdvisoryInput = z.infer<typeof buildingAdvisoryInputSchema>;
export type BuildingAdvisoryOutput = z.infer<typeof buildingAdvisoryOutputSchema>;
