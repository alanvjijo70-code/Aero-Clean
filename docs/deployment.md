# AeroClean AI — Production Deployment Guide

This guide details deploying AeroClean AI to production using **Vercel** (Frontend), **Render / Railway** (Backend), and **Supabase** (PostgreSQL Database & Authentication).

---

## 1. Supabase Database & Auth Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Paste and execute `supabase/migrations/20261114000000_initial_schema.sql`.
4. (Optional) Run `supabase/seed.sql` to populate sample demonstrations.
5. In **Project Settings -> API**, obtain:
   - `Project URL`
   - `anon public` key
   - `service_role` secret key (Keep private; never expose to frontend).
6. In **Authentication -> URL Configuration**, set Site URL to your frontend production domain (e.g. `https://aeroclean-ai.vercel.app`).

---

## 2. Backend Deployment (Render or Railway)

### Using Render:
1. Connect your GitHub repository to Render as a **Web Service**.
2. Root Directory: `server`.
3. Environment: `Node`.
4. Build Command: `npm install && npm run build`.
5. Start Command: `npm start`.
6. Configure Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_URL=https://aeroclean-ai.vercel.app`
   - `SUPABASE_URL=https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY=your-supabase-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key`
   - `GEMINI_API_KEY=your-google-gemini-api-key`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `JWT_SECRET=your-random-production-secret`

---

## 3. Frontend Deployment (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Root Directory: `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Configure Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`
   - `VITE_SUPABASE_URL=https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`
7. Deploy.
