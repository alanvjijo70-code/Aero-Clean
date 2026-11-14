import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { Bot, LogIn, Key, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemoCustomer, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleDemoCustomer = () => {
    loginAsDemoCustomer();
    navigate(redirectPath, { replace: true });
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <GlassCard className="w-full max-w-md p-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-surface to-secondary/30 border border-primary/40 flex items-center justify-center p-2 shadow-glow-cyan group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-primary" />
            </div>
          </Link>
          <h2 className="text-2xl font-display font-extrabold text-text-primary">
            Enterprise Portal Access
          </h2>
          <p className="text-xs text-text-secondary">
            Sign in to manage building portfolios, cleaning missions, and AI consultations.
          </p>
        </div>

        {/* Demo Fast-Login Strip for Quick Evaluation */}
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-primary font-semibold">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Instant Evaluation Access:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="px-2.5 py-1.5 rounded-lg bg-surface text-xs font-mono text-text-primary hover:text-accent hover:border-primary border border-border transition-colors text-center"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-2.5 py-1.5 rounded-lg bg-surface text-xs font-mono text-text-primary hover:text-accent hover:border-primary border border-border transition-colors text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@vertexrealty.in"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <GradientButton
            type="submit"
            size="lg"
            loading={loading}
            icon={<LogIn className="w-4 h-4" />}
            className="w-full"
          >
            Sign In to Dashboard
          </GradientButton>
        </form>

        <div className="text-center pt-2 border-t border-border text-xs text-text-secondary">
          Don't have an enterprise account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register new account
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
