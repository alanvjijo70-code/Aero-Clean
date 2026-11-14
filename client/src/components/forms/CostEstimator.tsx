import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { GradientButton } from '../common/GradientButton.js';
import { api } from '../../lib/api.js';
import { useAuth } from '../../contexts/AuthContext.js';
import {
  Calculator,
  TrendingDown,
  Clock,
  Sparkles,
  RotateCcw,
  BookmarkCheck,
  ArrowRight,
  ShieldAlert,
  Sliders,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface CostEstimatorProps {
  initialHeight?: number;
  initialArea?: number;
  onSaved?: () => void;
  showSaveButton?: boolean;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  initialHeight = 150,
  initialArea = 12000,
  onSaved,
  showSaveButton = true
}) => {
  const { user, isAuthenticated } = useAuth();

  // Inputs
  const [windowArea, setWindowArea] = useState<number>(initialArea);
  const [heightM, setHeightM] = useState<number>(initialHeight);
  const [currency, setCurrency] = useState<string>('INR');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Configurable unit rates & productivity
  const [tradCostPerSqm, setTradCostPerSqm] = useState<number>(45);
  const [droneCostPerSqm, setDroneCostPerSqm] = useState<number>(22);
  const [tradProdSqmH, setTradProdSqmH] = useState<number>(35);
  const [droneProdSqmH, setDroneProdSqmH] = useState<number>(110);

  const [savingLoading, setSavingLoading] = useState<boolean>(false);

  // Currency symbols & conversion labels
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    AED: 'AED ',
    EUR: '€',
    SGD: 'S$'
  };

  const currSymbol = currencySymbols[currency] || '₹';

  // Calculations
  const heightFactor = heightM > 150 ? 1 + (heightM - 150) * 0.001 : 1.0;
  const adjustedTradRate = tradCostPerSqm * heightFactor;

  const validArea = Math.max(1, windowArea);
  const traditionalCost = Math.round(validArea * adjustedTradRate);
  const droneCost = Math.round(validArea * droneCostPerSqm);
  const estimatedSavings = Math.max(0, traditionalCost - droneCost);
  const savingsPercentage = traditionalCost > 0
    ? Math.round((estimatedSavings / traditionalCost) * 1000) / 10
    : 0;

  const traditionalHours = Math.round((validArea / Math.max(1, tradProdSqmH)) * 10) / 10;
  const droneHours = Math.round((validArea / Math.max(1, droneProdSqmH)) * 10) / 10;
  const timeSavedHours = Math.max(0, Math.round((traditionalHours - droneHours) * 10) / 10);
  const timeSavedPercentage = traditionalHours > 0
    ? Math.round((timeSavedHours / traditionalHours) * 1000) / 10
    : 0;

  const handleReset = () => {
    setWindowArea(12000);
    setHeightM(150);
    setTradCostPerSqm(45);
    setDroneCostPerSqm(22);
    setTradProdSqmH(35);
    setDroneProdSqmH(110);
    setCurrency('INR');
    toast.success('Calculator parameters reset to standard baseline');
  };

  const handleSaveEstimate = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save estimates to your enterprise portfolio');
      return;
    }

    setSavingLoading(true);
    try {
      await api.saveEstimate({
        window_area_sqm: validArea,
        building_height_m: heightM,
        traditional_cost: traditionalCost,
        drone_cost: droneCost,
        estimated_savings: estimatedSavings,
        savings_percentage: savingsPercentage,
        traditional_hours: traditionalHours,
        drone_hours: droneHours,
        currency,
        assumptions: {
          traditional_cost_per_sqm: tradCostPerSqm,
          drone_cost_per_sqm: droneCostPerSqm,
          traditional_productivity_sqm_h: tradProdSqmH,
          drone_productivity_sqm_h: droneProdSqmH,
          height_rigging_multiplier: Math.round(heightFactor * 100) / 100
        }
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });

      toast.success('Estimate archived to your enterprise dashboard portfolio');
      if (onSaved) onSaved();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save estimate');
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-display font-bold text-text-primary">
                  Building Geometry Inputs
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-surface border border-border text-xs rounded-lg px-2.5 py-1 text-primary focus:outline-none focus:border-primary font-mono"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
                  title="Reset to Defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total Window Area Slider & Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                  Total Facade Window Area (m²)
                </label>
                <span className="text-sm font-mono font-bold text-primary">
                  {windowArea.toLocaleString()} m²
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={windowArea}
                onChange={(e) => setWindowArea(Number(e.target.value))}
                className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-mono text-text-muted">
                <span>500 m² (Mid-Rise)</span>
                <span>25,000 m²</span>
                <span>50,000 m² (Skyscraper)</span>
              </div>
            </div>

            {/* Building Height Slider & Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                  Building Height (Meters)
                </label>
                <span className="text-sm font-mono font-bold text-accent">
                  {heightM} m (~{Math.round(heightM / 3.5)} Floors)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={heightM}
                onChange={(e) => setHeightM(Number(e.target.value))}
                className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[11px] font-mono text-text-muted">
                <span>20 m</span>
                <span>250 m</span>
                <span>500 m (Super-Tall)</span>
              </div>
            </div>

            {/* Toggle Advanced Unit Rates */}
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-mono text-text-secondary hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Cost & Productivity Assumptions' : 'Customize Cost & Productivity Assumptions'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 p-4 rounded-xl bg-surface-light border border-border animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted block mb-1">
                        Manual Rate ({currSymbol}/m²)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tradCostPerSqm}
                        onChange={(e) => setTradCostPerSqm(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted block mb-1">
                        Drone Rate ({currSymbol}/m²)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={droneCostPerSqm}
                        onChange={(e) => setDroneCostPerSqm(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted block mb-1">
                        Manual Speed (m²/hr)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tradProdSqmH}
                        onChange={(e) => setTradProdSqmH(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted block mb-1">
                        Drone Speed (m²/hr)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={droneProdSqmH}
                        onChange={(e) => setDroneProdSqmH(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Results Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cost Savings Card */}
            <GlassCard borderVariant="cyan" className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingDown className="w-24 h-24 text-primary" />
              </div>
              <span className="text-xs font-mono uppercase text-accent tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Estimated Financial Advantage
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary">
                  {currSymbol}{estimatedSavings.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-status-success font-bold bg-status-success/15 px-2 py-0.5 rounded-full border border-status-success/30">
                  {savingsPercentage}% Less
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Projected savings per full exterior facade cleaning pass.
              </p>
            </GlassCard>

            {/* Operational Time Card */}
            <GlassCard className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock className="w-24 h-24 text-secondary" />
              </div>
              <span className="text-xs font-mono uppercase text-text-muted tracking-wider flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                Turnaround Acceleration
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary">
                  {timeSavedHours} hrs
                </span>
                <span className="text-xs font-mono text-accent font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/30">
                  ~{Math.round(traditionalHours / Math.max(1, droneHours))}x Faster
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Completed in {droneHours} hrs vs {traditionalHours} manual crew hours.
              </p>
            </GlassCard>
          </div>

          {/* Comparative Metrics Visualizer */}
          <GlassCard className="p-6 space-y-5">
            <h4 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary flex items-center justify-between">
              <span>Direct Operational Comparison</span>
              <span className="text-xs font-mono text-text-muted font-normal">Per Cycle Estimate</span>
            </h4>

            {/* Cost Comparison Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">Traditional Scaffolding / Cradle:</span>
                <span className="text-text-primary font-bold">{currSymbol}{traditionalCost.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-status-danger/60 rounded-full w-full" />
              </div>

              <div className="flex justify-between text-xs font-mono pt-1">
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AeroClean AI Drone Fleet:
                </span>
                <span className="text-accent font-bold">{currSymbol}{droneCost.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 shadow-glow-cyan"
                  style={{ width: `${Math.max(15, Math.min(100, (droneCost / Math.max(1, traditionalCost)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Duration Comparison Bar */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">Traditional Manual Window Cleaning:</span>
                <span className="text-text-primary font-bold">{traditionalHours} Hours</span>
              </div>
              <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-status-warning/60 rounded-full w-full" />
              </div>

              <div className="flex justify-between text-xs font-mono pt-1">
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Autonomous Drone Deployment:
                </span>
                <span className="text-accent font-bold">{droneHours} Hours</span>
              </div>
              <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, Math.min(100, (droneHours / Math.max(1, traditionalHours)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              {showSaveButton && (
                <GradientButton
                  variant="primary"
                  size="md"
                  loading={savingLoading}
                  onClick={handleSaveEstimate}
                  icon={<BookmarkCheck className="w-4 h-4" />}
                >
                  Save to Portfolio
                </GradientButton>
              )}

              <a href="/contact">
                <GradientButton variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Request Enterprise Audit
                </GradientButton>
              </a>
            </div>
          </GlassCard>

          {/* Mandatory Safety & Planning Disclaimer */}
          <div className="p-3.5 rounded-xl bg-surface-glass border border-border flex items-start gap-2.5 text-xs text-text-muted">
            <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              These figures are preliminary planning estimates based on user-provided inputs and configurable assumptions. Actual costs and durations depend on building geometry, access, weather, regulations, cleaning conditions, and operational validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
