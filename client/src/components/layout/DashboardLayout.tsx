import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { StatusIndicator } from '../common/StatusIndicator.js';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Calculator,
  Bot,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Plus
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isDemoMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Buildings', path: '/dashboard/buildings', icon: Building2 },
    { label: 'Cleaning Projects', path: '/dashboard/projects', icon: CalendarCheck },
    { label: 'Cost Estimates', path: '/dashboard/estimates', icon: Calculator },
    { label: 'AI Advisor', path: '/dashboard/ai-advisor', icon: Bot, badge: 'Gemini' },
    { label: 'Account Profile', path: '/dashboard/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-background flex text-text-primary">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-surface border-r border-border flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 via-surface to-secondary/30 border border-primary/40 flex items-center justify-center shrink-0 shadow-glow-cyan">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <span className="font-display font-extrabold text-base tracking-wider truncate">
                AEROCLEAN <span className="text-primary font-mono text-xs">AI</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary/20 text-accent border border-primary/30 shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono uppercase bg-primary/15 text-primary px-1.5 py-0.5 rounded border border-primary/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Demo Mode Notice */}
        {isDemoMode && !collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-primary/10 border border-primary/30 text-xs">
            <div className="flex items-center gap-1.5 text-primary font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Mode Active</span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Fully interactive portfolio with sample buildings and Gemini AI fallbacks.
            </p>
          </div>
        )}

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-border">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2 py-1'}`}>
            <div className="w-9 h-9 rounded-full bg-surface-light border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{user?.full_name || 'Enterprise User'}</p>
                <p className="text-[11px] text-text-secondary truncate">{user?.company_name || user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Header */}
        <header className="h-16 px-6 bg-surface/60 border-b border-border backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              PORTAL / <span className="text-text-primary font-semibold">{location.pathname.replace('/dashboard', '') || 'OVERVIEW'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <StatusIndicator statusText="FLEET READY" isSimulation={true} className="hidden sm:inline-flex" />
            <Link
              to="/"
              className="text-xs text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors"
              target="_blank"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
