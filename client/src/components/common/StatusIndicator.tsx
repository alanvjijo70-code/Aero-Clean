import React from 'react';

interface StatusIndicatorProps {
  statusText?: string;
  isSimulation?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  statusText = 'ALL DRONES OPERATIONAL',
  isSimulation = true,
  className = ''
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-glass border border-border text-xs text-text-secondary ${className}`}
      title={isSimulation ? 'Demonstration / Product Platform Telemetry Simulator' : 'Live Fleet Telemetry'}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
      </span>
      <span className="font-mono font-medium text-text-primary tracking-wide">{statusText}</span>
      {isSimulation && (
        <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-primary border border-primary/20">
          Sim
        </span>
      )}
    </div>
  );
};
