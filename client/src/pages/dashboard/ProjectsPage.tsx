import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import {
  CalendarCheck,
  Plus,
  Trash2,
  Calendar,
  Building2,
  X,
  Play,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Form
  const [projectName, setProjectName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [status, setStatus] = useState('planned');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projs, bldgs] = await Promise.all([
        api.getProjects(),
        api.getBuildings()
      ]);
      setProjects(projs || []);
      setBuildings(bldgs || []);
      if (bldgs && bldgs.length > 0 && !buildingId) {
        setBuildingId(bldgs[0].id);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setProjectName('');
    setStatus('planned');
    setScheduledDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setNotes('');
    if (buildings.length > 0) setBuildingId(buildings[0].id);
    setShowModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !buildingId) {
      toast.error('Please specify project name and target building');
      return;
    }

    setSaving(true);
    try {
      await api.createProject({
        project_name: projectName,
        building_id: buildingId,
        status,
        scheduled_date: scheduledDate ? new Date(scheduledDate).toISOString() : null,
        notes
      });
      toast.success('Cleaning mission project initialized');
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateProject(id, { status: newStatus });
      toast.success(`Project status transitioned to ${newStatus.replace('_', ' ')}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete project "${name}"?`)) return;
    try {
      await api.deleteProject(id);
      toast.success('Project deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const filteredProjects = statusFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
            Autonomous Cleaning Missions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Plan, schedule, and review autonomous exterior window cleaning operations.
          </p>
        </div>

        <GradientButton onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Schedule Mission
        </GradientButton>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'draft', 'planned', 'in_progress', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              statusFilter === tab
                ? 'bg-primary/20 text-accent border border-primary/40 font-bold'
                : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-text-muted">
          Loading missions pipeline...
        </div>
      ) : filteredProjects.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto space-y-4">
          <CalendarCheck className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-display font-bold text-text-primary">
            No Missions in Current Pipeline
          </h3>
          <p className="text-xs text-text-secondary">
            Configure a new cleaning mission to deploy AeroClean AI autonomous drones.
          </p>
          <GradientButton onClick={handleOpenCreate} size="sm" icon={<Plus className="w-4 h-4" />}>
            Schedule New Mission
          </GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <GlassCard key={project.id} className="p-6 space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold ${
                      project.status === 'in_progress'
                        ? 'bg-primary/20 text-accent border border-primary/40 animate-pulse'
                        : project.status === 'completed'
                        ? 'bg-status-success/20 text-status-success border border-status-success/40'
                        : 'bg-surface-light text-text-secondary border border-border'
                    }`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => handleDelete(project.id, project.project_name)}
                    className="p-1.5 text-text-muted hover:text-status-danger rounded hover:bg-status-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-accent transition-colors">
                  {project.project_name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{project.building_name || 'Selected Facility'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                  <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>
                    {project.scheduled_date ? new Date(project.scheduled_date).toLocaleDateString() : 'Unscheduled'}
                  </span>
                </div>

                {project.notes && (
                  <p className="text-xs text-text-secondary bg-surface-light/40 p-2.5 rounded-xl border border-border/60">
                    {project.notes}
                  </p>
                )}
              </div>

              {/* Status Switcher Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-text-muted">Transition:</span>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                  className="bg-surface border border-border text-[11px] font-mono rounded-lg px-2 py-1 text-primary focus:outline-none focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-lg p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-display font-bold text-text-primary">
                Schedule Autonomous Mission
              </h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                  Mission Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Q4 South Facade Deep Restoration"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                  Target Building Profile *
                </label>
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.height_m}m, {b.window_area_sqm} m²)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                  Flight & Staging Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Coordinate rooftop tether umbilical with facility manager..."
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <GradientButton variant="ghost" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </GradientButton>
                <GradientButton type="submit" loading={saving}>
                  Launch Mission Plan
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
