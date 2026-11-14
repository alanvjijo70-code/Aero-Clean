import { z } from 'zod';

export const contactSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().min(2, 'Subject must be at least 2 characters').max(150).optional().default('General Inquiry'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000)
});

export type ContactInput = z.infer<typeof contactSchema>;
