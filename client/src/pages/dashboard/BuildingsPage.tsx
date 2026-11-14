import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { GlassCard } from '../../components/common/GlassCard.js';
import { GradientButton } from '../../components/common/GradientButton.js';
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Calculator,
  Bot,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const BuildingsPage: React.FC = () => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [buildingType, setBuildingType] = useState('Commercial tower');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [heightM, setHeightM] = useState<number>(150);
  const [floors, setFloors] = useState<number>(40);
  const [windowAreaSqm, setWindowAreaSqm] = useState<number>(12000);
  const [glassType, setGlassType] = useState('Low-E Double Glazed');
  const [dirtSeverity, setDirtSeverity] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const [cleaningFrequency, setCleaningFrequency] = useState('Monthly');
  const [saving, setSaving] = useState(false);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await api.getBuildings();
      setBuildings(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch buildings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setBuildingType('Commercial tower');
    setAddress('');
    setCity('Bengaluru');
    setCountry('India');
    setHeightM(160);
    setFloors(45);
    setWindowAreaSqm(14000);
    setGlassType('Low-E Double Glazed');
    setDirtSeverity('moderate');
    setCleaningFrequency('Monthly');
    setShowModal(true);
  };

  const handleOpenEdit = (bldg: any) => {
    setEditingId(bldg.id);
    setName(bldg.name);
    setBuildingType(bldg.building_type);
    setAddress(bldg.address || '');
    setCity(bldg.city || '');
    setCountry(bldg.country || '');
    setHeightM(bldg.height_m);
    setFloors(bldg.floors || 30);
    setWindowAreaSqm(bldg.window_area_sqm);
    setGlassType(bldg.glass_type || 'Low-E Double Glazed');
    setDirtSeverity(bldg.dirt_severity || 'moderate');
    setCleaningFrequency(bldg.cleaning_frequency || 'Monthly');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || heightM <= 0 || windowAreaSqm <= 0) {
      toast.error('Please enter building name, height, and valid window area');
      return;
    }

    setSaving(true);
    const payload = {
      name,
      building_type: buildingType,
      address,
      city,
      country,
      height_m: Number(heightM),
      floors: Number(floors),
      window_area_sqm: Number(windowAreaSqm),
      glass_type: glassType,
      dirt_severity: dirtSeverity,
      cleaning_frequency: cleaningFrequency
    };

    try {
      if (editingId) {
        await api.updateBuilding(editingId, payload);
        toast.success('Building profile updated successfully');
      } else {
        await api.createBuilding(payload);
        toast.success('Building added to enterprise portfolio');
      }
      setShowModal(false);
      fetchBuildings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save building');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your portfolio?`)) {
      return;
    }
    try {
      await api.deleteBuilding(id);
      toast.success('Building deleted');
      fetchBuildings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete building');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
            Building Portfolio Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Register and monitor exterior glazing geometries for autonomous drone deployments.
          </p>
        </div>

        <GradientButton onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Add Building Profile
        </GradientButton>
      </div>

      {/* Buildings Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-text-muted">
          Loading building geometries...
        </div>
      ) : buildings.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto space-y-4">
          <Building2 className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-lg font-display font-bold text-text-primary">
            No Buildings Registered
          </h3>
          <p className="text-xs text-text-secondary">
            Add your first high-rise building profile to enable automated cost estimations and Gemini AI suitability audits.
          </p>
          <GradientButton onClick={handleOpenCreate} size="sm" icon={<Plus className="w-4 h-4" />}>
            Add First Building
          </GradientButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((bldg) => (
            <GlassCard key={bldg.id} className="p-6 space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/30">
                    {bldg.building_type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(bldg)}
                      className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-white/5 transition-colors"
                      title="Edit Building"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(bldg.id, bldg.name)}
                      className="p-1.5 text-text-muted hover:text-status-danger rounded hover:bg-status-danger/10 transition-colors"
                      title="Delete Building"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-accent transition-colors">
                  {bldg.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{bldg.city ? `${bldg.city}, ${bldg.country}` : 'Location unlisted'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-surface-light">
                    <span className="text-text-muted text-[10px] block">Height / Floors</span>
                    <span className="text-text-primary font-bold">{bldg.height_m}m ({bldg.floors || '—'} fl)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-light">
                    <span className="text-text-muted text-[10px] block">Window Area</span>
                    <span className="text-primary font-bold">{bldg.window_area_sqm?.toLocaleString()} m²</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-text-secondary flex justify-between pt-1">
                  <span>Dirt: <strong className="text-accent uppercase">{bldg.dirt_severity}</strong></span>
                  <span>Glass: <strong className="text-text-primary">{bldg.glass_type || 'Standard'}</strong></span>
                </div>
              </div>

              {/* Quick AI & Estimate Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Link
                  to="/dashboard/ai-advisor"
                  state={{ building: bldg }}
                  className="flex-1 text-center py-1.5 px-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-accent text-[11px] font-mono transition-colors border border-primary/30 flex items-center justify-center gap-1"
                >
                  <Bot className="w-3 h-3 text-primary" />
                  <span>AI Audit</span>
                </Link>
                <Link
                  to="/estimate"
                  state={{ height: bldg.height_m, area: bldg.window_area_sqm }}
                  className="flex-1 text-center py-1.5 px-2 rounded-lg bg-surface-light hover:bg-white/10 text-text-primary text-[11px] font-mono transition-colors border border-border flex items-center justify-center gap-1"
                >
                  <Calculator className="w-3 h-3 text-secondary" />
                  <span>Cost ROI</span>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-display font-bold text-text-primary">
                {editingId ? 'Edit Building Profile' : 'Register New Building'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                  Building Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vertex Horizon Tower A"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Building Type *
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="Commercial tower">Commercial tower</option>
                    <option value="Residential tower">Residential tower</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Corporate office">Corporate office</option>
                    <option value="Industrial facility">Industrial facility</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Glass / Glazing Type
                  </label>
                  <input
                    type="text"
                    value={glassType}
                    onChange={(e) => setGlassType(e.target.value)}
                    placeholder="Low-E Double Glazed"
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Height (m) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={heightM}
                    onChange={(e) => setHeightM(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Window Area (m²) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={windowAreaSqm}
                    onChange={(e) => setWindowAreaSqm(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Dirt Severity
                  </label>
                  <select
                    value={dirtSeverity}
                    onChange={(e) => setDirtSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="light">Light Atmospheric Dust</option>
                    <option value="moderate">Moderate Urban Residue</option>
                    <option value="heavy">Heavy Grime / Calcified</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Preferred Frequency
                  </label>
                  <input
                    type="text"
                    value={cleaningFrequency}
                    onChange={(e) => setCleaningFrequency(e.target.value)}
                    placeholder="Monthly"
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-text-muted block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <GradientButton
                  variant="ghost"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </GradientButton>
                <GradientButton
                  type="submit"
                  loading={saving}
                >
                  {editingId ? 'Save Changes' : 'Create Building'}
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
