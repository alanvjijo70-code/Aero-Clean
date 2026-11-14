import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  full_name?: string;
  company_name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Fallback demo user for local test environments
export const DEMO_USER: AuthenticatedUser = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'director@vertexrealty.in',
  role: 'customer',
  full_name: 'Aditya Sharma',
  company_name: 'Vertex Commercial Towers'
};

export const DEMO_ADMIN: AuthenticatedUser = {
  id: 'b1ffcd88-8b1a-4de7-aa5c-5aa8ac270b22',
  email: 'admin@aeroclean.ai',
  role: 'admin',
  full_name: 'System Administrator',
  company_name: 'AeroClean AI Robotics'
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required: missing Bearer token', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];

  // If in demo mode or token is a test/demo token
  if (token.startsWith('demo-') || !isSupabaseConfigured || !supabaseAdmin) {
    if (token === 'demo-admin-token') {
      req.user = DEMO_ADMIN;
    } else {
      req.user = DEMO_USER;
    }
    return next();
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      logger.warn(`Failed token verification: ${error?.message || 'No user found'}`);
      return sendError(res, 'Invalid or expired authentication token', 'UNAUTHORIZED', 401);
    }

    // Fetch user profile for role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: (profile?.role as 'customer' | 'admin') || 'customer',
      full_name: profile?.full_name || user.user_metadata?.full_name,
      company_name: profile?.company_name || user.user_metadata?.company_name
    };

    next();
  } catch (err: any) {
    logger.error('Authentication verification exception:', err);
    return sendError(res, 'Authentication verification failed', 'AUTH_ERROR', 500);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (token.startsWith('demo-') || !isSupabaseConfigured || !supabaseAdmin) {
    req.user = token === 'demo-admin-token' ? DEMO_ADMIN : DEMO_USER;
    return next();
  }

  try {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email || '',
        role: (profile?.role as 'customer' | 'admin') || 'customer',
        full_name: profile?.full_name || user.user_metadata?.full_name,
        company_name: profile?.company_name || user.user_metadata?.company_name
      };
    }
  } catch (e) {
    // continue without setting req.user
  }
  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Administrative privilege required', 'FORBIDDEN', 403);
  }
  next();
};
