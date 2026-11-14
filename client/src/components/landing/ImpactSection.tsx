import React from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { SectionHeading } from '../common/SectionHeading.js';
import {
  ShieldAlert,
  Clock,
  Cpu,
  Coins,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const pillars = [
    {
      icon: ShieldAlert,
      title: 'Improve Safety',
      headline: 'Zero Worker Altitude Risk',
      description: 'Significantly reduce the necessity for human personnel to operate in high-risk suspended cradles, swing stages, or rope descents hundreds of meters above ground level.',
      stat: 'Zero High-Risk Suspended Manpower',
      color: 'text-status-success'
    },
    {
      icon: Clock,
      title: 'Save Time',
      headline: 'Streamlined Turnaround Cycles',
      description: 'Autonomous route planning and rapid setup eliminate days spent staging exterior rigging and scaffolding, achieving up to 3x faster cleaning throughput.',
      stat: 'Up to 3x Acceleration Target',
      color: 'text-primary'
    },
    {
      icon: Cpu,
      title: 'AI Automation',
      headline: 'Autonomous Surface Intelligence',
      description: 'Combines dynamic obstacle standoff, neural dirt classification, and computerized verification auditing to ensure every square meter meets commercial cleanliness criteria.',
      stat: 'Autonomous Flight Waypoints',
      color: 'text-accent'
    },
    {
      icon: Coins,
      title: 'Affordable Technology',
      headline: 'Reduced Overhead & Insurance',
      description: 'Drastically lowers staging labor, heavy crane rentals, and excessive liability insurance premiums, unlocking continuous facade maintenance at lower lifecycle expense.',
      stat: 'Projected ~50% Expense Reduction',
      color: 'text-status-warning'
    }
  ];

  return (
    <section className="py-20 relative bg-background-secondary/60 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Product Mission & Value Proposition"
          badgeIcon={ShieldCheck}
          title="Engineering a Safer Future for"
          highlightText="High-Rise Maintenance."
          subtitle="Transforming one of the world's most hazardous facility maintenance occupations through autonomous aerospace robotics and precision artificial intelligence."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <GlassCard key={idx} className="p-6 space-y-4 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-surface-light border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-text-muted">
                      {pillar.title}
                    </span>
                    <h4 className="text-lg font-display font-bold text-text-primary group-hover:text-accent transition-colors">
                      {pillar.headline}
                    </h4>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border">
                  <span className={`text-xs font-mono font-semibold ${pillar.color}`}>
                    {pillar.stat}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Ethical Engineering Disclaimer */}
        <div className="mt-10 p-4 rounded-2xl bg-surface border border-border flex items-start gap-3 max-w-4xl mx-auto text-xs text-text-muted">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-text-secondary">Safety Architecture Notice:</strong> AeroClean AI is designed to augment and modernize facility operations. While our technology aims to drastically minimize human high-altitude exposure, real-world deployment requires qualified engineering evaluation, comprehensive site safety perimeters, and regulatory compliance with applicable civil aviation authorities.
          </p>
        </div>
      </div>
    </section>
  );
};
