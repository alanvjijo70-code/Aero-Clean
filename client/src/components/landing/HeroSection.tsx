import React from 'react';
import { Link } from 'react-router-dom';
import { GradientButton } from '../common/GradientButton.js';
import { InteractiveDroneCanvas } from '../drone/InteractiveDroneCanvas.js';
import {
  ArrowRight,
  Bot,
  Sparkles,
  ChevronDown,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  activeWorkflowStage?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeWorkflowStage = 1 }) => {
  const scrollToDrone = () => {
    const el = document.getElementById('drone-showcase');
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

  const scrollToContent = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] pt-28 pb-16 flex flex-col justify-center overflow-hidden">
      {/* Background Glow & Spatial Grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Typography (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase shadow-sm">
              <Bot className="w-4 h-4 text-accent animate-pulse" />
              <span>AUTONOMOUS CLEANING INTELLIGENCE</span>
            </div>

            {/* Large Futuristic Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-text-primary leading-[1.1]">
              Revolutionizing High-Rise Maintenance with{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Autonomous Drone Intelligence.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl font-normal">
              Redefining exterior building maintenance through intelligent sensing, precision cleaning, and autonomous robotics. Engineered to eliminate extreme-height worker exposure while dramatically cutting turnaround cycles.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <GradientButton
                size="lg"
                onClick={scrollToDrone}
                icon={<Sparkles className="w-4 h-4 text-background" />}
              >
                Explore 3D Drone Model
              </GradientButton>

              <button
                type="button"
                onClick={scrollToFlightDemo}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface/85 hover:bg-surface-light border border-primary/40 hover:border-primary text-text-primary text-sm font-semibold transition-all shadow-sm hover:shadow-glow-cyan"
              >
                <Play className="w-4 h-4 text-accent fill-accent" />
                <span>Watch Flight Demo</span>
              </button>

              <Link to="/contact">
                <GradientButton
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Request a Demo
                </GradientButton>
              </Link>
            </div>

            {/* Floating Statistics (Section 21.5) */}
            <div className="pt-6 border-t border-border/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-primary">
                    100%
                  </div>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    Human-Free Objective*
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-accent">
                    3x
                  </div>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    Turnaround Target*
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-primary">
                    AI
                  </div>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    Multispectral Vision
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-accent">
                    Smart
                  </div>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    Hybrid Cleaning Cycle
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-text-muted font-mono mt-3">
                *Illustrative product concept targets based on simulation models. Not verified performance guarantees.
              </p>
            </div>
          </div>

          {/* Right Hero 3D Drone Showcase (6 cols) */}
          <div id="drone-showcase" className="lg:col-span-6 relative">
            <InteractiveDroneCanvas activeStage={activeWorkflowStage} />
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={scrollToContent}
          className="text-text-muted hover:text-primary transition-colors flex flex-col items-center gap-1 text-xs font-mono uppercase tracking-widest animate-bounce"
        >
          <span>Explore Platform</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
