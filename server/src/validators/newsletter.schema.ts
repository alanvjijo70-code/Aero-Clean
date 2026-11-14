import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  company_name: z.string().trim().max(100).optional().nullable(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to receive platform updates' })
  })
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
