import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { BuildingInput, UpdateBuildingInput } from '../validators/building.schema.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export interface BuildingRecord extends BuildingInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// In-memory fallback repository for testing / zero-config demo
const memoryBuildings: Map<string, BuildingRecord> = new Map([
  [
    'bldg-001',
    {
      id: 'bldg-001',
      user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Vertex Horizon Tower A',
      building_type: 'Commercial tower',
      address: 'Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      country: 'India',
      height_m: 185.5,
      floors: 46,
      window_area_sqm: 14500,
      glass_type: 'Low-E Double Glazed',
      dirt_severity: 'moderate',
      cleaning_frequency: 'Monthly',
      last_cleaned_at: '2026-09-15',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ],
  [
    'bldg-002',
    {
      id: 'bldg-002',
      user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Skyline Pinnacle Tech Hub',
      building_type: 'Corporate office',
      address: 'Cyber City, Sector 24',
      city: 'Gurugram',
      country: 'India',
      height_m: 120.0,
      floors: 30,
      window_area_sqm: 9800,
      glass_type: 'Solar Reflective Monolithic',
      dirt_severity: 'heavy',
      cleaning_frequency: 'Bi-weekly',
      last_cleaned_at: '2026-10-01',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ]
]);

export class BuildingService {
  async getBuildingsByUser(userId: string): Promise<BuildingRecord[]> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('buildings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching buildings from Supabase:', error);
        throw new Error(error.message);
      }
      return data as BuildingRecord[];
    }

    return Array.from(memoryBuildings.values()).filter(
      (b) => b.user_id === userId || userId === 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    );
  }

  async getBuildingById(id: string, userId: string): Promise<BuildingRecord | null> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('buildings')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // not found
        throw new Error(error.message);
      }
      return data as BuildingRecord;
    }

    const bldg = memoryBuildings.get(id);
    if (!bldg || (bldg.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return null;
    }
    return bldg;
  }

  async createBuilding(userId: string, input: BuildingInput): Promise<BuildingRecord> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('buildings')
        .insert({
          ...input,
          user_id: userId
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating building in Supabase:', error);
        throw new Error(error.message);
      }
      return data as BuildingRecord;
    }

    const newBuilding: BuildingRecord = {
      ...input,
      id: `bldg-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryBuildings.set(newBuilding.id, newBuilding);
    return newBuilding;
  }

  async updateBuilding(id: string, userId: string, input: UpdateBuildingInput): Promise<BuildingRecord | null> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('buildings')
        .update({
          ...input,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }
      return data as BuildingRecord;
    }

    const existing = memoryBuildings.get(id);
    if (!existing || (existing.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return null;
    }

    const updated: BuildingRecord = {
      ...existing,
      ...input,
      updated_at: new Date().toISOString()
    };
    memoryBuildings.set(id, updated);
    return updated;
  }

  async deleteBuilding(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('buildings')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    }

    const existing = memoryBuildings.get(id);
    if (!existing || (existing.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return false;
    }
    return memoryBuildings.delete(id);
  }
}

export const buildingService = new BuildingService();
