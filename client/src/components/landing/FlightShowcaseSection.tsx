import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading.js';
import { GlassCard } from '../common/GlassCard.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Layers,
  Sparkles,
  Shield,
  Eye,
  Droplets,
  Sun,
  Activity,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const FlightShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'schematic'>('video');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const components = [
    {
      id: 1,
      name: 'Eco-Hybrid Solar Harvester',
      icon: Sun,
      color: 'text-status-warning',
      tag: 'Photovoltaic Array & Gold Dial',
      description: 'Top-mounted monocrystalline solar canopy and knurled grounding dial hub generating auxiliary trickle power for onboard computer vision processors during daytime operations.'
    },
    {
      id: 2,
      name: 'Proximity Sensors',
      icon: Activity,
      color: 'text-primary',
      tag: 'Dual Ultrasonic & LiDAR Rangers',
      description: '100 Hz high-frequency distance rangers measuring facade elevation down to ±2mm, enforcing a calibrated 15cm safety standoff buffer against skyscraper glazing.'
    },
    {
      id: 3,
      name: 'AI Dirt & Verification Camera',
      icon: Eye,
      color: 'text-accent',
      tag: '4K Multispectral Vision Turret',
      description: 'Dual-optical stereo system with neural inferencing that classifies dirt, airborne soot, and hard-water deposits before washing, then signs off on a 99.8% clean audit.'
    },
    {
      id: 4,
      name: 'Finishing Squeegee',
      icon: SlidersHorizontal,
      color: 'text-status-success',
      tag: 'Hydrophobic Silicone Extraction Blade',
      description: 'Medical-grade beveled silicone blade paired with dual forward buffer standoff skids, wiping away residual fluid into suction channels for an optical streak-free finish.'
    },
    {
      id: 5,
      name: 'Cleaning Pad',
      icon: Sparkles,
      color: 'text-accent',
      tag: 'Active Oscillating Microfiber Scrub',
      description: 'Underbody high-density microfiber scrub pad with spring-loaded suspension that micro-oscillates at 300 RPM under 12N contact force to remove stubborn grime without scratching.'
    },
    {
      id: 6,
      name: 'Ground-Fed Water Inlet & Fluid System',
      icon: Droplets,
      color: 'text-secondary',
      tag: '4.5 Bar Umbilical Delivery Tether',
      description: 'Continuous side-mounted acrylic pressure manifold receiving deionized, mineral-free cleaning solution through transparent anti-kink polyurethane coiled supply loops.'
    }
  ];

  return (
    <section id="flight-showcase" className="relative py-20 lg:py-28 overflow-hidden scroll-mt-24">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Autonomous Flight & Avionics Architecture"
          badgeIcon={Play}
          title="Watch Autonomous Flight &"
          highlightText="Engineering Schematic."
          subtitle="Explore the live high-altitude flight video and annotated hardware architecture of the AeroClean AI skyscraper facade maintenance drone."
          className="mb-10 text-center"
        />

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-surface/85 backdrop-blur-md border border-border shadow-lg">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-primary to-accent text-background font-bold shadow-glow-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Autonomous Flight Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('schematic')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'schematic'
                  ? 'bg-gradient-to-r from-primary to-accent text-background font-bold shadow-glow-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Annotated Hardware Schematic</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Flight Demo Video */}
        {activeTab === 'video' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl bg-surface/90 border border-primary/30 shadow-[0_0_50px_rgba(0,217,255,0.2)] overflow-hidden group">
              {/* Telemetry Header Bar */}
              <div className="absolute top-0 inset-x-0 z-20 px-4 sm:px-6 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-danger animate-ping" />
                  <span className="font-mono text-xs uppercase tracking-widest text-text-primary font-bold">
                    LIVE FLIGHT TELEMETRY FEED • 4K
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-accent">
                  <span>STANDOFF: 15.0 CM</span>
                  <span>•</span>
                  <span>WIND: 18 KM/H COMPENSATED</span>
                  <span>•</span>
                  <span>SURFACE: GLASS</span>
                </div>
              </div>

              {/* Video Element */}
              <div className="relative aspect-video w-full bg-black/90 flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/videos/drone-flight-demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Center Click Overlay to Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity focus:outline-none"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <div className="p-4 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 text-accent shadow-glow-cyan">
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </div>
                </button>
              </div>

              {/* Bottom Custom Playback Bar */}
              <div className="px-5 py-3.5 bg-surface-secondary/95 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-xl bg-surface hover:bg-surface-light border border-border text-text-primary hover:text-primary transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-surface hover:bg-surface-light border border-border text-text-primary hover:text-primary transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="text-xs font-mono text-text-secondary hidden sm:block">
                    AeroClean AI Autonomous Drone Flight Demonstration
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-status-success uppercase px-2.5 py-0.5 rounded-full bg-status-success/10 border border-status-success/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    AUTOPILOT LOCKED
                  </span>

                  <button
                    onClick={handleFullscreen}
                    className="p-2 rounded-xl bg-surface hover:bg-surface-light border border-border text-text-primary hover:text-primary transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Labeled Engineering Schematic */}
        {activeTab === 'schematic' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl mx-auto space-y-8"
          >
            {/* Schematic Image Frame */}
            <div className="relative rounded-3xl bg-surface/90 border border-primary/30 shadow-[0_0_50px_rgba(0,217,255,0.2)] overflow-hidden">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black/60 flex items-center justify-center">
                <img
                  src="/images/drone-schematic.jpg"
                  alt="AeroClean AI Drone Annotated Hardware Schematic"
                  className="w-full h-full object-cover"
                />

                {/* Subtle Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>

              {/* Image Footer Caption */}
              <div className="px-6 py-4 bg-surface-secondary/95 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="font-mono text-xs text-text-primary font-bold uppercase tracking-wider">
                    Official Avionics Blueprint & Component Map
                  </span>
                </div>
                <div className="text-xs font-mono text-text-muted">
                  Click any component card below to review its engineering specifications.
                </div>
              </div>
            </div>

            {/* 6 Interactive Component Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((comp) => {
                const isSelected = selectedComponent === comp.id;
                return (
                  <GlassCard
                    key={comp.id}
                    borderVariant={isSelected ? 'cyan' : 'default'}
                    className={`p-5 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-surface-light border-primary shadow-glow-cyan scale-[1.02]'
                        : 'hover:border-primary/40'
                    }`}
                    onClick={() => setSelectedComponent(isSelected ? null : comp.id)}
                  >
                    <div className="flex items-start gap-3.5 mb-2.5">
                      <div className={`p-2.5 rounded-xl bg-surface border border-border shrink-0 ${comp.color}`}>
                        <comp.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-accent tracking-wider block">
                          {comp.tag}
                        </span>
                        <h4 className="text-sm font-display font-bold text-text-primary leading-tight">
                          {comp.name}
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {comp.description}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
