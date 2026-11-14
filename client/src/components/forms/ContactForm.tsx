import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api.js';
import { GlassCard } from '../common/GlassCard.js';
import { GradientButton } from '../common/GradientButton.js';
import { Send, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().min(2, 'Subject must be at least 2 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000)
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: 'Commercial Inquiry'
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      await api.submitContact(data);
      setSubmitted(true);
      toast.success('Your message has been delivered to AeroClean AI engineering.');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="p-8 text-center max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-full bg-status-success/20 border border-status-success/40 text-status-success flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-display font-bold text-text-primary">
          Message Received
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Our engineering support team has received your communication and will reply within one business day.
        </p>
        <GradientButton variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Send Another Message
        </GradientButton>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8 max-w-xl mx-auto">
      <h3 className="text-xl font-display font-bold text-text-primary mb-1">
        Connect With Our Solutions Team
      </h3>
      <p className="text-xs text-text-secondary mb-6">
        Have technical questions about facade integration, flight clearances, or enterprise contracts?
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              {...register('full_name')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.full_name && (
              <p className="text-[11px] text-status-danger mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="s.jenkins@skylinefacades.com"
              {...register('email')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.email && (
              <p className="text-[11px] text-status-danger mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1">
            Subject *
          </label>
          <input
            type="text"
            placeholder="e.g. Multi-Tower Fleet Procurement"
            {...register('subject')}
            className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
          {errors.subject && (
            <p className="text-[11px] text-status-danger mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1">
            Message *
          </label>
          <textarea
            rows={4}
            placeholder="How can we assist your facility operations team?"
            {...register('message')}
            className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
          />
          {errors.message && (
            <p className="text-[11px] text-status-danger mt-1">{errors.message.message}</p>
          )}
        </div>

        <GradientButton
          type="submit"
          loading={loading}
          icon={<Send className="w-4 h-4" />}
          className="w-full"
        >
          Send Message
        </GradientButton>
      </form>
    </GlassCard>
  );
};
