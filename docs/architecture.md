# AeroClean AI — System Architecture & Engineering Blueprint

## 1. Executive Summary

AeroClean AI is an enterprise robotics software platform designed for autonomous high-rise window cleaning and exterior facade maintenance. The application bridges interactive 3D WebGL aerospace simulations, server-side Google Gemini 2.5 generative AI consultations, and a full multi-tenant PostgreSQL / Supabase portal.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React + Vite)                     │
│  - Three.js / React Three Fiber / Drei (3D Drone Interactive Twin)     │
│  - Tailwind CSS Deep Aerospace Design System (#050B16 palette)         │
│  - Framer Motion Micro-Animations & Responsive Workflows              │
│  - React Hook Form + Zod Client-Side Validation                        │
│  - Recharts Portfolio Analytics & ROI Visualizers                      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / REST JSON
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Node.js + Express)                    │
│  - Modular Express Router (/api/v1)                                    │
│  - Helmet Security Headers & Strict CORS Isolation                     │
│  - Rate Limiting (Standard 200/15m, AI Operations 20/m)                │
│  - Supabase Bearer JWT Token Verification Middleware                   │
│  - Zod Request & AI Response Schema Enforcement                        │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│      GOOGLE GEMINI 2.5 AI SDK        │   │    SUPABASE POSTGRESQL      │
│  - Official @google/genai SDK        │   │  - Row Level Security (RLS) │
│  - Structured JSON Schemas           │   │  - 8 Application Tables     │
│  - Suitability Analysis              │   │  - Cascade Constraints      │
│  - Staged Operational Plans          │   │  - Performance B-Tree Index │
│  - System Prompts & Safety Guardrails│   │  - Updated-At Triggers      │
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 2. Interactive 3D Drone Architecture

The signature visual centerpiece of AeroClean AI is built using Three.js and `@react-three/fiber`:

1. **Fuselage & Aerodynamic Fairing:** High-modulus carbon-fiber body with titanium bevels and active cyan status LED strips.
2. **Propulsion Dynamics:** 4 carbon arms with counter-rotating dual-blade propellers spinning with delta-time frame synchronization.
3. **Sensor Array:** 360-degree rotating LiDAR turret dome with ultrasonic sensors maintaining a 15cm safety standoff buffer.
4. **AI Gimbal Turret:** Dual stereoscopic 4K lenses with an animated projected volumetric scanning fan cone.
5. **Underbody Hybrid Cleaning Assembly:** 
   - Electrostatic atomized fluid manifold (4.5 bar).
   - High-speed microfiber oscillation roller (300 RPM).
   - Streak-free hydrophobic silicone squeegee extraction blade.
   - Downward multispectral optical verification camera.
6. **3D Telemetry Hotspots:** Four interactive Html nodes positioned at key mechanical coordinates.
7. **Graceful WebGL Fallback:** Integrated fallback schematic automatically mounts if hardware acceleration is unavailable.

---

## 3. Artificial Intelligence Engine (Google Gemini)

All AI operations originate from the backend using the official `@google/genai` SDK:

- **System Persona:** Professional, safety-conscious aerospace advisor adhering to aviation compliance guidelines.
- **Safety Directives:** Mandatory caveats that drone operations require site-specific risk assessments, certified engineering reviews, and local aviation clearances.
- **Structured JSON Mode:** Enforces schema consistency across:
  - `POST /api/v1/ai/cleaning-analysis` (Suitability score, challenges, approach, frequency).
  - `POST /api/v1/ai/operational-plan` (Duration, 5-stage cleaning steps with minutes, safety notes).
  - `POST /api/v1/ai/advisor` (Executive recommendations, risk matrices, next steps).
- **Zod Validation:** Every AI generation is parsed and validated by backend Zod schemas before being delivered to the client.

---

## 4. Security & Compliance Architecture

- **Token-Based Authentication:** Protected endpoints verify Supabase JWT access tokens.
- **Data Isolation:** PostgreSQL Row Level Security enforces that `auth.uid() = user_id`.
- **Zero Client Secret Exposure:** Gemini API keys and Supabase service role keys reside strictly in backend server environments.
- **Input Sanitization:** Dual-layer Zod validation rejects out-of-range numeric heights, invalid areas, and malformed emails.
- **Rate Limiting:** Protects backend endpoints against brute force and automated request flooding.
