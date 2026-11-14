import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-2',
    lg: 'w-14 h-14 border-3'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses} rounded-full border-primary/20 border-t-primary animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
        </div>
      </div>
      {text && <p className="text-xs font-mono tracking-wider text-text-secondary uppercase">{text}</p>}
    </div>
  );
};
