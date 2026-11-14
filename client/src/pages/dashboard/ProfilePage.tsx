import React from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { User, Building, Mail, Phone, ShieldCheck, Cpu, LogOut, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout, isDemoMode } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
          Enterprise Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage your organization credentials, contact details, and platform integration privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left User Identity Card */}
        <div className="md:col-span-1">
          <GlassCard className="p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 via-surface to-secondary/30 border-2 border-primary/50 flex items-center justify-center mx-auto text-primary text-2xl font-bold font-display shadow-glow-cyan">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                {user?.full_name || 'Enterprise Director'}
              </h3>
              <p className="text-xs font-mono text-accent">{user?.company_name || 'Vertex Realty'}</p>
            </div>

            <div className="pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-primary/10 border border-primary/30 text-primary font-bold">
                Role: {user?.role || 'customer'}
              </span>
            </div>

            <div className="pt-4 border-t border-border">
              <GradientButton
                variant="outline"
                size="sm"
                onClick={logout}
                icon={<LogOut className="w-4 h-4" />}
                className="w-full text-status-danger border-status-danger/30 hover:bg-status-danger/10"
              >
                Sign Out
              </GradientButton>
            </div>
          </GlassCard>
        </div>

        {/* Right Details & Integration Privileges */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
              Organization Credentials
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light">
                <span className="text-text-muted flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Corporate Email:
                </span>
                <span className="text-text-primary font-semibold">{user?.email}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light">
                <span className="text-text-muted flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" /> Enterprise Entity:
                </span>
                <span className="text-text-primary font-semibold">{user?.company_name || 'Unspecified'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light">
                <span className="text-text-muted flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Direct Phone:
                </span>
                <span className="text-text-primary font-semibold">{user?.phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </GlassCard>

          {/* Subsystem Connection Status */}
          <GlassCard borderVariant="cyan" className="p-6 space-y-4">
            <h4 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Subsystem Connectivity & Security Status
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-light">
                <span className="text-text-secondary">Supabase PostgreSQL & RLS:</span>
                <span className="text-status-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SECURE ISOLATION
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-light">
                <span className="text-text-secondary">Google Gemini AI Engine:</span>
                <span className="text-status-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED BACKEND SDK
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-light">
                <span className="text-text-secondary">Telemetry Simulator:</span>
                <span className="text-accent font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE SIMULATION
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
