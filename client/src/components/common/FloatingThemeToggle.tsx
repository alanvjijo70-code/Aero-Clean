import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.js';
import { Sun, Moon } from 'lucide-react';

export const FloatingThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface/85 hover:bg-surface border border-border/90 shadow-xl backdrop-blur-md text-xs font-mono transition-all duration-300 hover:scale-105 hover:border-primary/50 text-text-secondary hover:text-text-primary"
        title={isDark ? "Switch to Light Mode (Optional)" : "Switch to Dark Mode (Default)"}
        aria-label="Toggle Dark/Light Mode"
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="font-semibold">Dark Mode <span className="text-text-muted text-[10px]">(Default)</span></span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-warning animate-pulse" />
            <span className="font-semibold text-text-primary">Light Mode</span>
          </>
        )}
      </button>
    </div>
  );
};
