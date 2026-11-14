import React from 'react';
import { InteractiveDroneCanvas } from '../drone/InteractiveDroneCanvas.js';
import {
  Bot,
  ChevronDown,
  Layers,
  Sparkles,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  activeWorkflowStage?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeWorkflowStage = 1 }) => {
  const scrollToNarrative = () => {
    const el = document.getElementById('scroll-narrative');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFlightDemo = () => {
    const el = document.getElementById('flight-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="schematic-hero" className="relative pt-24 pb-12 sm:pb-16 flex flex-col justify-center overflow-hidden">
      {/* Background Ambience, Glow & Spatial Grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-6">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold tracking-wider uppercase shadow-sm backdrop-blur-md">
          <Bot className="w-4 h-4 text-accent animate-pulse" />
          <span>HARDWARE AVIONICS SCHEMATIC • FIRST-LOOK SPECIFICATION</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        </div>

        {/* Hero Title */}
        <div className="space-y-2 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text-primary leading-[1.15]">
            AeroClean AI Drone{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Hardware Avionics Schematic
            </span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto font-normal">
            Official engineering blueprint and component telemetry mapping for high-rise facade cleaning robotics.
          </p>
        </div>

        {/* 1. THE HARDWARE AVIONICS SCHEMATIC APPEARS FIRST */}
        <div id="drone-showcase" className="w-full max-w-5xl mx-auto pt-2">
          <InteractiveDroneCanvas
            activeStage={activeWorkflowStage}
            className="h-[520px] sm:h-[580px] lg:h-[620px]"
          />
        </div>

        {/* Scroll Guidance Prompt */}
        <div className="pt-6 flex flex-col items-center justify-center gap-3">
          <button
            onClick={scrollToNarrative}
            className="group inline-flex flex-col items-center gap-1.5 text-xs font-mono tracking-widest text-text-secondary hover:text-primary transition-all uppercase py-2 px-4 rounded-full bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span>Scroll Down to Generate Mission Briefing</span>
            </span>
            <ChevronDown className="w-4 h-4 text-accent animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
