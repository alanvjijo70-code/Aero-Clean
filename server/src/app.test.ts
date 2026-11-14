import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

const app = createApp();

describe('AeroClean AI Backend API Suite', () => {
  it('GET /api/v1/health should return system status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ONLINE');
  });

  it('POST /api/v1/estimates/calculate should correctly compute savings & time', async () => {
    const res = await request(app)
      .post('/api/v1/estimates/calculate')
      .send({
        window_area_sqm: 10000,
        building_height_m: 120,
        traditional_cost_per_sqm: 50,
        drone_cost_per_sqm: 25,
        traditional_productivity_sqm_h: 30,
        drone_productivity_sqm_h: 100,
        currency: 'INR'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.traditional_cost).toBe(500000);
    expect(res.body.data.drone_cost).toBe(250000);
    expect(res.body.data.estimated_savings).toBe(250000);
    expect(res.body.data.savings_percentage).toBe(50);
    expect(res.body.data.drone_hours).toBe(100);
    expect(res.body.data.time_saved_hours).toBeGreaterThan(0);
  });

  it('POST /api/v1/estimates/calculate should reject invalid inputs', async () => {
    const res = await request(app)
      .post('/api/v1/estimates/calculate')
      .send({
        window_area_sqm: -500, // Invalid negative area
        building_height_m: 100
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/contact should validate and accept valid message', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        full_name: 'Vikram Mehta',
        email: 'vikram@realty-group.in',
        subject: 'Inquiry for high-rise facade cleaning',
        message: 'We are requesting information regarding drone maintenance for a 40-storey tower.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/newsletter/subscribe should reject submission without consent', async () => {
    const res = await request(app)
      .post('/api/v1/newsletter/subscribe')
      .send({
        email: 'test@domain.com',
        consent: false
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/buildings should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/buildings');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/buildings should accept authenticated requests with demo bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/buildings')
      .set('Authorization', 'Bearer demo-user-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/ai/cleaning-analysis should generate structured analysis matching Zod schema', async () => {
    const res = await request(app)
      .post('/api/v1/ai/cleaning-analysis')
      .send({
        building_type: 'Commercial tower',
        building_height_m: 160,
        window_area_sqm: 12000,
        glass_type: 'Solar tint double pane',
        dirt_severity: 'moderate',
        environmental_exposure: 'Urban coastal environment'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('suitability');
    expect(res.body.data).toHaveProperty('confidence');
    expect(res.body.data).toHaveProperty('cleaning_challenges');
    expect(res.body.data).toHaveProperty('recommended_approach');
  });
});
