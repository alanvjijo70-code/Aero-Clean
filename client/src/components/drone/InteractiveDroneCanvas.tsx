import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, ContactShadows } from '@react-three/drei';
import { DroneModel } from './DroneModel.js';
import { DroneWebGLFallback } from './DroneWebGLFallback.js';
import { LoadingSpinner } from '../common/LoadingSpinner.js';
import {
  RotateCcw,
  Play,
  Pause,
  ShieldCheck,
  Eye,
  Sparkles,
  CheckCircle2,
  Maximize2,
  Sun,
  Droplets,
  Activity,
  SlidersHorizontal,
  X,
  Layers,
  Box
} from 'lucide-react';

interface InteractiveDroneCanvasProps {
  className?: string;
  activeStage?: number;
}

export const InteractiveDroneCanvas: React.FC<InteractiveDroneCanvasProps> = ({
  className = '',
  activeStage = 1
}) => {
  const [viewMode, setViewMode] = useState<'schematic' | '3d'>('schematic');
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const controlsRef = useRef<any>(null);

  const schematicComponents: Record<number, {
    title: string;
    tag: string;
    description: string;
    spec: string;
    icon: any;
    color: string;
  }> = {
    1: {
      title: 'Eco-Hybrid Solar Harvester',
      tag: 'Photovoltaic Array & Gold Dial',
      description: 'Top-mounted monocrystalline solar canopy and knurled grounding dial hub generating auxiliary trickle power for onboard computer vision processors during daytime operations.',
      spec: 'Auxiliary trickle charge • Monocrystalline PV cell • Knurled grounding hub',
      icon: Sun,
      color: 'text-status-warning'
    },
    2: {
      title: 'Proximity Sensors',
      tag: 'Dual Ultrasonic & LiDAR Rangers',
      description: '100 Hz high-frequency distance rangers measuring facade elevation down to ±2mm, enforcing a calibrated 15cm safety standoff buffer against skyscraper glazing.',
      spec: '100 Hz refresh rate • ±2mm precision • 15cm calibrated buffer',
      icon: Activity,
      color: 'text-primary'
    },
    3: {
      title: 'AI Dirt & Verification Camera',
      tag: '4K Multispectral Vision Turret',
      description: 'Dual-optical stereo system with neural inferencing that classifies dirt, airborne soot, and hard-water deposits before washing, then signs off on a 99.8% clean audit.',
      spec: '4K dual stereo optics • 60 FPS neural inferencing • 99.8% audit accuracy',
      icon: Eye,
      color: 'text-accent'
    },
    4: {
      title: 'Finishing Squeegee',
      tag: 'Hydrophobic Silicone Extraction Blade',
      description: 'Medical-grade beveled silicone blade paired with dual forward buffer standoff skids, wiping away residual fluid into suction channels for an optical streak-free finish.',
      spec: 'Hydrophobic silicone • Forward standoff skids • Streak-free edge',
      icon: SlidersHorizontal,
      color: 'text-status-success'
    },
    5: {
      title: 'Cleaning Pad',
      tag: 'Active Oscillating Microfiber Scrub',
      description: 'Underbody high-density microfiber scrub pad with spring-loaded suspension that micro-oscillates at 300 RPM under 12N contact force to remove stubborn grime without scratching.',
      spec: '300 RPM oscillation • 12N contact force • Scratch-free microfibers',
      icon: Sparkles,
      color: 'text-accent'
    },
    6: {
      title: 'Ground-Fed Water Inlet & Fluid System',
      tag: '4.5 Bar Umbilical Delivery Tether',
      description: 'Continuous side-mounted acrylic pressure manifold receiving deionized, mineral-free cleaning solution through transparent anti-kink polyurethane coiled supply loops.',
      spec: '4.5 Bar continuous pressure • Deionized solution • Anti-kink tether',
      icon: Droplets,
      color: 'text-secondary'
    }
  };

  const hotspotData: Record<number, { title: string; subtitle: string; description: string; spec: string; icon: any }> = {
    1: {
      title: 'Distance & Proximity Sensors',
      subtitle: '360° LiDAR & Ultrasonic Envelope',
      description: 'Advanced proximity sensors continuously measure the distance between the drone and the building facade, supporting collision-aware positioning and keeping a safe 15cm standoff buffer.',
      spec: '100 Hz refresh rate • ±2mm precision • 360° obstacle telemetry',
      icon: ShieldCheck
    },
    2: {
      title: 'AI Dirt Detection Camera',
      subtitle: 'Multispectral Computer Vision Turret',
      description: 'An AI-powered vision system identifies dirty glass patches, classifies organic vs calcified contaminants, and helps prioritize localized cleaning intensity.',
      spec: '4K dual stereo optics • 60 FPS neural inferencing • Real-time heatmaps',
      icon: Eye
    },
    3: {
      title: 'Hybrid Cleaning Module',
      subtitle: 'Spray + Active Microfiber + Squeegee',
      description: 'An integrated cleaning assembly combines high-pressure atomized deionized liquid application, counter-oscillating soft microfiber wiping, and streak-free squeegee finishing.',
      spec: '4.5 bar atomization • 300 RPM roller • Food-grade silicone blade',
      icon: Sparkles
    },
    4: {
      title: 'Verification Camera',
      subtitle: 'Multispectral Post-Clean Inspection',
      description: 'A secondary vision system evaluates cleaned areas, logs surface clarity metrics, and flags regions requiring an additional automated pass or manual audit.',
      spec: 'Optical clarity grading • 99.4% streak detection • Immutable audit logs',
      icon: CheckCircle2
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setAutoRotate(true);
      setSelectedHotspot(null);
    }
  };

  const activeHotspotInfo = selectedHotspot ? hotspotData[selectedHotspot] : null;
  const activeComponentInfo = selectedComponent ? schematicComponents[selectedComponent] : null;
  const heightClass = className?.includes('h-') ? '' : 'h-[580px]';

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl bg-surface/90 border border-primary/30 shadow-[0_0_50px_rgba(0,217,255,0.18)] overflow-hidden select-none group ${className}`}>
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      {/* Aerospace Corner HUD Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-accent/60 pointer-events-none z-30" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-accent/60 pointer-events-none z-30" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-accent/60 pointer-events-none z-30" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-accent/60 pointer-events-none z-30" />

      {/* Top Left Title Badge */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/30 flex items-center gap-1.5 shadow-sm backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>{viewMode === 'schematic' ? 'Hardware Avionics Schematic' : 'Interactive 3D Robotics Twin'}</span>
        </span>
      </div>

      {/* Top Right Controls & View Switcher */}
      <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-surface/90 backdrop-blur-md p-1 rounded-xl border border-border shadow-md">
          <button
            onClick={() => setViewMode('schematic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'schematic'
                ? 'bg-gradient-to-r from-primary to-accent text-background font-bold shadow-glow-cyan'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
            title="Hardware Schematic View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schematic</span>
          </button>

          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-primary to-accent text-background font-bold shadow-glow-cyan'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
            title="Interactive 3D Model View"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Twin</span>
          </button>

          {viewMode === 'schematic' ? (
            <button
              onClick={() => setIsZoomOpen(true)}
              className="p-1.5 rounded-lg text-xs font-mono text-text-secondary hover:text-primary hover:bg-white/5 transition-colors"
              title="Expand Full Resolution"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                  autoRotate
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={autoRotate ? 'Pause Rotation' : 'Resume Rotation'}
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetCamera}
                className="p-1.5 rounded-lg text-xs font-mono text-text-secondary hover:text-primary transition-colors"
                title="Reset Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* VIEW 1: Hardware Schematic Image (Default Hero Display) */}
      {viewMode === 'schematic' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
          {/* Main Drone Image Container */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="relative w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden rounded-2xl group/img"
          >
            <img
              src="/images/drone-schematic.jpg"
              alt="AeroClean AI Drone Hardware Schematic with Component Callouts"
              className="w-full h-full object-contain max-h-[500px] transition-transform duration-500 group-hover/img:scale-[1.02]"
            />

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Hover Prompt */}
            <div className="absolute bottom-16 right-4 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-text-secondary opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
              <Maximize2 className="w-3 h-3 text-accent" />
              <span>Click image to expand 4K</span>
            </div>
          </div>

          {/* Interactive Component Quick Chips */}
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-5 z-20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {Object.entries(schematicComponents).map(([key, comp]) => {
              const id = Number(key);
              const isSelected = selectedComponent === id;
              return (
                <button
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComponent(isSelected ? null : id);
                  }}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-mono transition-all flex items-center gap-1.5 border backdrop-blur-md ${
                    isSelected
                      ? 'bg-primary text-background font-bold border-primary shadow-glow-cyan scale-105'
                      : 'bg-surface/85 text-text-secondary border-border/80 hover:text-text-primary hover:border-primary/50'
                  }`}
                >
                  <comp.icon className="w-3 h-3" />
                  <span>{comp.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Component Telemetry Drawer */}
          {activeComponentInfo && (
            <div className="absolute bottom-16 left-4 right-4 sm:left-6 sm:right-6 sm:max-w-md z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border-primary/50 shadow-2xl relative bg-surface-secondary/95 backdrop-blur-xl">
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="absolute top-3 right-3 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-2.5 rounded-xl bg-surface border border-border shrink-0 ${activeComponentInfo.color}`}>
                    <activeComponentInfo.icon className="w-5 h-5" />
                  </div>
                  <div className="pr-6">
                    <span className="text-[10px] font-mono uppercase text-accent tracking-wider block">
                      {activeComponentInfo.tag}
                    </span>
                    <h4 className="text-sm sm:text-base font-display font-bold text-text-primary leading-tight">
                      {activeComponentInfo.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {activeComponentInfo.description}
                </p>
                <div className="p-2 rounded-lg bg-surface border border-border text-[11px] font-mono text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse shrink-0" />
                  <span>{activeComponentInfo.spec}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Interactive 3D Model Canvas */}
      {viewMode === '3d' && (
        <div className="w-full h-full relative">
          {webGlSupported ? (
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <LoadingSpinner size="lg" text="Loading 3D Aerospace Model..." />
                </div>
              }
            >
              <Canvas
                shadows
                camera={{ position: [3.2, 1.8, 3.6], fov: 45 }}
                onError={() => setWebGlSupported(false)}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <ambientLight intensity={0.8} />
                <directionalLight position={[6, 8, 5]} intensity={1.5} castShadow />
                <pointLight position={[-4, -2, -3]} intensity={1.2} color="#00D9FF" />
                <pointLight position={[3, 3, -4]} intensity={0.8} color="#1677FF" />

                <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
                  <DroneModel
                    selectedHotspot={selectedHotspot}
                    onSelectHotspot={(id) => {
                      setSelectedHotspot(id);
                      setAutoRotate(false);
                    }}
                    activeStage={activeStage}
                  />
                </Float>

                <ContactShadows position={[0, -1.4, 0]} opacity={0.65} scale={8} blur={2.4} far={4} color="#00D9FF" />
                <Stars radius={40} depth={30} count={600} factor={3} saturation={0} fade speed={1} />

                <OrbitControls
                  ref={controlsRef}
                  enableDamping
                  dampingFactor={0.06}
                  minDistance={2.0}
                  maxDistance={7.5}
                  maxPolarAngle={Math.PI / 1.6}
                  autoRotate={autoRotate}
                  autoRotateSpeed={0.9}
                />
              </Canvas>
            </Suspense>
          ) : (
            <DroneWebGLFallback
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(id) => setSelectedHotspot(id)}
            />
          )}

          {activeHotspotInfo && (
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="glass-panel p-5 rounded-2xl border-primary/50 shadow-2xl relative">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute top-3 right-3 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/30 shrink-0">
                    <activeHotspotInfo.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-accent tracking-wider">
                      Component Telemetry #{selectedHotspot}
                    </span>
                    <h4 className="text-base font-display font-bold text-text-primary leading-tight">
                      {activeHotspotInfo.title}
                    </h4>
                    <p className="text-xs text-text-muted font-mono">{activeHotspotInfo.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {activeHotspotInfo.description}
                </p>
                <div className="p-2 rounded-lg bg-surface-light border border-border text-[11px] font-mono text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse shrink-0" />
                  <span>{activeHotspotInfo.spec}</span>
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-5 z-20 hidden md:flex items-center gap-1.5 bg-surface/85 backdrop-blur-md p-1.5 rounded-2xl border border-border">
            {[1, 2, 3, 4].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedHotspot(selectedHotspot === id ? null : id);
                  setAutoRotate(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  selectedHotspot === id
                    ? 'bg-primary text-background font-bold shadow-glow-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                Node {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox 4K Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[90vh] bg-surface rounded-3xl border border-primary/40 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 bg-surface-secondary border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  AeroClean AI Drone Official Avionics Schematic • 4K
                </span>
              </div>

              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-2 rounded-xl bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-8 flex items-center justify-center bg-black/60 overflow-auto">
              <img
                src="/images/drone-schematic.jpg"
                alt="AeroClean AI Drone Schematic Blueprint"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
