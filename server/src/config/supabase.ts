import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let supabaseAdmin: SupabaseClient | null = null;
let supabaseAnon: SupabaseClient | null = null;

const isConfigured = 
  Boolean(env.SUPABASE_URL) && 
  Boolean(env.SUPABASE_SERVICE_ROLE_KEY) && 
  !env.SUPABASE_URL?.includes('placeholder') &&
  !env.SUPABASE_SERVICE_ROLE_KEY?.includes('placeholder');

if (isConfigured && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    if (env.SUPABASE_ANON_KEY) {
      supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    }

    logger.info('Supabase clients initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Supabase client:', error);
  }
} else {
  logger.warn('Supabase is not configured or uses placeholder credentials. Running with fallback simulation storage.');
}

export { supabaseAdmin, supabaseAnon, isConfigured as isSupabaseConfigured };
