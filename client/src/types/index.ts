export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface Building {
  id: string;
  user_id: string;
  name: string;
  building_type: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  height_m: number;
  floors?: number | null;
  window_area_sqm: number;
  glass_type?: string | null;
  dirt_severity: 'light' | 'moderate' | 'heavy';
  cleaning_frequency?: string | null;
  last_cleaned_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CleaningProject {
  id: string;
  user_id: string;
  building_id: string;
  project_name: string;
  status: 'draft' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date?: string | null;
  notes?: string | null;
  building_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CostEstimate {
  id: string;
  user_id: string;
  building_id?: string | null;
  project_id?: string | null;
  window_area_sqm: number;
  building_height_m: number;
  traditional_cost: number;
  drone_cost: number;
  estimated_savings: number;
  savings_percentage: number;
  traditional_hours: number;
  drone_hours: number;
  time_saved_hours: number;
  time_saved_percentage: number;
  currency: string;
  assumptions: Record<string, any>;
  disclaimer?: string;
  created_at: string;
}

export interface SuitabilityAnalysis {
  suitability: 'suitable' | 'conditionally_suitable' | 'requires_assessment';
  confidence: number;
  building_summary: string;
  cleaning_challenges: string[];
  recommended_approach: string;
  suggested_frequency: string;
  safety_considerations: string[];
  limitations: string[];
  explanation: string;
}

export interface CleaningStage {
  step: number;
  name: string;
  description: string;
  estimated_minutes: number;
}

export interface OperationalPlan {
  plan_title: string;
  estimated_duration_hours: number;
  cleaning_stages: CleaningStage[];
  operational_notes: string[];
  safety_notes: string[];
}

export interface AdvisoryRecommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface BuildingAdvisory {
  summary: string;
  observations: string[];
  recommendations: AdvisoryRecommendation[];
  estimated_benefits: string[];
  risks: string[];
  next_steps: string[];
  disclaimer: string;
}

export interface ConsultationRecord {
  id: string;
  question: string;
  response: any;
  created_at: string;
}

export interface DemoRequest {
  id?: string;
  full_name: string;
  email: string;
  company_name: string;
  phone: string;
  country: string;
  building_type: string;
  height_m: number;
  window_area_sqm: number;
  message?: string | null;
  status?: string;
  created_at?: string;
}

export interface ContactMessage {
  full_name: string;
  email: string;
  subject?: string;
  message: string;
}
