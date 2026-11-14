import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { ProjectInput, UpdateProjectInput } from '../validators/project.schema.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export interface ProjectRecord extends ProjectInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  building_name?: string;
}

const memoryProjects: Map<string, ProjectRecord> = new Map([
  [
    'proj-001',
    {
      id: 'proj-001',
      user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      building_id: 'bldg-001',
      project_name: 'Q4 Complete Facade Restoration',
      status: 'in_progress',
      scheduled_date: new Date(Date.now() + 2 * 86400000).toISOString(),
      notes: 'South and West faces require secondary wash cycle due to highway particulate.',
      building_name: 'Vertex Horizon Tower A',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  [
    'proj-002',
    {
      id: 'proj-002',
      user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      building_id: 'bldg-002',
      project_name: 'Annual Solar Glazing Wash',
      status: 'planned',
      scheduled_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      notes: 'Coordinate roof tether with facility manager Mr. Rao.',
      building_name: 'Skyline Pinnacle Tech Hub',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
]);

export class ProjectService {
  async getProjectsByUser(userId: string): Promise<ProjectRecord[]> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cleaning_projects')
        .select(`
          *,
          buildings (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching projects from Supabase:', error);
        throw new Error(error.message);
      }

      return (data || []).map((p: any) => ({
        ...p,
        building_name: p.buildings?.name || 'Assigned Building'
      }));
    }

    return Array.from(memoryProjects.values()).filter(
      (p) => p.user_id === userId || userId === 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    );
  }

  async getProjectById(id: string, userId: string): Promise<ProjectRecord | null> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cleaning_projects')
        .select(`
          *,
          buildings (
            name
          )
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }

      return {
        ...data,
        building_name: (data as any).buildings?.name
      };
    }

    const proj = memoryProjects.get(id);
    if (!proj || (proj.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return null;
    }
    return proj;
  }

  async createProject(userId: string, input: ProjectInput): Promise<ProjectRecord> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cleaning_projects')
        .insert({
          ...input,
          user_id: userId
        })
        .select(`*, buildings (name)`)
        .single();

      if (error) {
        logger.error('Error creating project in Supabase:', error);
        throw new Error(error.message);
      }

      return {
        ...data,
        building_name: (data as any).buildings?.name
      };
    }

    const newProject: ProjectRecord = {
      ...input,
      id: `proj-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId,
      building_name: 'Selected Building',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryProjects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: string, userId: string, input: UpdateProjectInput): Promise<ProjectRecord | null> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('cleaning_projects')
        .update({
          ...input,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select(`*, buildings (name)`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }

      return {
        ...data,
        building_name: (data as any).buildings?.name
      };
    }

    const existing = memoryProjects.get(id);
    if (!existing || (existing.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return null;
    }

    const updated: ProjectRecord = {
      ...existing,
      ...input,
      updated_at: new Date().toISOString()
    };
    memoryProjects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('cleaning_projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return true;
    }

    const existing = memoryProjects.get(id);
    if (!existing || (existing.user_id !== userId && userId !== 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')) {
      return false;
    }
    return memoryProjects.delete(id);
  }
}

export const projectService = new ProjectService();
