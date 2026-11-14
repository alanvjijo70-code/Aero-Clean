-- ====================================================================
-- AEROCLEAN AI - SEED DATA FOR DEMONSTRATION & LOCAL DEV
-- ====================================================================

-- Note: In a production Supabase project, user_ids must point to real auth.users records.
-- The demo script provides sample demo requests and newsletter subscribers.

INSERT INTO public.demo_requests (full_name, email, company_name, phone, country, building_type, height_m, window_area_sqm, message, status)
VALUES
  ('Aditya Sharma', 'aditya@vertexrealty.in', 'Vertex Commercial Towers', '+91 98765 43210', 'India', 'Commercial tower', 185.50, 14500.00, 'Interested in automated facade cleaning for our twin 50-storey towers in Bengaluru.', 'qualified'),
  ('Sarah Jenkins', 'sarah.j@skylinefacades.com', 'Skyline Facilities Global', '+1 415 555 0192', 'United States', 'Corporate office', 240.00, 22000.00, 'Evaluating autonomous robotics for quarterly high-rise maintenance.', 'new'),
  ('Tariq Al-Mansoor', 't.mansoor@gulfproperties.ae', 'Al-Mansoor Tower Management', '+971 50 123 4567', 'United Arab Emirates', 'Hotel', 310.00, 36000.00, 'Need high-wind resistant drone cleaning solutions for marine glass facade.', 'contacted')
ON CONFLICT DO NOTHING;

INSERT INTO public.newsletter_subscribers (email, company_name, consent)
VALUES
  ('newsletter-test@aeroclean.ai', 'AeroClean Research', true),
  ('engineering@vertexrealty.in', 'Vertex Commercial Towers', true),
  ('facilities@techpark-hub.com', 'TechPark Global', true)
ON CONFLICT (email) DO NOTHING;
