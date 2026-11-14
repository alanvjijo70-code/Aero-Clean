import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { CostEstimator } from '../../components/forms/CostEstimator.js';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingDown,
  Clock,
  Sparkles,
  ShieldAlert,
  X,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EstimatesPage: React.FC = () => {
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any | null>(null);

  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const data = await api.getEstimates();
      setEstimates(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch estimates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this saved estimate?')) return;
    try {
      await api.deleteEstimate(id);
      toast.success('Estimate removed from portfolio');
      fetchEstimates();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete estimate');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
            Saved Cost & Time Estimates
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Archived financial models and turnaround projections for your high-rise assets.
          </p>
        </div>

        <GradientButton onClick={() => setShowCalculator(!showCalculator)} icon={<Plus className="w-4 h-4" />}>
          {showCalculator ? 'Close Calculator' : 'New Estimate'}
        </GradientButton>
      </div>

      {/* Embedded Live Calculator Accordion */}
      {showCalculator && (
        <div className="p-6 rounded-3xl bg-surface-glass border border-primary/40 shadow-glow-cyan animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-accent tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Live Estimation Engine
            </span>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-text-muted hover:text-text-primary p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <CostEstimator
            onSaved={() => {
              setShowCalculator(false);
              fetchEstimates();
            }}
          />
        </div>
      )}

      {/* Estimates Table / Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-text-muted">
          Loading archived estimates...
        </div>
      ) : estimates.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto space-y-4">
          <Calculator className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-display font-bold text-text-primary">
            No Estimates Archived
          </h3>
          <p className="text-xs text-text-secondary">
            Run the cost calculator to compute traditional vs drone maintenance expenditure.
          </p>
          <GradientButton onClick={() => setShowCalculator(true)} size="sm" icon={<Plus className="w-4 h-4" />}>
            Generate First Estimate
          </GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estimates.map((est) => (
            <GlassCard key={est.id} className="p-6 space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    {new Date(est.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="p-1.5 text-text-muted hover:text-status-danger rounded hover:bg-status-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-accent block">
                      Net Projected Savings
                    </span>
                    <span className="text-2xl font-display font-extrabold text-text-primary">
                      {est.currency === 'INR' ? '₹' : est.currency}{est.estimated_savings?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-status-success bg-status-success/15 px-2 py-0.5 rounded-full border border-status-success/30">
                    {est.savings_percentage}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-light text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-text-secondary">
                    <span>Manual Cost:</span>
                    <span className="line-through text-text-muted">{est.currency === 'INR' ? '₹' : est.currency}{est.traditional_cost?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-primary font-bold">
                    <span>Drone Cost:</span>
                    <span>{est.currency === 'INR' ? '₹' : est.currency}{est.drone_cost?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>{est.drone_hours}h vs {est.traditional_hours}h</span>
                  </div>
                  <div className="text-right text-accent">
                    <span>{est.window_area_sqm} m² @ {est.building_height_m}m</span>
                  </div>
                </div>
              </div>

              {/* View Breakdown Trigger */}
              <div className="pt-3 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedEstimate(est)}
                  className="text-xs font-mono text-primary hover:text-accent font-semibold"
                >
                  Inspect Full Breakdown →
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Detail Breakdown Modal */}
      {selectedEstimate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-lg p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedEstimate(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-display font-bold text-text-primary">
                Estimate Audit Specification
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-light">
                <div>
                  <span className="text-text-muted text-[10px] block">Building Elevation:</span>
                  <span className="text-text-primary font-bold">{selectedEstimate.building_height_m} meters</span>
                </div>
                <div>
                  <span className="text-text-muted text-[10px] block">Total Window Glazing:</span>
                  <span className="text-primary font-bold">{selectedEstimate.window_area_sqm?.toLocaleString()} m²</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-light space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Traditional Manual Rigging:</span>
                  <span className="text-status-danger font-bold">
                    {selectedEstimate.currency === 'INR' ? '₹' : selectedEstimate.currency}{selectedEstimate.traditional_cost?.toLocaleString()} ({selectedEstimate.traditional_hours}h)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">AeroClean Drone Deployment:</span>
                  <span className="text-accent font-bold">
                    {selectedEstimate.currency === 'INR' ? '₹' : selectedEstimate.currency}{selectedEstimate.drone_cost?.toLocaleString()} ({selectedEstimate.drone_hours}h)
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border text-status-success font-bold">
                  <span>Estimated Net Savings:</span>
                  <span>
                    {selectedEstimate.currency === 'INR' ? '₹' : selectedEstimate.currency}{selectedEstimate.estimated_savings?.toLocaleString()} ({selectedEstimate.savings_percentage}%)
                  </span>
                </div>
              </div>

              {selectedEstimate.assumptions && (
                <div>
                  <span className="text-[10px] uppercase text-text-muted block mb-1">
                    Configured Assumptions JSON:
                  </span>
                  <pre className="p-3 rounded-xl bg-background border border-border text-[11px] text-accent overflow-x-auto">
                    {JSON.stringify(selectedEstimate.assumptions, null, 2)}
                  </pre>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-surface border border-border text-[10px] text-text-muted flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                <span>
                  Preliminary planning estimate. Does not guarantee fixed commercial pricing.
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
