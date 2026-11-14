import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { StatusIndicator } from '../common/StatusIndicator.js';
import { GradientButton } from '../common/GradientButton.js';
import { Bot, Mail, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid corporate email');
      return;
    }
    if (!consent) {
      toast.error('Please agree to receive technology updates');
      return;
    }

    setLoading(true);
    try {
      await api.subscribeNewsletter({ email, company_name: companyName, consent: true });
      setSubscribed(true);
      toast.success('Thank you for subscribing to AeroClean AI updates.');
      setEmail('');
      setCompanyName('');
    } catch (err: any) {
      toast.error(err.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-background-secondary border-t border-border pt-16 pb-12 text-text-secondary relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 via-surface to-secondary/30 border border-primary/40 flex items-center justify-center p-2 shadow-glow-cyan">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-text-primary">
                AEROCLEAN <span className="text-primary font-mono text-sm px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30">AI</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Engineering autonomous aerial robotics to eliminate high-altitude human risk, automate facade maintenance, and optimize commercial building operations.
            </p>
            <div className="pt-2">
              <StatusIndicator statusText="ALL DRONES OPERATIONAL" isSimulation={true} />
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary tracking-wider uppercase mb-4">
              Technology
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/technology" className="hover:text-primary transition-colors">
                  Spatial LiDAR Suite
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-primary transition-colors">
                  AI Computer Vision
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  Hybrid Cleaning Assembly
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-primary transition-colors">
                  Surface Verification Scan
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  Operational Safety Grid
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary tracking-wider uppercase mb-4">
              Platform & SaaS
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/estimate" className="hover:text-primary transition-colors">
                  Maintenance Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors">
                  Enterprise Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/ai-advisor" className="hover:text-primary transition-colors">
                  Gemini AI Advisor
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Mission & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Schedule Flight Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary tracking-wider uppercase mb-4">
              Stay Ahead
            </h4>
            <p className="text-xs text-text-secondary mb-3">
              Receive quarterly autonomous facade maintenance insights and engineering briefs.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 flex items-center gap-2.5 text-xs text-status-success">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed to research briefings</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="corporate@company.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent-footer"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-border bg-surface text-primary focus:ring-primary"
                  />
                  <label htmlFor="consent-footer" className="text-[11px] text-text-muted leading-tight">
                    I consent to receive autonomous robotics technology updates.
                  </label>
                </div>
                <GradientButton
                  type="submit"
                  size="sm"
                  loading={loading}
                  icon={<Send className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                >
                  Subscribe
                </GradientButton>
              </form>
            )}
          </div>
        </div>

        {/* Disclaimer & Legal Notice */}
        <div className="py-6 border-b border-border text-xs text-text-muted space-y-2">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-text-secondary font-medium">Engineering & Safety Notice:</strong> AeroClean AI is an advanced autonomous technology platform concept. Cost projections, cleaning productivity benchmarks, and AI recommendations are preliminary estimates based on simulation and user assumptions. Real-world operations require site-specific risk assessments, certified structural engineering evaluations, and applicable civil aviation compliance clearances.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} AeroClean AI Autonomous Robotics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-text-primary transition-colors">
              Support & Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
