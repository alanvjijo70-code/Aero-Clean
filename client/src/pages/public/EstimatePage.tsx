import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { CostEstimator } from '../../components/forms/CostEstimator.js';
import { Calculator, ShieldAlert, Sparkles, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GradientButton } from '../../components/common/GradientButton.js';
import { GlassCard } from '../../components/common/GlassCard.js';

export const EstimatePage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 space-y-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Interactive ROI Modeler"
          badgeIcon={Calculator}
          title="Autonomous Maintenance"
          highlightText="Cost & Time Estimator."
          subtitle="Model projected labor savings, turnaround acceleration, and return on investment across multiple building types and elevation profiles."
          className="mb-12"
        />

        <CostEstimator />
      </section>

      {/* Assumptions and Methodology Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/30">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-text-primary">
              Staging & Rigging Overhead
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Traditional cleaning costs increase sharply above 150m due to mandatory secondary rope drops, roof counterweights, and specialized high-wind staging permits. Drones bypass these staging bottlenecks completely.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/30">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-text-primary">
              Throughput Acceleration
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              An autonomous drone washes at an illustrative rate of 110 m²/hour compared to a typical human cradle rate of 35 m²/hour, reducing building facade downtime from weeks to days.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-status-success/10 text-status-success flex items-center justify-center border border-status-success/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-display font-bold text-text-primary">
              Water & Eco-Solvent Efficiency
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Closed-loop electrostatic atomization uses 70% less water than traditional hose wash methods, eliminating wasteful facade run-off onto lower pedestrian plazas.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};
