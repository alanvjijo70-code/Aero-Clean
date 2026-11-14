import React from 'react';
import { SectionHeading } from '../../components/common/SectionHeading.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Eye,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  const subsystems = [
    {
      id: 'sensors',
      title: 'Spatial LiDAR & Proximity Suite',
      badge: 'Spatial Awareness',
      icon: Activity,
      summary: 'Millimeter-accurate facade standoff with 360-degree continuous ranging.',
      details: [
        'Solid-State LiDAR Array: 100 Hz refresh rate tracking facade contours at distances up to 30 meters.',
        'Ultrasonic Micro-Sensors: Four close-proximity transducers guarding the 15cm glass buffer zone.',
        '6-Axis Dual IMU & Gyroscope: Redundant inertial measurement units compensating for sudden wind shear.',
        'Ultrasonic Anemometer: Continuous real-time crosswind measurement with automated hold/abort thresholds.'
      ]
    },
    {
      id: 'vision',
      title: 'Neural Computer Vision Turret',
      badge: 'Multispectral AI',
      icon: Eye,
      summary: 'Real-time contamination classification running on edge neural processors.',
      details: [
        'Stereoscopic Optical Sensors: 4K dual sensors capture high-contrast glint and reflection maps.',
        'Convolutional Neural Network: Custom-trained vision model distinguishing dust, grease, pollen, and hard water scale.',
        'Adaptive Spray Intensity: Signals the fluid dispenser to scale pressure dynamically across dirty quadrants.',
        'Thermal Glazing Diagnostics: Detects broken thermal seals and window frame insulation faults.'
      ]
    },
    {
      id: 'navigation',
      title: 'Autonomous Navigation & Pathing',
      badge: 'Path Planning',
      icon: Compass,
      summary: 'Dynamic serpentine route calculation with obstacle evasion.',
      details: [
        'Pre-Flight Digital Twin Ingestion: Navigates using pre-scanned 3D point-cloud building envelopes.',
        'Real-Time Obstacle Evasion: Safely navigates protruding architectural fins, open windows, and lightning rods.',
        'Wind Shear Compensation: Adaptive thrust vectors counteract high-rise updrafts and venturi effects.',
        'Micro-Waypoint Overlap: Enforces a strict 15% path overlap to guarantee zero missed stripes.'
      ]
    },
    {
      id: 'hybrid',
      title: 'Hybrid Cleaning Mechanism',
      badge: 'Mechanical Engineering',
      icon: Sparkles,
      summary: 'Electrostatic atomization, active micro-oscillation, and polymer squeegee.',
      details: [
        'Deionized Fluid Atomizer: Sprays ultra-pure solvent mist at 4.5 bar with zero chemical drip.',
        'Counter-Rotating Microfiber Roller: 300 RPM scrub action breaks down stubborn particulate adhesion.',
        'Constant Force Regulator: 12N contact load cells prevent micro-scratches on glass coatings.',
        'Hydrophobic Silicone Squeegee: Micro-vacuum edge extracts moisture for streak-free optical clarity.'
      ]
    },
    {
      id: 'verification',
      title: 'Optical Verification & Certification',
      badge: 'Quality Assurance',
      icon: CheckCircle2,
      summary: 'Automated post-clean optical scoring and immutable audit records.',
      details: [
        'Multispectral Surface Audit: High-resolution verification camera audits surface transparency.',
        'Automated Re-Clean Trigger: If surface clarity is under 98%, initiates immediate secondary wash pass.',
        'Telemetry Logging: Records cleaning duration, fluid volume consumed, and timestamps per facade panel.',
        'Enterprise Compliance Export: Generates downloadable PDF/JSON maintenance audit certificates.'
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Engineering Deep Dive"
          badgeIcon={Cpu}
          title="Aerospace Robotics &"
          highlightText="Autonomous Intelligence."
          subtitle="A comprehensive technical overview of the sensor suites, neural vision algorithms, and mechanical assemblies that power AeroClean AI."
          className="mb-12"
        />

        {/* Subsystems Stack */}
        <div className="space-y-8">
          {subsystems.map((system) => {
            const Icon = system.icon;
            return (
              <GlassCard key={system.id} className="p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/30">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase text-accent tracking-wider">
                        {system.badge}
                      </span>
                      <h3 className="text-2xl font-display font-bold text-text-primary">
                        {system.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-text-secondary bg-surface-light px-3 py-1.5 rounded-xl border border-border">
                    {system.summary}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {system.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-light/40 border border-border/60 text-xs text-text-secondary leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <GlassCard borderVariant="cyan" className="p-10 space-y-4">
          <h3 className="text-2xl font-display font-bold text-text-primary">
            Ready to Evaluate AeroClean AI for Your Facility?
          </h3>
          <p className="text-sm text-text-secondary max-w-xl mx-auto">
            Schedule a technical consultation with our systems engineers to calculate custom flight envelopes and architectural feasibility.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <GradientButton size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Request Technical Demo
              </GradientButton>
            </Link>
            <Link to="/estimate">
              <GradientButton variant="outline" size="lg">
                Calculate Financial Savings
              </GradientButton>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
