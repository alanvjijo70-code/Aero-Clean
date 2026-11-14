-- ====================================================================
-- AEROCLEAN AI - INITIAL SUPABASE POSTGRESQL SCHEMA
-- Migration: 20261114000000_initial_schema.sql
-- ====================================================================

-- 1. Enable UUID Extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Updated-At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Table: Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: Buildings
CREATE TABLE IF NOT EXISTS public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  building_type TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  height_m NUMERIC(10,2) NOT NULL CHECK (height_m > 0),
  floors INTEGER CHECK (floors > 0),
  window_area_sqm NUMERIC(12,2) NOT NULL CHECK (window_area_sqm > 0),
  glass_type TEXT,
  dirt_severity TEXT DEFAULT 'moderate'
    CHECK (dirt_severity IN ('light', 'moderate', 'heavy')),
  cleaning_frequency TEXT,
  last_cleaned_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table: Cleaning Projects
CREATE TABLE IF NOT EXISTS public.cleaning_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'planned', 'in_progress', 'completed', 'cancelled')),
  scheduled_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Table: Cost Estimates
CREATE TABLE IF NOT EXISTS public.cost_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.cleaning_projects(id) ON DELETE SET NULL,
  window_area_sqm NUMERIC(12,2) NOT NULL CHECK (window_area_sqm > 0),
  building_height_m NUMERIC(10,2) NOT NULL CHECK (building_height_m > 0),
  traditional_cost NUMERIC(14,2) NOT NULL CHECK (traditional_cost >= 0),
  drone_cost NUMERIC(14,2) NOT NULL CHECK (drone_cost >= 0),
  estimated_savings NUMERIC(14,2) NOT NULL,
  savings_percentage NUMERIC(7,2) NOT NULL,
  traditional_hours NUMERIC(10,2) NOT NULL,
  drone_hours NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  assumptions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Table: AI Consultations
CREATE TABLE IF NOT EXISTS public.ai_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  response JSONB NOT NULL,
  model_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Table: Demo Requests
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  country TEXT,
  building_type TEXT,
  height_m NUMERIC(10,2),
  window_area_sqm NUMERIC(12,2),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Table: Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  company_name TEXT,
  consent BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent = true),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Table: Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE & FAST LOOKUPS
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_buildings_user_id ON public.buildings(user_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_projects_user_id ON public.cleaning_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_projects_building_id ON public.cleaning_projects(building_id);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_user_id ON public.cost_estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_building_id ON public.cost_estimates(building_id);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_user_id ON public.ai_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_created_at ON public.ai_consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON public.demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON public.demo_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

-- ====================================================================
-- TRIGGERS
-- ====================================================================
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_buildings_updated_at ON public.buildings;
CREATE TRIGGER set_buildings_updated_at
  BEFORE UPDATE ON public.buildings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_cleaning_projects_updated_at ON public.cleaning_projects;
CREATE TRIGGER set_cleaning_projects_updated_at
  BEFORE UPDATE ON public.cleaning_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & update their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Buildings: Owner isolation
CREATE POLICY "Users can read own buildings"
  ON public.buildings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buildings"
  ON public.buildings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buildings"
  ON public.buildings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own buildings"
  ON public.buildings FOR DELETE
  USING (auth.uid() = user_id);

-- Cleaning Projects: Owner isolation
CREATE POLICY "Users can read own projects"
  ON public.cleaning_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON public.cleaning_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.cleaning_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.cleaning_projects FOR DELETE
  USING (auth.uid() = user_id);

-- Cost Estimates: Owner isolation
CREATE POLICY "Users can read own estimates"
  ON public.cost_estimates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own estimates"
  ON public.cost_estimates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own estimates"
  ON public.cost_estimates FOR DELETE
  USING (auth.uid() = user_id);

-- AI Consultations: Owner isolation
CREATE POLICY "Users can read own AI consultations"
  ON public.ai_consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI consultations"
  ON public.ai_consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Demo Requests: Public insert, user read if linked or admin
CREATE POLICY "Anyone can submit demo requests"
  ON public.demo_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own demo requests"
  ON public.demo_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Newsletter Subscribers: Public insert, restricted select
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Contact Messages: Public insert
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own contact messages"
  ON public.contact_messages FOR SELECT
  USING (auth.uid() = user_id);
