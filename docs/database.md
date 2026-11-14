# AeroClean AI — PostgreSQL Database Specification & RLS Policies

## 1. Schema Summary

The database architecture is implemented for Supabase PostgreSQL with 8 production tables, foreign keys with appropriate deletion behaviors, updated-at triggers, and Row Level Security (RLS) policies.

Migration location: `supabase/migrations/20261114000000_initial_schema.sql`

---

## 2. Table Specifications

### 2.1 `profiles`
Stores enterprise user profile attributes synced from `auth.users`.
- `id` (UUID, PK, references `auth.users(id)` ON DELETE CASCADE)
- `full_name` (TEXT)
- `company_name` (TEXT)
- `phone` (TEXT)
- `role` (TEXT, check in `('customer', 'admin')`, default `'customer'`)
- `created_at` (TIMESTAMPTZ, default `NOW()`)
- `updated_at` (TIMESTAMPTZ, default `NOW()`)

### 2.2 `buildings`
High-rise building assets registered by property directors.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
- `name` (TEXT, NOT NULL)
- `building_type` (TEXT, NOT NULL)
- `address` (TEXT)
- `city` (TEXT)
- `country` (TEXT)
- `height_m` (NUMERIC(10,2), check `> 0`)
- `floors` (INTEGER, check `> 0`)
- `window_area_sqm` (NUMERIC(12,2), check `> 0`)
- `glass_type` (TEXT)
- `dirt_severity` (TEXT, check in `('light', 'moderate', 'heavy')`, default `'moderate'`)
- `cleaning_frequency` (TEXT)
- `last_cleaned_at` (DATE)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2.3 `cleaning_projects`
Autonomous cleaning missions planned or executed on building profiles.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
- `building_id` (UUID, references `public.buildings(id)` ON DELETE CASCADE)
- `project_name` (TEXT, NOT NULL)
- `status` (TEXT, check in `('draft', 'planned', 'in_progress', 'completed', 'cancelled')`)
- `scheduled_date` (TIMESTAMPTZ)
- `notes` (TEXT)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2.4 `cost_estimates`
Archived financial comparisons and turnaround time models.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
- `building_id` (UUID, references `public.buildings(id)` ON DELETE SET NULL)
- `project_id` (UUID, references `public.cleaning_projects(id)` ON DELETE SET NULL)
- `window_area_sqm` (NUMERIC(12,2), check `> 0`)
- `building_height_m` (NUMERIC(10,2), check `> 0`)
- `traditional_cost` (NUMERIC(14,2), check `>= 0`)
- `drone_cost` (NUMERIC(14,2), check `>= 0`)
- `estimated_savings` (NUMERIC(14,2))
- `savings_percentage` (NUMERIC(7,2))
- `traditional_hours` (NUMERIC(10,2))
- `drone_hours` (NUMERIC(10,2))
- `currency` (TEXT, default `'INR'`)
- `assumptions` (JSONB, default `'{}'::jsonb`)
- `created_at` (TIMESTAMPTZ)

### 2.5 `ai_consultations`
Audit logs of Gemini AI advisory queries and responses.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
- `building_id` (UUID, references `public.buildings(id)` ON DELETE SET NULL)
- `question` (TEXT, NOT NULL)
- `response` (JSONB, NOT NULL)
- `model_name` (TEXT)
- `created_at` (TIMESTAMPTZ)

### 2.6 `demo_requests`
Enterprise flight demonstration requests submitted from public forms.
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE SET NULL)
- `full_name` (TEXT, NOT NULL)
- `email` (TEXT, NOT NULL)
- `company_name` (TEXT)
- `phone` (TEXT)
- `country` (TEXT)
- `building_type` (TEXT)
- `height_m` (NUMERIC(10,2))
- `window_area_sqm` (NUMERIC(12,2))
- `message` (TEXT)
- `status` (TEXT, check in `('new', 'contacted', 'qualified', 'closed')`, default `'new'`)
- `created_at` (TIMESTAMPTZ)

### 2.7 `newsletter_subscribers`
- `id` (UUID, PK, default `gen_random_uuid()`)
- `email` (TEXT, UNIQUE, NOT NULL)
- `company_name` (TEXT)
- `consent` (BOOLEAN, check `= true`)
- `created_at` (TIMESTAMPTZ)

### 2.8 `contact_messages`
- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, references `auth.users(id)` ON DELETE SET NULL)
- `full_name` (TEXT, NOT NULL)
- `email` (TEXT, NOT NULL)
- `subject` (TEXT)
- `message` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ)

---

## 3. Row Level Security (RLS) Policies

All tables have RLS enabled:
- **`profiles`:** Users can `SELECT` and `UPDATE` only where `auth.uid() = id`.
- **`buildings`:** Owner isolation where `auth.uid() = user_id` for `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- **`cleaning_projects`:** Owner isolation where `auth.uid() = user_id`.
- **`cost_estimates`:** Owner isolation where `auth.uid() = user_id`.
- **`ai_consultations`:** Owner isolation where `auth.uid() = user_id`.
- **`demo_requests` & `contact_messages`:** Public `INSERT` allowed with `WITH CHECK (true)`. `SELECT` allowed only for authenticated resource owners (`auth.uid() = user_id`) or administrative role.
- **`newsletter_subscribers`:** Public `INSERT` with `WITH CHECK (true)` and strict consent enforcement.
