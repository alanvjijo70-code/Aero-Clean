import React from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { SectionHeading } from '../common/SectionHeading.js';
import {
  ShieldCheck,
  Eye,
  Route,
  CheckCircle2,
  Scan,
  Compass,
  Zap,
  Activity
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      id: 'sensors',
      title: 'Precision Without Collision',
      badge: 'Spatial Awareness',
      headline: 'Proximity & Spatial Sensors',
      description: 'Continuous spatial awareness supports controlled, millimeter-accurate positioning near building facades. Multi-frequency LiDAR and ultrasonic sensors maintain a virtual buffered standoff envelope.',
      icon: ShieldCheck,
      visual: (
        <div className="relative w-full h-36 rounded-xl bg-surface-light border border-border/60 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          {/* Animated Sensor Rings */}
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-primary/20 animate-ping absolute" />
            <div className="w-16 h-16 rounded-full border border-accent/40 animate-pulse absolute" />
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary shadow-glow-cyan">
              <Activity className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-primary">
            <span>LiDAR: 100 Hz</span>
            <span>Buffered Gap: 15 cm</span>
          </div>
        </div>
      )
    },
    {
      id: 'dirt-detection',
      title: 'See Dirt. Think Smart.',
      badge: 'Computer Vision',
      headline: 'AI Dirt Detection System',
      description: 'Computer vision identifies areas requiring different cleaning intensities. Neural networks instantly differentiate between light dust, grease, atmospheric soot, and hard mineral deposits.',
      icon: Eye,
      visual: (
        <div className="relative w-full h-36 rounded-xl bg-surface-light border border-border/60 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="grid grid-cols-3 gap-2 w-full h-full items-center">
            <div className="h-16 rounded-lg border border-status-warning/60 bg-status-warning/10 p-2 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-status-warning">DENSE DUST</span>
              <span className="text-[10px] font-bold text-text-primary">82% Grime</span>
            </div>
            <div className="h-16 rounded-lg border border-status-success/50 bg-status-success/10 p-2 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-status-success">CLEAN GLASS</span>
              <span className="text-[10px] font-bold text-text-primary">99% Clear</span>
            </div>
            <div className="h-16 rounded-lg border border-status-warning/60 bg-status-warning/10 p-2 flex flex-col justify-between">
              <span className="text-[9px] font-mono text-status-warning">MINERAL DEPOSIT</span>
              <span className="text-[10px] font-bold text-text-primary">Targeted Cycle</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 text-[9px] font-mono bg-background/80 text-accent px-1.5 py-0.5 rounded border border-primary/30">
            60 FPS Edge AI
          </div>
        </div>
      )
    },
    {
      id: 'path-tracking',
      title: 'Every Surface. Every Route.',
      badge: 'Path Planning',
      headline: 'Intelligent Path Tracking',
      description: 'Intelligent mapping tracks cleaned and uncleaned areas to organize the workflow without missing sections or redundant passes, minimizing water and battery consumption.',
      icon: Route,
      visual: (
        <div className="relative w-full h-36 rounded-xl bg-surface-light border border-border/60 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <svg className="w-full h-20 text-primary" viewBox="0 0 300 80" fill="none">
            <path
              d="M 20 20 L 280 20 L 280 40 L 20 40 L 20 60 L 280 60"
              stroke="rgba(0,217,255,0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 20 20 L 280 20 L 280 40 L 140 40"
              stroke="#00D9FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="140" cy="40" r="4" fill="#65F4FF" className="animate-ping" />
          </svg>
          <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-text-secondary">
            <span>Serpentine Grid</span>
            <span className="text-primary font-bold">15% Overlap Margin</span>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Clean. Check. Confirm.',
      badge: 'Quality Verification',
      headline: 'Post-Cleaning Optical Audit',
      description: 'Camera-based inspection evaluates the results and flags areas needing another pass. Automatic optical clarity scoring generates an immutable verification audit for facility records.',
      icon: CheckCircle2,
      visual: (
        <div className="relative w-full h-36 rounded-xl bg-surface-light border border-border/60 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-status-success/20 border-2 border-status-success flex items-center justify-center text-status-success shadow-[0_0_15px_rgba(39,229,162,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-status-success font-bold">
                AUDIT CERTIFIED
              </div>
              <div className="text-sm font-display font-bold text-text-primary">
                99.8% Optical Clarity
              </div>
              <div className="text-[10px] font-mono text-text-muted">
                Zero Streaks Detected
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Autonomous Robotics Architecture"
          badgeIcon={Scan}
          title="Intelligent Hardware & Vision."
          highlightText="Engineered for Extreme Heights."
          subtitle="Explore the four primary robotic subsystems engineered to navigate challenging high-rise architectural envelopes without human high-altitude exposure."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={feature.id} className="p-6 sm:p-8 space-y-6 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
                      {feature.badge}
                    </span>
                    <Icon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">
                      {feature.headline}
                    </h4>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subsystem Visual Graphic */}
                {feature.visual}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
