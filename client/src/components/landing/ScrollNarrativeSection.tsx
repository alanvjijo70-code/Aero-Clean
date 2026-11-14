import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll } from 'framer-motion';
import { GradientButton } from '../common/GradientButton.js';
import {
  ArrowRight,
  Bot,
  Sparkles,
  Play,
  Layers,
  ChevronDown,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface ScrollNarrativeSectionProps {
  onScrollToTop?: () => void;
}

export const ScrollNarrativeSection: React.FC<ScrollNarrativeSectionProps> = ({ onScrollToTop }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-10% 0px -20% 0px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const fullHeadline = "Revolutionizing High-Rise Maintenance with Autonomous Drone Intelligence.";
  const fullParagraph = "Redefining exterior building maintenance through intelligent sensing, precision cleaning, and autonomous robotics. Engineered to eliminate extreme-height worker exposure while dramatically cutting turnaround cycles.";

  const [typedHeadline, setTypedHeadline] = useState('');
  const [typedParagraph, setTypedParagraph] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  // Progressive Typewriter Generation as user scrolls into view
  useEffect(() => {
    if (!hasStarted) return;

    let headlineIndex = 0;
    let paragraphIndex = 0;

    setTypedHeadline('');
    setTypedParagraph('');
    setIsTypingDone(false);

    // Headline typing speed
    const headlineInterval = setInterval(() => {
      if (headlineIndex < fullHeadline.length) {
        setTypedHeadline(fullHeadline.slice(0, headlineIndex + 1));
        headlineIndex++;
      } else {
        clearInterval(headlineInterval);

        // Once headline completes, stream in the supporting narrative
        const paragraphInterval = setInterval(() => {
          if (paragraphIndex < fullParagraph.length) {
            setTypedParagraph(fullParagraph.slice(0, paragraphIndex + 1));
            paragraphIndex++;
          } else {
            clearInterval(paragraphInterval);
            setIsTypingDone(true);
          }
        }, 12);
      }
    }, 22);

    return () => {
      clearInterval(headlineInterval);
    };
  }, [hasStarted]);

  const scrollToFlightDemo = () => {
    const el = document.getElementById('flight-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSchematic = () => {
    const el = document.getElementById('schematic-hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onScrollToTop) {
      onScrollToTop();
    }
  };

  const stats = [
    { value: '100%', label: 'Human-Free Objective*', sub: 'Zero Fall Hazard Exposure', color: 'text-primary' },
    { value: '3x', label: 'Turnaround Target*', sub: 'Accelerated Cleaning Cycles', color: 'text-accent' },
    { value: 'AI 4K', label: 'Multispectral Vision', sub: 'Neural Dirt & Audit Optics', color: 'text-primary' },
    { value: 'Smart', label: 'Hybrid Cleaning Cycle', sub: 'Spray + Oscillate + Squeegee', color: 'text-accent' }
  ];

  return (
    <section
      ref={containerRef}
      id="scroll-narrative"
      className="relative py-20 lg:py-28 overflow-hidden scroll-mt-24"
    >
      {/* Background Ambience & Spatial Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Scroll-Triggered Terminal Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-semibold tracking-wider uppercase shadow-sm backdrop-blur-md"
          >
            <Terminal className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>[TELEMETRY ENGAGED] SYSTEM BRIEFING GENERATED VIA SCROLL</span>
            <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
          </motion.div>

          {/* Dynamically Generated Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text-primary leading-[1.15] min-h-[90px] sm:min-h-[110px] flex items-center justify-center">
            <span>
              {typedHeadline.split('Autonomous Drone Intelligence.').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Autonomous Drone Intelligence.
                    </span>
                  )}
                </React.Fragment>
              ))}
              {/* Blinking Cyan Terminal Cursor */}
              {!isTypingDone && (
                <span className="inline-block w-2.5 h-8 sm:h-10 ml-1.5 bg-accent animate-pulse align-middle" />
              )}
            </span>
          </h2>

          {/* Dynamically Generated Narrative Paragraph */}
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl mx-auto font-normal min-h-[60px]">
            {typedParagraph}
            {typedParagraph.length > 0 && !isTypingDone && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-primary/70 animate-pulse align-middle" />
            )}
          </p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTypingDone || typedHeadline.length > 30 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <GradientButton
              size="lg"
              onClick={scrollToSchematic}
              icon={<Layers className="w-4 h-4 text-background" />}
            >
              Review Schematic Architecture
            </GradientButton>

            <button
              type="button"
              onClick={scrollToFlightDemo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface/85 hover:bg-surface-light border border-primary/40 hover:border-primary text-text-primary text-sm font-semibold transition-all shadow-sm hover:shadow-glow-cyan"
            >
              <Play className="w-4 h-4 text-accent fill-accent" />
              <span>Watch Live Flight Demo</span>
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
          </motion.div>

          {/* 4 Generated Metric Counter Cards */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isTypingDone || typedHeadline.length > 40 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="pt-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface/80 backdrop-blur-md border border-border/80 text-left hover:border-primary/40 transition-all duration-300 shadow-md group"
                >
                  <div className={`text-3xl sm:text-4xl font-display font-black ${stat.color} tracking-tight group-hover:scale-105 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono font-bold text-text-primary mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-text-muted font-mono mt-4 text-center">
              *Illustrative product concept targets based on simulation models. Zero-fall risk applies to human facade workers replaced by autonomous robotics.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
