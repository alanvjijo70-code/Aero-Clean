import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeading
          badge="Legal & Operational Bounds"
          badgeIcon={ShieldAlert}
          title="Terms of Service &"
          highlightText="Operational Disclaimers."
          subtitle="Mandatory guidelines regarding autonomous robotics simulations, flight planning estimates, and regulatory responsibilities."
          className="mb-8"
        />

        <GlassCard className="p-8 space-y-6 text-sm text-text-secondary leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">1. Demonstration & Planning Nature of Web Platform</h3>
            <p>
              AeroClean AI web applications provide simulation tools, interactive 3D visualizations, and algorithmic cost models. Interacting with the 3D model does NOT control live active aerial vehicles. All real-world deployments are conducted exclusively by licensed flight personnel adhering to civil aviation safety regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">2. Disclaimer of Certified Engineering Advice</h3>
            <p>
              AI recommendations, suitability assessments, and duration calculations are preliminary planning metrics. They do not substitute for on-site structural engineering assessments, facade condition evaluations, or certified aviation hazard clearances.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">3. Financial Estimates and Performance Claims</h3>
            <p>
              Calculated savings percentages and productivity rates (e.g. 110 m²/hr) are based on standard architectural baselines and configurable inputs. Actual results may vary depending on wind shears, facade contours, access restrictions, and local labor rates.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-display font-bold text-text-primary">4. Intellectual Property</h3>
            <p>
              All proprietary algorithms, aerodynamic drone designs, 3D assets, and trademarked logos belonging to AeroClean AI are protected under international copyright and intellectual property conventions.
            </p>
          </section>
        </GlassCard>
      </div>
    </div>
  );
};
