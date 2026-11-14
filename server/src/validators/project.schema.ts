import { z } from 'zod';

export const projectSchema = z.object({
  building_id: z.string().min(1, 'Building ID is required'),
  project_name: z.string().trim().min(2, 'Project name must be at least 2 characters').max(100),
  status: z.enum(['draft', 'planned', 'in_progress', 'completed', 'cancelled']).default('draft'),
  scheduled_date: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable()
});

export const updateProjectSchema = projectSchema.partial();
export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
