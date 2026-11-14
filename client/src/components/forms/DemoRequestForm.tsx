import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api.js';
import { GlassCard } from '../common/GlassCard.js';
import { GradientButton } from '../common/GradientButton.js';
import { Send, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const demoSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid corporate email'),
  company_name: z.string().trim().min(2, 'Company name is required'),
  phone: z.string().trim().min(6, 'Please enter a valid phone number with country code'),
  country: z.string().trim().min(2, 'Country is required'),
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
  message: z.string().max(2000).optional()
});

type DemoFormData = z.infer<typeof demoSchema>;

export const DemoRequestForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      building_type: 'Commercial tower',
      height_m: 160,
      window_area_sqm: 14000
    }
  });

  const onSubmit = async (data: DemoFormData) => {
    setLoading(true);
    try {
      await api.requestDemo(data);
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Demonstration request recorded! A flight engineer will contact you shortly.');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard borderVariant="cyan" className="p-8 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/40 text-status-success flex items-center justify-center mx-auto mb-2 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-display font-bold text-text-primary">
          Flight Demonstration Scheduled
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Thank you for requesting an AeroClean AI autonomous robotics demonstration. Our engineering solutions team will review your building parameters and contact you within 24 hours.
        </p>
        <div className="pt-4">
          <GradientButton variant="outline" onClick={() => setSubmitted(false)}>
            Submit Another Building Evaluation
          </GradientButton>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/30">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-text-primary">
            Request an Autonomous Drone Demonstration
          </h3>
          <p className="text-xs text-text-secondary">
            Schedule an on-site facade assessment with our certified aerospace robotics team.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Vikram Mehta"
              {...register('full_name')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.full_name && (
              <p className="text-[11px] text-status-danger mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Corporate Email *
            </label>
            <input
              type="email"
              placeholder="v.mehta@enterprise.com"
              {...register('email')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.email && (
              <p className="text-[11px] text-status-danger mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              placeholder="Vertex Realty Ltd."
              {...register('company_name')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.company_name && (
              <p className="text-[11px] text-status-danger mt-1">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              {...register('phone')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.phone && (
              <p className="text-[11px] text-status-danger mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Country *
            </label>
            <input
              type="text"
              placeholder="India"
              {...register('country')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.country && (
              <p className="text-[11px] text-status-danger mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Building Type *
            </label>
            <select
              {...register('building_type')}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="Commercial tower">Commercial tower</option>
              <option value="Residential tower">Residential tower</option>
              <option value="Hotel">Hotel</option>
              <option value="Corporate office">Corporate office</option>
              <option value="Industrial facility">Industrial facility</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Height (Meters) *
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              {...register('height_m', { valueAsNumber: true })}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary font-mono focus:outline-none focus:border-primary"
            />
            {errors.height_m && (
              <p className="text-[11px] text-status-danger mt-1">{errors.height_m.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Window Area (m²) *
            </label>
            <input
              type="number"
              min="1"
              {...register('window_area_sqm', { valueAsNumber: true })}
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary font-mono focus:outline-none focus:border-primary"
            />
            {errors.window_area_sqm && (
              <p className="text-[11px] text-status-danger mt-1">{errors.window_area_sqm.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
            Operational Constraints or Message
          </label>
          <textarea
            rows={3}
            placeholder="Provide any details regarding building geometry, high-wind microclimates, or preferred demonstration timeline..."
            {...register('message')}
            className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <GradientButton
          type="submit"
          size="lg"
          loading={loading}
          icon={<Send className="w-4 h-4" />}
          className="w-full"
        >
          Submit Flight Demonstration Request
        </GradientButton>
      </form>
    </GlassCard>
  );
};
