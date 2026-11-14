import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Bot,
  Target,
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 space-y-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Mission & Engineering Philosophy"
          badgeIcon={Target}
          title="Autonomous Robotics for the"
          highlightText="Skylines of Tomorrow."
          subtitle="AeroClean AI was conceived with a single non-negotiable imperative: no human worker should ever risk their life hanging outside a 50-storey glass skyscraper."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
              Transforming High-Altitude Maintenance into a Safe, Computational Discipline
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every year across the world, thousands of high-rise window cleaners face extreme hazards—gusting wind shears, rope chafing, cradle motor failures, and sudden squalls. Despite advances in safety harnesses, suspended scaffold maintenance remains one of the top high-mortality occupations globally.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              AeroClean AI combines aerospace structural dynamics, multispectral machine vision, and precision fluid mechanics to perform exterior glazing restoration autonomously, safely, and cleanly from the rooftop down.
            </p>
          </div>

          <GlassCard borderVariant="cyan" className="p-8 space-y-4">
            <h4 className="text-xs font-mono uppercase text-primary tracking-widest">
              Core Engineering Values
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-text-primary">Safety As The Prime Invariant</h5>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Every hardware component, software loop, and trajectory algorithm is subordinate to collision avoidance and ground protection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-text-primary">Verifiable Optical Quality</h5>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Cleaning is not complete until neural cameras mathematically certify transparency and streak eradication.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-text-primary">Environmental Stewardship</h5>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Closed-loop deionized fluid atomization cuts municipal water consumption by up to 70% compared to traditional hoses.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Target Domains Grid */}
        <div className="pt-8 border-t border-border">
          <h4 className="text-xs font-mono uppercase tracking-widest text-primary text-center mb-8">
            Specialized Technology Domains
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'Autonomous Robotics',
              'Computer Vision',
              'Aerospace Dynamics',
              'Smart Building IoT',
              'Predictive Maintenance',
              'Fluid Atomization',
              'LiDAR Spatial Mapping',
              'Commercial Property Tech',
              'Edge AI Inferencing',
              'Environmental Efficiency'
            ].map((domain, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface border border-border text-center text-xs font-mono text-text-secondary hover:text-accent hover:border-primary/40 transition-colors"
              >
                {domain}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <GlassCard borderVariant="subtle" className="p-10 space-y-4">
          <h3 className="text-2xl font-display font-bold text-text-primary">
            Partner With AeroClean AI
          </h3>
          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            Discover how autonomous drone maintenance elevates safety standards and lowers operational expenditure across your real estate portfolio.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <GradientButton size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Contact Leadership & Engineering
              </GradientButton>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
