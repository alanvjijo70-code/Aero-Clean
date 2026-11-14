import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  borderVariant?: 'default' | 'cyan' | 'subtle';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = true,
  borderVariant = 'default',
  ...props
}) => {
  const borderStyles = {
    default: 'border-border',
    cyan: 'border-primary/40 shadow-glow-cyan',
    subtle: 'border-white/5'
  }[borderVariant];

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:border-primary/50 hover:shadow-glow-cyan hover:-translate-y-0.5'
    : '';

  const glowStyles = glow ? 'shadow-glow-cyan' : '';

  return (
    <div
      className={`glass-panel rounded-2xl p-6 ${borderStyles} ${glowStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
