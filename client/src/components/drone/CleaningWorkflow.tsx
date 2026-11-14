import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { GradientButton } from '../common/GradientButton.js';
import {
  Scan,
  Sparkles,
  Droplets,
  RotateCw,
  SlidersHorizontal,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CleaningWorkflow: React.FC<{
  onStageChange?: (stage: number) => void;
}> = ({ onStageChange }) => {
  const [activeStage, setActiveStage] = useState(1);

  const stages = [
    {
      id: 1,
      name: 'Scan',
      title: 'Spatial Surface & Facade Mapping',
      icon: Scan,
      description: 'Continuous 3D LiDAR and stereo cameras map glass boundaries, structural mullions, and architectural curvature to calculate millimeter-level flight waypoints.',
      mechanism: '100 Hz LiDAR ranging + optical optical flow tracking',
      visualState: 'scanning'
    },
    {
      id: 2,
      name: 'Detect',
      title: 'AI Dirt Density Classification',
      icon: Sparkles,
      description: 'The neural computer vision model segments the glass into clean vs contaminated zones, distinguishing between dust, organic buildup, and hard mineral deposits.',
      mechanism: 'Edge AI inferencing running 60 FPS convolutional models',
      visualState: 'detecting'
    },
    {
      id: 3,
      name: 'Apply',
      title: 'Electrostatic Surfactant Atomization',
      icon: Droplets,
      description: 'Micro-nozzles atomize deionized, eco-certified cleaning solution at 4.5 bar, creating an electrostatic mist that adheres to the glass without wasteful dripping.',
      mechanism: 'Deionized reverse-osmosis solution with closed-loop pressure valves',
      visualState: 'applying'
    },
    {
      id: 4,
      name: 'Wipe',
      title: 'Active Soft-Pad Grime Emulsification',
      icon: RotateCw,
      description: 'Counter-oscillating microfiber pads scrub away stubborn grime. Pressure-sensitive load cells ensure optimal contact without scratching delicate coatings.',
      mechanism: 'Dynamic contact pressure regulator (constant 12N force)',
      visualState: 'wiping'
    },
    {
      id: 5,
      name: 'Finish',
      title: 'Hydrophobic Polymer Squeegee Pass',
      icon: SlidersHorizontal,
      description: 'A custom-profiled silicone squeegee blade with micro-vacuum suction removes liquid and particulate, delivering a streak-free optical finish.',
      mechanism: 'Negative-pressure suction rail with hydrophobic silicone blade',
      visualState: 'finishing'
    },
    {
      id: 6,
      name: 'Verify',
      title: 'Multispectral Post-Cleaning Audit',
      icon: CheckCircle2,
      description: 'The secondary verification camera inspects the cleaned surface for residual spots. If any quadrant falls below 98% clarity, an automated re-clean is triggered.',
      mechanism: 'Optical clarity certification report logged to building profile',
      visualState: 'verified'
    }
  ];

  const handleStageSelect = (id: number) => {
    setActiveStage(id);
    if (onStageChange) onStageChange(id);
  };

  const handlePrev = () => {
    const prev = activeStage > 1 ? activeStage - 1 : stages.length;
    handleStageSelect(prev);
  };

  const handleNext = () => {
    const next = activeStage < stages.length ? activeStage + 1 : 1;
    handleStageSelect(next);
  };

  const currentStage = stages[activeStage - 1];

  return (
    <div className="w-full space-y-8">
      {/* Stage Navigation Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStage;
          const isCompleted = stage.id < activeStage;

          return (
            <button
              key={stage.id}
              onClick={() => handleStageSelect(stage.id)}
              className={`flex-1 min-w-[120px] p-3 rounded-2xl border transition-all text-left group ${
                isActive
                  ? 'bg-primary/15 border-primary shadow-glow-cyan'
                  : 'bg-surface border-border hover:border-primary/40 hover:bg-surface-light'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-text-muted">
                  Stage 0{stage.id}
                </span>
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-status-success" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary transition-colors'}`} />
                )}
              </div>
              <p className={`text-xs font-semibold ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                {stage.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Demonstration Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Animated Glass Simulation Screen */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] rounded-3xl bg-surface border border-border overflow-hidden p-6 flex flex-col justify-between">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40" />

            {/* Glass Pane Simulation Frame */}
            <div className="relative w-full h-full rounded-2xl border-2 border-primary/30 bg-surface-glass backdrop-blur-md overflow-hidden flex items-center justify-center shadow-inner">
              {/* Stage Visual States */}
              {currentStage.visualState === 'scanning' && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10 animate-scan" />
                  <div className="font-mono text-xs text-primary bg-background/80 px-4 py-2 rounded-xl border border-primary/40 flex items-center gap-2">
                    <Scan className="w-4 h-4 animate-spin text-accent" />
                    <span>LiDAR GRID: 15.2cm STANDOFF LOCKED</span>
                  </div>
                </div>
              )}

              {currentStage.visualState === 'detecting' && (
                <div className="relative w-full h-full p-8 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="rounded-xl border border-status-warning/60 bg-status-warning/10 p-3 flex flex-col justify-between animate-pulse">
                      <span className="text-[10px] font-mono text-status-warning">ZONE A: DUST 84%</span>
                      <span className="text-xs font-bold text-text-primary">HIGH INTENSITY</span>
                    </div>
                    <div className="rounded-xl border border-status-success/50 bg-status-success/10 p-3 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-status-success">ZONE B: LIGHT 22%</span>
                      <span className="text-xs font-bold text-text-primary">STANDARD PASS</span>
                    </div>
                    <div className="rounded-xl border border-status-warning/60 bg-status-warning/10 p-3 flex flex-col justify-between animate-pulse">
                      <span className="text-[10px] font-mono text-status-warning">ZONE C: GRIME 91%</span>
                      <span className="text-xs font-bold text-text-primary">DUAL CYCLE REQ</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStage.visualState === 'applying' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-secondary/15 flex items-center justify-around">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="w-1.5 h-full bg-gradient-to-b from-primary via-accent to-transparent opacity-60 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                  <div className="font-mono text-xs text-accent bg-background/90 px-4 py-2 rounded-xl border border-primary/50 relative z-10 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary animate-bounce" />
                    <span>SURFACTANT ATOMIZATION: 4.5 BAR</span>
                  </div>
                </div>
              )}

              {currentStage.visualState === 'wiping' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                    <div className="w-3/4 h-24 rounded-2xl bg-gradient-to-r from-secondary/40 via-primary/50 to-secondary/40 border border-primary animate-spin-slow flex items-center justify-center">
                      <span className="text-xs font-mono text-white tracking-widest uppercase">300 RPM MICRO-OSCILLATION</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStage.visualState === 'finishing' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute left-0 right-0 h-3 bg-status-success shadow-[0_0_20px_#27E5A2] animate-bounce" />
                  <div className="font-mono text-xs text-status-success bg-background/90 px-4 py-2 rounded-xl border border-status-success/40 relative z-10 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>SILICONE HYDRO-EXTRACTION: ZERO STREAKS</span>
                  </div>
                </div>
              )}

              {currentStage.visualState === 'verified' && (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-status-success/20 border border-status-success/40 flex items-center justify-center text-status-success mb-3 animate-pulse">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-text-primary">
                    100% SURFACE CLARITY VERIFIED
                  </h4>
                  <p className="text-xs font-mono text-status-success mt-1">
                    AUDIT SIGNATURE: SHA256-AERO-994
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 flex items-center justify-between pt-4">
              <span className="text-xs font-mono text-text-muted">
                Step {activeStage} of {stages.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Stage Breakdown & Engineering Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase mb-3">
              <currentStage.icon className="w-3.5 h-3.5" />
              <span>Phase 0{currentStage.id} Mechanism</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
              {currentStage.title}
            </h3>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              {currentStage.description}
            </p>
          </div>

          <GlassCard borderVariant="subtle" className="p-4 bg-surface-light/50">
            <h5 className="text-xs font-mono uppercase text-accent tracking-wider mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              Robotics Subsystem Telemetry
            </h5>
            <p className="text-xs text-text-secondary font-mono leading-relaxed">
              {currentStage.mechanism}
            </p>
          </GlassCard>

          {/* Advantages List */}
          <div className="space-y-2.5 pt-2">
            <h5 className="text-xs font-display font-semibold uppercase tracking-wider text-text-primary">
              Hybrid Cleaning Advantages:
            </h5>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Handles loose airborne particulate and stubborn calcified residue with equal precision.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Zero streaks or residual evaporation spots using active silicone extraction.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Dynamic intensity scaling prevents premature brush wear and glass fatigue.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Multispectral camera audits produce verifiable quality assurance reports.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
