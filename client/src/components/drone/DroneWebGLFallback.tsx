import React from 'react';
import { ShieldCheck, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

interface DroneWebGLFallbackProps {
  selectedHotspot: number | null;
  onSelectHotspot: (id: number) => void;
}

export const DroneWebGLFallback: React.FC<DroneWebGLFallbackProps> = ({
  selectedHotspot,
  onSelectHotspot
}) => {
  const hotspots = [
    {
      id: 1,
      x: '50%',
      y: '22%',
      title: 'Distance & Proximity Sensors',
      description: 'Continuous spatial awareness and LiDAR ranging maintain calibrated facade standoff margins.',
      icon: ShieldCheck
    },
    {
      id: 2,
      x: '50%',
      y: '38%',
      title: 'AI Dirt Detection Camera',
      description: 'Dual multispectral computer vision cameras classify dirt thickness and moisture levels.',
      icon: Eye
    },
    {
      id: 3,
      x: '50%',
      y: '68%',
      title: 'Hybrid Cleaning Module',
      description: 'Integrated spray atomization, active micro-oscillation wiping, and silicone squeegee blade.',
      icon: Sparkles
    },
    {
      id: 4,
      x: '50%',
      y: '82%',
      title: 'Verification Camera',
      description: 'Downward optical audit sensor certifies surface clarity and flags residual streaks.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="relative w-full h-[520px] rounded-3xl bg-surface/80 border border-border overflow-hidden flex items-center justify-center p-6">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Stylized Vector Drone Schematic */}
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-primary drop-shadow-[0_0_20px_rgba(0,217,255,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Protective Perimeter Rings */}
          <circle cx="120" cy="120" r="70" stroke="rgba(0,217,255,0.4)" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="380" cy="120" r="70" stroke="rgba(0,217,255,0.4)" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="120" cy="380" r="70" stroke="rgba(0,217,255,0.4)" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="380" cy="380" r="70" stroke="rgba(0,217,255,0.4)" strokeWidth="2" strokeDasharray="6 4" />

          {/* Propellers */}
          <line x1="60" y1="120" x2="180" y2="120" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" className="origin-[120px_120px] animate-spin" style={{ animationDuration: '0.4s' }} />
          <line x1="320" y1="120" x2="440" y2="120" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" className="origin-[380px_120px] animate-spin" style={{ animationDuration: '0.4s' }} />
          <line x1="60" y1="380" x2="180" y2="380" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" className="origin-[120px_380px] animate-spin" style={{ animationDuration: '0.4s' }} />
          <line x1="320" y1="380" x2="440" y2="380" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" className="origin-[380px_380px] animate-spin" style={{ animationDuration: '0.4s' }} />

          {/* Diagonal Carbon Arms */}
          <path d="M 120 120 L 250 250" stroke="#132845" strokeWidth="14" strokeLinecap="round" />
          <path d="M 120 120 L 250 250" stroke="#00D9FF" strokeWidth="3" />
          <path d="M 380 120 L 250 250" stroke="#132845" strokeWidth="14" strokeLinecap="round" />
          <path d="M 380 120 L 250 250" stroke="#00D9FF" strokeWidth="3" />
          <path d="M 120 380 L 250 250" stroke="#132845" strokeWidth="14" strokeLinecap="round" />
          <path d="M 120 380 L 250 250" stroke="#00D9FF" strokeWidth="3" />
          <path d="M 380 380 L 250 250" stroke="#132845" strokeWidth="14" strokeLinecap="round" />
          <path d="M 380 380 L 250 250" stroke="#00D9FF" strokeWidth="3" />

          {/* Main Aerodynamic Chassis */}
          <path
            d="M 210 170 Q 250 140 290 170 L 305 320 Q 250 350 195 320 Z"
            fill="#091426"
            stroke="#00D9FF"
            strokeWidth="3"
          />

          {/* Underbody Cleaning Assembly */}
          <rect x="220" y="270" width="60" height="40" rx="6" fill="#132845" stroke="#65F4FF" strokeWidth="2" />
          <line x1="210" y1="315" x2="290" y2="315" stroke="#27E5A2" strokeWidth="4" strokeLinecap="round" />

          {/* LiDAR Sensor Top Dome */}
          <circle cx="250" cy="180" r="16" fill="#132845" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="250" cy="180" r="6" fill="#65F4FF" className="animate-pulse" />

          {/* Camera Gimbal */}
          <rect x="235" y="215" width="30" height="24" rx="4" fill="#050B16" stroke="#00D9FF" strokeWidth="2" />
          <circle cx="250" cy="227" r="7" fill="#00D9FF" opacity="0.8" />
        </svg>

        {/* Interactive Hotspot Buttons */}
        {hotspots.map((hs) => {
          const isSelected = selectedHotspot === hs.id;
          return (
            <button
              key={hs.id}
              onClick={() => onSelectHotspot(hs.id)}
              style={{ left: hs.x, top: hs.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border transition-all duration-300 z-20 ${
                isSelected
                  ? 'bg-primary text-background border-white shadow-glow-cyan scale-125'
                  : 'bg-surface/90 text-primary border-primary/50 hover:scale-110 hover:border-primary shadow-lg'
              }`}
              title={hs.title}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Schematic Info Badge */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-text-secondary bg-surface/80 backdrop-blur px-4 py-2 rounded-xl border border-border">
        <span className="font-mono text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          Interactive 2D Architecture Schematic (Hardware Accelerated 3D Fallback)
        </span>
        <span className="font-mono text-text-muted">Click any pulsing node to inspect</span>
      </div>
    </div>
  );
};
