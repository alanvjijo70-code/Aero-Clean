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
  Info,
  X
} from 'lucide-react';

interface InteractiveDroneCanvasProps {
  className?: string;
  activeStage?: number;
}

export const InteractiveDroneCanvas: React.FC<InteractiveDroneCanvasProps> = ({
  className = '',
  activeStage = 1
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const controlsRef = useRef<any>(null);

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
  const heightClass = className?.includes('h-') ? '' : 'h-[580px]';

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl bg-surface/85 border border-border overflow-hidden select-none ${className}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          Interactive 3D Robotics Twin
        </span>
      </div>

      {/* Top Right Canvas Controls */}
      <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
            autoRotate
              ? 'bg-primary/20 text-accent border-primary/40'
              : 'bg-surface text-text-secondary border-border hover:text-text-primary'
          }`}
          title={autoRotate ? 'Pause Auto Rotation' : 'Resume Auto Rotation'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{autoRotate ? 'Orbiting' : 'Paused'}</span>
        </button>

        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl text-xs font-mono bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-colors flex items-center gap-1.5"
          title="Reset Camera Framing"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Main 3D Canvas with WebGL Error Catching */}
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
            {/* Ambient & Directional Aerospace Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[6, 8, 5]} intensity={1.5} castShadow />
            <pointLight position={[-4, -2, -3]} intensity={1.2} color="#00D9FF" />
            <pointLight position={[3, 3, -4]} intensity={0.8} color="#1677FF" />

            {/* Drone in Floating Physics Container */}
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

            {/* Ground Shadow & Distant Stars */}
            <ContactShadows position={[0, -1.4, 0]} opacity={0.65} scale={8} blur={2.4} far={4} color="#00D9FF" />
            <Stars radius={40} depth={30} count={600} factor={3} saturation={0} fade speed={1} />

            {/* Orbit Controls */}
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

      {/* Floating Active Hotspot Info Card */}
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

      {/* Bottom Hint / Selector Buttons */}
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
  );
};
