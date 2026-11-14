import { z } from 'zod';

export const buildingSchema = z.object({
  name: z.string().trim().min(2, 'Building name must be at least 2 characters').max(100),
  building_type: z.string().min(2).max(50),
  height_m: z.number().positive('Height must be greater than 0').max(1000, 'Height cannot exceed 1000m'),
  window_area_sqm: z.number().positive('Window area must be greater than 0').max(10000000),
  floors: z.number().int().positive().optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  glass_type: z.string().max(50).optional().nullable(),
  dirt_severity: z.enum(['light', 'moderate', 'heavy']).default('moderate'),
  cleaning_frequency: z.string().max(50).optional().nullable(),
  last_cleaned_at: z.string().optional().nullable()
});

export const updateBuildingSchema = buildingSchema.partial();
export type BuildingInput = z.infer<typeof buildingSchema>;
export type UpdateBuildingInput = z.infer<typeof updateBuildingSchema>;
