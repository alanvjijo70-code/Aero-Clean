import { z } from 'zod';

export const demoRequestSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid business email address'),
  company_name: z.string().trim().min(2, 'Company name is required').max(100),
  phone: z.string().trim().min(6, 'Please enter a valid phone number').max(30),
  country: z.string().trim().min(2).max(100),
  building_type: z.enum([
    'Commercial tower',
    'Residential tower',
    'Hotel',
    'Corporate office',
    'Industrial facility',
    'Other'
  ]),
  height_m: z.number().positive('Building height must be positive').max(1000),
  window_area_sqm: z.number().positive('Window area must be positive').max(10000000),
  message: z.string().max(2000).optional().nullable()
});

export const updateDemoStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed'])
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
export type UpdateDemoStatusInput = z.infer<typeof updateDemoStatusSchema>;
