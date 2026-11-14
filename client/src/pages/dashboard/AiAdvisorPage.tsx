import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import {
  Bot,
  Sparkles,
  Send,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sliders,
  History,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AiAdvisorPage: React.FC = () => {
  const location = useLocation();
  const passedBuilding = (location.state as any)?.building;

  const [activeTab, setActiveTab] = useState<'suitability' | 'plan' | 'advisory'>('suitability');
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(passedBuilding?.id || '');

  // Form Fields
  const [buildingType, setBuildingType] = useState(passedBuilding?.building_type || 'Commercial tower');
  const [heightM, setHeightM] = useState<number>(passedBuilding?.height_m || 160);
  const [windowAreaSqm, setWindowAreaSqm] = useState<number>(passedBuilding?.window_area_sqm || 14500);
  const [glassType, setGlassType] = useState(passedBuilding?.glass_type || 'Low-E Double Glazed');
  const [dirtSeverity, setDirtSeverity] = useState<'light' | 'moderate' | 'heavy'>(passedBuilding?.dirt_severity || 'moderate');
  const [query, setQuery] = useState('');

  // Results State
  const [suitabilityResult, setSuitabilityResult] = useState<any | null>(null);
  const [planResult, setPlanResult] = useState<any | null>(null);
  const [advisoryResult, setAdvisoryResult] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [bldgs, hist] = await Promise.all([
          api.getBuildings().catch(() => []),
          api.getAiHistory().catch(() => [])
        ]);
        setBuildings(bldgs || []);
        setHistory(hist || []);
      } catch (e) {}
    };
    init();
  }, []);

  // When a user selects a registered building from the dropdown, sync fields
  const handleSelectBuilding = (id: string) => {
    setSelectedBuildingId(id);
    const b = buildings.find((x) => x.id === id);
    if (b) {
      setBuildingType(b.building_type);
      setHeightM(b.height_m);
      setWindowAreaSqm(b.window_area_sqm);
      setGlassType(b.glass_type || 'Low-E Double Glazed');
      setDirtSeverity(b.dirt_severity || 'moderate');
    }
  };

  const handleRunSuitability = async () => {
    setLoading(true);
    try {
      const res = await api.analyzeSuitability({
        building_id: selectedBuildingId || null,
        building_type: buildingType,
        building_height_m: Number(heightM),
        window_area_sqm: Number(windowAreaSqm),
        glass_type: glassType,
        dirt_severity: dirtSeverity,
        environmental_exposure: 'Urban coastal microclimate with high wind shear above 100m'
      });
      setSuitabilityResult(res);
      toast.success('Suitability analysis completed by Gemini');
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRunPlan = async () => {
    setLoading(true);
    try {
      const res = await api.generateOperationalPlan({
        building_name: buildings.find((b) => b.id === selectedBuildingId)?.name || 'Commercial High-Rise',
        building_height_m: Number(heightM),
        window_area_sqm: Number(windowAreaSqm),
        dirt_severity: dirtSeverity,
        operational_constraints: 'Daytime operations, maximum sustained wind limit 25 km/h'
      });
      setPlanResult(res);
      toast.success('Operational cleaning plan synthesized by Gemini');
    } catch (err: any) {
      toast.error(err.message || 'Plan generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAdvisory = async () => {
    if (!query) {
      toast.error('Please enter an advisory question or select a preset');
      return;
    }
    setLoading(true);
    try {
      const res = await api.generateAdvisory({
        building_id: selectedBuildingId || null,
        building_height_m: Number(heightM),
        window_area_sqm: Number(windowAreaSqm),
        dirt_severity: dirtSeverity,
        question: query
      });
      setAdvisoryResult(res);
      toast.success('Gemini AI Advisory consultation ready');
    } catch (err: any) {
      toast.error(err.message || 'Advisory failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-mono mb-1">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>POWERED BY GOOGLE GEMINI 2.5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
            Autonomous Building AI Advisor
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Synthesize cleaning feasibility, staged operational plans, and safety protocols.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('suitability')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'suitability'
                ? 'bg-primary text-background font-bold shadow-glow-cyan'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            1. Suitability
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'plan'
                ? 'bg-primary text-background font-bold shadow-glow-cyan'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            2. Cleaning Plan
          </button>
          <button
            onClick={() => setActiveTab('advisory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === 'advisory'
                ? 'bg-primary text-background font-bold shadow-glow-cyan'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            3. Q&A Advisory
          </button>
        </div>
      </div>

      {/* Building Preset Selector Strip */}
      <div className="p-4 rounded-2xl bg-surface-glass border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <span>Evaluate Registered Asset:</span>
        </div>
        <select
          value={selectedBuildingId}
          onChange={(e) => handleSelectBuilding(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-1.5 text-text-primary font-mono focus:outline-none focus:border-primary max-w-sm"
        >
          <option value="">-- Custom Manual Parameters --</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.height_m}m, {b.window_area_sqm} m²)
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid: Parameters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Parameter Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Building Parameter Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-text-muted uppercase tracking-wider block mb-1">
                  Building Type
                </label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="Commercial tower">Commercial tower</option>
                  <option value="Residential tower">Residential tower</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Corporate office">Corporate office</option>
                  <option value="Industrial facility">Industrial facility</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-muted uppercase tracking-wider block mb-1">
                    Height (m)
                  </label>
                  <input
                    type="number"
                    value={heightM}
                    onChange={(e) => setHeightM(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl font-mono text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-text-muted uppercase tracking-wider block mb-1">
                    Window Area (m²)
                  </label>
                  <input
                    type="number"
                    value={windowAreaSqm}
                    onChange={(e) => setWindowAreaSqm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl font-mono text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-muted uppercase tracking-wider block mb-1">
                    Dirt Severity
                  </label>
                  <select
                    value={dirtSeverity}
                    onChange={(e) => setDirtSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-muted uppercase tracking-wider block mb-1">
                    Glass Type
                  </label>
                  <input
                    type="text"
                    value={glassType}
                    onChange={(e) => setGlassType(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {activeTab === 'advisory' && (
                <div className="pt-2">
                  <label className="text-text-muted uppercase tracking-wider block mb-1">
                    Advisory Question or Operational Dilemma *
                  </label>
                  <textarea
                    rows={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. What is the recommended cleaning frequency and safety margin for high-wind urban facades?"
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none text-xs"
                  />

                  {/* Preset prompt pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {[
                      'Evaluate high-wind gust margins',
                      'Optimal monthly maintenance cycle',
                      'Umbilical vs battery trade-off'
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuery(p)}
                        className="text-[10px] font-mono px-2 py-1 rounded-lg bg-surface border border-border text-primary hover:border-primary"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3">
              {activeTab === 'suitability' && (
                <GradientButton
                  onClick={handleRunSuitability}
                  loading={loading}
                  icon={<Bot className="w-4 h-4" />}
                  className="w-full"
                >
                  Analyze Cleaning Suitability
                </GradientButton>
              )}
              {activeTab === 'plan' && (
                <GradientButton
                  onClick={handleRunPlan}
                  loading={loading}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="w-full"
                >
                  Synthesize Operational Plan
                </GradientButton>
              )}
              {activeTab === 'advisory' && (
                <GradientButton
                  onClick={handleRunAdvisory}
                  loading={loading}
                  icon={<Send className="w-4 h-4" />}
                  className="w-full"
                >
                  Run Gemini Consultation
                </GradientButton>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: SUITABILITY OUTPUT */}
          {activeTab === 'suitability' && (
            suitabilityResult ? (
              <GlassCard borderVariant="cyan" className="p-6 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-status-success" />
                    <h3 className="text-lg font-display font-bold text-text-primary">
                      Suitability Analysis Result
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono uppercase font-bold ${
                      suitabilityResult.suitability === 'suitable'
                        ? 'bg-status-success/20 text-status-success border border-status-success/40'
                        : 'bg-status-warning/20 text-status-warning border border-status-warning/40'
                    }`}
                  >
                    {suitabilityResult.suitability.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-light text-xs font-mono">
                  <span>Model Confidence Score:</span>
                  <span className="text-accent font-bold">
                    {Math.round(suitabilityResult.confidence * 100)}% Match
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-text-muted mb-1">Building Summary</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {suitabilityResult.building_summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-accent mb-2">Identified Challenges</h4>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    {suitabilityResult.cleaning_challenges?.map((c: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-warning mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-primary mb-1">Recommended Approach</h4>
                  <p className="text-xs text-text-primary leading-relaxed bg-surface-light/50 p-3 rounded-xl border border-border">
                    {suitabilityResult.recommended_approach}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-status-success mb-2">Safety Protocols</h4>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    {suitabilityResult.safety_considerations?.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-12 text-center text-xs text-text-muted font-mono space-y-3">
                <Bot className="w-10 h-10 text-primary mx-auto opacity-60" />
                <p>Click "Analyze Cleaning Suitability" to evaluate architectural parameters.</p>
              </GlassCard>
            )
          )}

          {/* TAB 2: OPERATIONAL PLAN OUTPUT */}
          {activeTab === 'plan' && (
            planResult ? (
              <GlassCard borderVariant="cyan" className="p-6 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-lg font-display font-bold text-text-primary">
                    {planResult.plan_title}
                  </h3>
                  <span className="text-xs font-mono text-accent bg-primary/10 px-2.5 py-1 rounded-full border border-primary/30">
                    Est: {planResult.estimated_duration_hours} Hours
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-text-muted">Cleaning Stages Timeline:</h4>
                  {planResult.cleaning_stages?.map((stage: any) => (
                    <div key={stage.step} className="p-3.5 rounded-xl bg-surface-light border border-border flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-mono flex items-center justify-center font-bold">
                            {stage.step}
                          </span>
                          <span className="text-xs font-bold text-text-primary">{stage.name}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary pl-7">{stage.description}</p>
                      </div>
                      <span className="text-[11px] font-mono text-accent shrink-0 pt-0.5">
                        {stage.estimated_minutes} min
                      </span>
                    </div>
                  ))}
                </div>

                {planResult.safety_notes && (
                  <div className="pt-2 border-t border-border">
                    <h5 className="text-[11px] font-mono uppercase text-warning mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Safety & Aviation Directives
                    </h5>
                    <ul className="text-xs text-text-secondary space-y-1">
                      {planResult.safety_notes.map((sn: string, i: number) => (
                        <li key={i}>• {sn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-12 text-center text-xs text-text-muted font-mono space-y-3">
                <Sparkles className="w-10 h-10 text-accent mx-auto opacity-60" />
                <p>Click "Synthesize Operational Plan" to generate a calibrated workflow timeline.</p>
              </GlassCard>
            )
          )}

          {/* TAB 3: Q&A ADVISORY OUTPUT */}
          {activeTab === 'advisory' && (
            advisoryResult ? (
              <GlassCard borderVariant="cyan" className="p-6 space-y-5 animate-in fade-in duration-200">
                <div className="pb-3 border-b border-border">
                  <span className="text-[10px] font-mono uppercase text-accent block">Executive Summary</span>
                  <h3 className="text-base font-display font-bold text-text-primary mt-1">
                    {advisoryResult.summary}
                  </h3>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-text-muted mb-2">Priority Recommendations</h4>
                  <div className="space-y-2.5">
                    {advisoryResult.recommendations?.map((rec: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface-light border border-border space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-primary">{rec.title}</span>
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              rec.priority === 'high'
                                ? 'bg-status-danger/20 text-status-danger border border-status-danger/30'
                                : rec.priority === 'medium'
                                ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                                : 'bg-primary/15 text-primary border border-primary/30'
                            }`}
                          >
                            {rec.priority} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-mono text-status-success uppercase mb-1">Estimated Benefits</h5>
                    <ul className="text-text-secondary space-y-1 text-[11px]">
                      {advisoryResult.estimated_benefits?.map((b: string, i: number) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-mono text-warning uppercase mb-1">Operational Risks</h5>
                    <ul className="text-text-secondary space-y-1 text-[11px]">
                      {advisoryResult.risks?.map((r: string, i: number) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface border border-border text-[10px] text-text-muted leading-tight">
                  <strong className="text-text-secondary">Disclaimer:</strong> {advisoryResult.disclaimer}
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-12 text-center text-xs text-text-muted font-mono space-y-3">
                <Bot className="w-10 h-10 text-primary mx-auto opacity-60" />
                <p>Type your inquiry or choose a preset prompt to consult the Gemini AI Advisor.</p>
              </GlassCard>
            )
          )}
        </div>
      </div>
    </div>
  );
};
