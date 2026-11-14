import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { DemoRequestInput } from '../validators/demo.schema.js';
import { ContactInput } from '../validators/contact.schema.js';
import { NewsletterInput } from '../validators/newsletter.schema.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

export interface DemoRequestRecord extends DemoRequestInput {
  id: string;
  user_id?: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  created_at: string;
}

export interface ContactRecord extends ContactInput {
  id: string;
  user_id?: string | null;
  created_at: string;
}

export interface NewsletterRecord extends NewsletterInput {
  id: string;
  created_at: string;
}

const memoryDemos: DemoRequestRecord[] = [
  {
    id: 'demo-001',
    full_name: 'Aditya Sharma',
    email: 'aditya@vertexrealty.in',
    company_name: 'Vertex Commercial Towers',
    phone: '+91 98765 43210',
    country: 'India',
    building_type: 'Commercial tower',
    height_m: 185.5,
    window_area_sqm: 14500,
    message: 'Interested in automated facade cleaning for our twin 50-storey towers in Bengaluru.',
    status: 'qualified',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

const memoryContacts: ContactRecord[] = [];
const memorySubscribers: NewsletterRecord[] = [
  {
    id: 'sub-001',
    email: 'engineering@vertexrealty.in',
    company_name: 'Vertex Commercial Towers',
    consent: true,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export class InquiryService {
  async createDemoRequest(input: DemoRequestInput, userId?: string): Promise<DemoRequestRecord> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('demo_requests')
        .insert({
          ...input,
          user_id: userId || null,
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating demo request in Supabase:', error);
        throw new Error(error.message);
      }
      return data;
    }

    const demo: DemoRequestRecord = {
      ...input,
      id: `demo-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId || null,
      status: 'new',
      created_at: new Date().toISOString()
    };
    memoryDemos.unshift(demo);
    return demo;
  }

  async getDemoRequests(): Promise<DemoRequestRecord[]> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    }
    return memoryDemos;
  }

  async updateDemoStatus(id: string, status: 'new' | 'contacted' | 'qualified' | 'closed'): Promise<DemoRequestRecord | null> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('demo_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const demo = memoryDemos.find((d) => d.id === id);
    if (!demo) return null;
    demo.status = status;
    return demo;
  }

  async createContactMessage(input: ContactInput, userId?: string): Promise<ContactRecord> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .insert({
          ...input,
          user_id: userId || null
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating contact message in Supabase:', error);
        throw new Error(error.message);
      }
      return data;
    }

    const contact: ContactRecord = {
      ...input,
      id: `contact-${crypto.randomUUID().slice(0, 8)}`,
      user_id: userId || null,
      created_at: new Date().toISOString()
    };
    memoryContacts.unshift(contact);
    return contact;
  }

  async subscribeNewsletter(input: NewsletterInput): Promise<{ subscriber: NewsletterRecord; alreadySubscribed: boolean }> {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', input.email)
        .single();

      if (existing) {
        return { subscriber: existing, alreadySubscribed: true };
      }

      const { data, error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({
          email: input.email,
          company_name: input.company_name || null,
          consent: input.consent
        })
        .select()
        .single();

      if (error) {
        logger.error('Error subscribing newsletter in Supabase:', error);
        throw new Error(error.message);
      }

      return { subscriber: data, alreadySubscribed: false };
    }

    const existing = memorySubscribers.find((s) => s.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      return { subscriber: existing, alreadySubscribed: true };
    }

    const newSub: NewsletterRecord = {
      ...input,
      id: `sub-${crypto.randomUUID().slice(0, 8)}`,
      created_at: new Date().toISOString()
    };
    memorySubscribers.unshift(newSub);
    return { subscriber: newSub, alreadySubscribed: false };
  }
}

export const inquiryService = new InquiryService();
