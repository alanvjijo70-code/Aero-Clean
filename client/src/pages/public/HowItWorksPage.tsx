import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { CleaningWorkflow } from '../../components/drone/CleaningWorkflow.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { Link } from 'react-router-dom';
import {
  Compass,
  Scan,
  Droplets,
  RotateCw,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Digital Twin Envelope Mapping',
      icon: Scan,
      description: 'Prior to operational launch, LiDAR point-cloud scanners construct a millimeter-accurate 3D model of the building facade, identifying mullion spacing, air intake vents, window setbacks, and safety exclusion zones.'
    },
    {
      step: '02',
      title: 'Waypoint Generation & Pre-Flight Checks',
      icon: Compass,
      description: 'AeroClean flight algorithms generate continuous vertical serpentine flight vectors with 15% overlap. Telemetry checks confirm ultrasonic anemometer wind limits and battery charge levels.'
    },
    {
      step: '03',
      title: 'Electrostatic Mist & Surface Softening',
      icon: Droplets,
      description: 'The drone ascends along calibrated facade columns. High-pressure atomized deionized solvent is applied electrostatically at 4.5 bar, loosening baked particulate without wasteful run-off.'
    },
    {
      step: '04',
      title: 'Active Scrubbing & Silicone Extraction',
      icon: RotateCw,
      description: 'Microfiber scrub rollers rotate at 300 RPM under continuous 12N contact pressure to lift dirt, followed immediately by the precision silicone squeegee for streak-free drying.'
    },
    {
      step: '05',
      title: 'AI Verification & Compliance Logging',
      icon: CheckCircle2,
      description: 'The downward optical audit camera inspects the cleaned surface in real-time. Cleanliness ratings, timestamps, and water consumption data are logged to the enterprise dashboard.'
    }
  ];

  return (
    <div className="pt-24 pb-20 space-y-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Operational Blueprint"
          badgeIcon={Compass}
          title="From Initial Site Survey to"
          highlightText="Autonomous Wash Certification."
          subtitle="Explore the end-to-end lifecycle of an AeroClean AI autonomous high-rise window cleaning mission."
          className="mb-14"
        />

        {/* 5-Step Operational Pipeline */}
        <div className="space-y-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <GlassCard key={idx} className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-3xl font-extrabold text-primary/40 group-hover:text-primary transition-colors shrink-0">
                    {item.step}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-light border border-border group-hover:border-primary/40 transition-colors shrink-0 self-start md:self-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Interactive Mechanism Simulation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Interactive Subsystem Demo"
          badgeIcon={RotateCw}
          title="Simulate the Six Cleaning Stages"
          highlightText="in Real-Time."
          subtitle="Interact with the flight computer simulator to see how each phase operates against facade glass."
          className="mb-10"
        />

        <CleaningWorkflow />
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <GlassCard borderVariant="cyan" className="p-10 space-y-4">
          <h3 className="text-2xl font-display font-bold text-text-primary">
            Ready to Digitize Your Building Maintenance?
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Experience the future of commercial facade robotics with a live site demonstration.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <GradientButton size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Request On-Site Flight Demo
              </GradientButton>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
