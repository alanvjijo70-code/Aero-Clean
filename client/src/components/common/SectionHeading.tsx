import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  highlightText?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlightText,
  subtitle,
  align = 'center',
  className = ''
}) => {
  const alignmentStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[align];

  return (
    <div className={`flex flex-col ${alignmentStyles} max-w-3xl ${align === 'center' ? 'mx-auto' : ''} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-accent animate-pulse" />}
          <span>{badge}</span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text-primary leading-tight">
        {title}{' '}
        {highlightText && (
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {highlightText}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
