import React from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { SectionHeading } from '../common/SectionHeading.js';
import { Check, X, Layers, AlertCircle, Sparkles } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisons = [
    {
      metric: 'High-Altitude Human Hazard',
      traditional: 'Workers suspended in rope harnesses or cradles at extreme heights.',
      aeroclean: 'Zero workers aloft. Operated via autonomous waypoints with ground supervision.',
      droneSuperior: true
    },
    {
      metric: 'Setup & Mobilization Time',
      traditional: '2–5 days required to rig roof davits, winches, and scaffolding.',
      aeroclean: 'Under 45 minutes to calibrate LiDAR envelope and launch flight path.',
      droneSuperior: true
    },
    {
      metric: 'Water & Chemical Consumption',
      traditional: 'High run-off waste; bucket immersion and continuous hose spraying.',
      aeroclean: 'Closed-loop 4.5 bar atomization; up to 70% reduction in water usage.',
      droneSuperior: true
    },
    {
      metric: 'Cleaning Quality Verification',
      traditional: 'Subjective visual checks from ground level or interior windows.',
      aeroclean: 'Automated multispectral camera audit with streak-detection certificate.',
      droneSuperior: true
    },
    {
      metric: 'Liability & Insurance Overhead',
      traditional: 'Extremely high insurance premiums due to elevated fatality risks.',
      aeroclean: 'Standard ground-robotics coverage, reducing facility operating liability.',
      droneSuperior: true
    },
    {
      metric: 'Architectural Flexibility',
      traditional: 'Limited by overhangs, non-planar glass, and anchor points.',
      aeroclean: '6-DOF spatial navigation accommodates complex curves and cantilevers.',
      droneSuperior: true
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Benchmarking & Analysis"
          badgeIcon={Layers}
          title="Traditional Manual Operations vs"
          highlightText="AeroClean AI Autonomous Robotics"
          subtitle="A side-by-side technical evaluation highlighting safety, environmental sustainability, and operational velocity."
          className="mb-14"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-6 text-xs font-mono uppercase text-text-muted">
                  Operational Dimension
                </th>
                <th className="py-4 px-6 text-xs font-mono uppercase text-text-muted bg-surface/50 rounded-tl-2xl">
                  Traditional Manual Cleaning
                </th>
                <th className="py-4 px-6 text-xs font-mono uppercase text-primary bg-primary/10 rounded-tr-2xl border-t border-x border-primary/30">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> AeroClean AI Drone Platform
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-sm font-display font-semibold text-text-primary">
                    {row.metric}
                  </td>
                  <td className="py-4 px-6 text-xs text-text-secondary bg-surface/30">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-status-danger shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-text-primary bg-primary/5 border-x border-primary/20">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="font-medium text-accent">{row.aeroclean}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
