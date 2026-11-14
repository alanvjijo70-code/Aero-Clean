import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import { StatusIndicator } from '../../components/common/StatusIndicator.js';
import {
  Building2,
  CalendarCheck,
  Calculator,
  Bot,
  TrendingDown,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Activity,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bldgs, projs, ests] = await Promise.all([
          api.getBuildings().catch(() => []),
          api.getProjects().catch(() => []),
          api.getEstimates().catch(() => [])
        ]);
        setBuildings(bldgs || []);
        setProjects(projs || []);
        setEstimates(ests || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute total portfolio metrics
  const totalWindowArea = buildings.reduce((acc, b) => acc + (b.window_area_sqm || 0), 0);
  const activeMissionsCount = projects.filter((p) => p.status === 'in_progress').length;
  const totalProjectedSavings = estimates.reduce((acc, e) => acc + (e.estimated_savings || 0), 0);

  // Chart data comparing traditional vs drone cost across saved estimates
  const chartData = estimates.slice(0, 5).map((e, idx) => ({
    name: `Est #${idx + 1}`,
    Traditional: e.traditional_cost,
    Drone: e.drone_cost,
    Savings: e.estimated_savings
  }));

  const fallbackChartData = [
    { name: 'Tower A', Traditional: 652500, Drone: 319000, Savings: 333500 },
    { name: 'Tech Hub', Traditional: 441000, Drone: 215600, Savings: 225400 },
    { name: 'Marina Spire', Traditional: 810000, Drone: 396000, Savings: 414000 }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
            Welcome, {user?.full_name || 'Enterprise Director'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {user?.company_name || 'Autonomous High-Rise Facade Maintenance Operations'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusIndicator statusText="FLEET ACTIVE (SIM)" isSimulation={true} />
          <Link to="/dashboard/ai-advisor">
            <GradientButton size="sm" icon={<Bot className="w-4 h-4" />}>
              AI Consultation
            </GradientButton>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards (Section 27) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">Managed Buildings</span>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary mt-1">
              {buildings.length}
            </div>
            <p className="text-[11px] font-mono text-primary mt-1">
              {totalWindowArea.toLocaleString()} m² Glazing Portfolio
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Building2 className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">Cleaning Projects</span>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-accent mt-1">
              {projects.length}
            </div>
            <p className="text-[11px] font-mono text-status-success mt-1">
              {activeMissionsCount} Mission Currently Active
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-accent/10 text-accent border border-accent/20">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">Saved Estimates</span>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary mt-1">
              {estimates.length}
            </div>
            <p className="text-[11px] font-mono text-text-secondary mt-1">
              ₹{totalProjectedSavings.toLocaleString()} Total Projected Savings
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-secondary/15 text-secondary border border-secondary/30">
            <Calculator className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-text-muted">AI Advisor Status</span>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-status-success mt-1">
              Online
            </div>
            <p className="text-[11px] font-mono text-primary mt-1">
              Gemini 2.5 Multi-Stage Model
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-status-success/10 text-status-success border border-status-success/20">
            <Bot className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Chart & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cost Comparison Chart (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-display font-bold text-text-primary">
                  Traditional Scaffolding vs Drone Cost
                </h3>
                <p className="text-xs text-text-secondary">
                  Comparative expenditure across your registered portfolio buildings
                </p>
              </div>
              <Link to="/dashboard/estimates" className="text-xs font-mono text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.length > 0 ? chartData : fallbackChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(119, 190, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#9BAEC4" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9BAEC4" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1B2E',
                      borderColor: 'rgba(119, 190, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#F4F8FF'
                    }}
                  />
                  <Bar dataKey="Traditional" fill="#FF647C" radius={[4, 4, 0, 0]} opacity={0.7} />
                  <Bar dataKey="Drone" fill="#00D9FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-status-danger opacity-70" />
                <span className="text-text-secondary">Traditional Rigging Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-text-primary font-bold">AeroClean Drone Cost</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Fleet Live Status (5 cols) */}
        <div className="lg:col-span-5">
          <GlassCard borderVariant="cyan" className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                <h3 className="text-base font-display font-bold text-text-primary">
                  Active Mission Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-status-success/15 text-status-success border border-status-success/30">
                DRONE UNIT #04 ALOFT
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-light">
                <span className="text-text-muted">Target Facade:</span>
                <span className="text-text-primary font-semibold">Vertex Horizon Tower (South Glazing)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-light">
                <span className="text-text-muted">Operating Elevation:</span>
                <span className="text-accent font-semibold">142.6 meters (Level 36)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-light">
                <span className="text-text-muted">Anemometer Wind Speed:</span>
                <span className="text-status-success font-semibold">14.2 km/h (Nominal Buffer)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-light">
                <span className="text-text-muted">Surface Cleanliness Rating:</span>
                <span className="text-primary font-bold">99.2% Optical Clarity</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-mono text-text-muted mb-1">
                <span>Flight Column Progress:</span>
                <span className="text-primary font-bold">68%</span>
              </div>
              <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-[68%]" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Cleaning Projects Table */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-display font-bold text-text-primary">
              Recent Cleaning Missions
            </h3>
            <p className="text-xs text-text-secondary">
              Current and scheduled facade maintenance missions
            </p>
          </div>
          <Link to="/dashboard/projects">
            <GradientButton size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
              Configure Project
            </GradientButton>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted font-mono">
            No cleaning projects configured yet. Click above to schedule your first autonomous mission.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Building</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      {project.project_name}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {project.building_name || 'Selected Facility'}
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString() : 'Immediate'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          project.status === 'in_progress'
                            ? 'bg-primary/20 text-accent border border-primary/40'
                            : project.status === 'completed'
                            ? 'bg-status-success/20 text-status-success border border-status-success/40'
                            : 'bg-surface-light text-text-secondary border border-border'
                        }`}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/dashboard/projects"
                        className="text-primary hover:text-accent font-semibold"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
