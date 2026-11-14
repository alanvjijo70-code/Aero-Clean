import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useTheme } from '../../contexts/ThemeContext.js';
import { GradientButton } from '../common/GradientButton.js';
import { StatusIndicator } from '../common/StatusIndicator.js';
import {
  Menu,
  X,
  Bot,
  Layers,
  Calculator,
  Compass,
  PhoneCall,
  LayoutDashboard,
  LogOut,
  User,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Technology', path: '/technology', icon: Layers },
    { label: 'How It Works', path: '/how-it-works', icon: Compass },
    { label: 'Cost Estimator', path: '/estimate', icon: Calculator },
    { label: 'About', path: '/about', icon: ShieldCheck },
    { label: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-lg shadow-black/20 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-surface to-secondary/30 border border-primary/40 flex items-center justify-center p-2 group-hover:border-primary transition-all duration-300 shadow-glow-cyan">
              <Bot className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-ping" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-wider text-text-primary flex items-center gap-1.5">
                AEROCLEAN <span className="text-primary font-mono text-sm px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30">AI</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-text-muted font-mono">
                Robotics Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-glass/60 border border-border/80 px-4 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/15 text-accent border border-primary/40 shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Status Indicator, Theme Switcher & CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <StatusIndicator statusText="ALL DRONES OPERATIONAL" isSimulation={true} />

            {/* Optional Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface/80 hover:bg-surface border border-border text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5 shadow-sm"
              title={isDark ? "Switch to Light Mode (Optional)" : "Switch to Dark Mode (Default)"}
              aria-label="Toggle Dark/Light Mode"
            >
              {isDark ? (
                <>
                  <Moon className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-mono text-text-secondary hidden xl:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-warning" />
                  <span className="text-[11px] font-mono text-text-secondary hidden xl:inline">Light</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <GradientButton size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
                    Dashboard
                  </GradientButton>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-text-secondary hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <GradientButton variant="ghost" size="sm">
                    Sign In
                  </GradientButton>
                </Link>
                <Link to="/contact">
                  <GradientButton size="sm">
                    Request Demo
                  </GradientButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <StatusIndicator statusText="FLEET READY" className="text-[11px] py-1 px-2.5" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border/80 px-5 pt-4 pb-6 mt-3 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-primary/20 text-accent border border-primary/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            {/* Optional Dark / Light Mode Switcher in Mobile Drawer */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-surface border border-border text-xs font-mono text-text-secondary"
            >
              <span className="flex items-center gap-2">
                {isDark ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-warning" />}
                <span>Theme Mode</span>
              </span>
              <span className="text-primary font-bold">{isDark ? 'Dark (Default)' : 'Light (Active)'}</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="w-full">
                  <GradientButton className="w-full" icon={<LayoutDashboard className="w-4 h-4" />}>
                    Enter Enterprise Portal
                  </GradientButton>
                </Link>
                <GradientButton
                  variant="ghost"
                  className="w-full justify-start text-status-danger"
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={logout}
                >
                  Sign Out ({user?.email})
                </GradientButton>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="w-full">
                  <GradientButton variant="outline" className="w-full">
                    Sign In
                  </GradientButton>
                </Link>
                <Link to="/contact" className="w-full">
                  <GradientButton className="w-full">
                    Demo
                  </GradientButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
