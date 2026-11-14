# AeroClean AI — Autonomous High-Rise Window Cleaning Drone Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-black.svg?logo=three.js)](https://threejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg?logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_RLS-emerald.svg?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4_Deep_Aerospace-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)

> **AeroClean AI** is an enterprise-grade autonomous robotics platform transforming commercial skyscraper facade maintenance. Engineered to eliminate human high-altitude exposure, the platform combines interactive 3D digital twins, server-side Google Gemini 2.5 artificial intelligence, and a multi-tenant enterprise portal.

---

## 🚀 Key Platform Features

### 1. Interactive 3D Drone Digital Twin (`Three.js` & `@react-three/fiber`)
- **Realistic Procedural Model:** Carbon-fiber aerodynamic chassis, 4 quad-rotor cantilevered booms with spinning propellers, 360° LiDAR dome, and underbody hybrid cleaning assembly.
- **Interactive Telemetry Hotspots:** Clickable 3D nodes inspecting LiDAR sensors, AI dirt detection optical gimbal, surfactant atomizers, and post-clean verification cameras.
- **Camera Controls:** Damped OrbitControls, zoom limits, auto-orbiting toggle, and camera reset.
- **Hardware-Accelerated Fallback:** Seamless animated 2.5D architectural schematic for low-power or non-WebGL devices.

### 2. Six-Stage Hybrid Cleaning Workflow Simulation
- Interactive visualization of the multi-stage facade restoration lifecycle:
  1. **Scan:** 100 Hz LiDAR mapping with 15cm buffered standoff.
  2. **Detect:** Real-time 60 FPS convolutional neural dirt classification.
  3. **Apply:** 4.5 bar electrostatic deionized surfactant atomization.
  4. **Wipe:** 300 RPM counter-oscillating soft microfiber scrub pads (12N force).
  5. **Finish:** Hydrophobic silicone squeegee moisture extraction.
  6. **Verify:** Multispectral optical clarity audit with certified compliance logging.

### 3. Interactive ROI & Turnaround Estimator
- Dynamic sliders for building height ($20\text{m} - 500\text{m}$) and total glazing area ($500\text{m}^2 - 50,000\text{m}^2$).
- Multi-currency support (INR `₹`, USD `$`, AED `د.إ`, EUR `€`, SGD `S$`).
- Configurable unit rates, productivity benchmarks, and super-tall high-rise rigging risk multipliers.
- Real-time comparison bars and saved estimates portfolio integration.

### 4. Google Gemini 2.5 AI Advisor (`@google/genai`)
- **Suitability Analysis:** Multi-factor analysis of height, glass type, dirt severity, and environmental winds.
- **Operational Cleaning Plans:** 5-stage cleaning duration breakdown (hours/minutes) and site safety directives.
- **Executive Building Advisory:** Prioritized recommendations (High, Medium, Low), operational risk matrices, and next steps.
- **Zero-Crash Resilience:** Includes calibrated fallback response generation when credentials are unconfigured.

### 5. Multi-Tenant Enterprise Portal
- **Dashboard Overview:** Executive KPI stat cards, Recharts comparative expenditure charts, and live fleet telemetry simulator.
- **Building Portfolio:** Complete CRUD for facility profiles with glass type, height, and dirt severity.
- **Cleaning Missions:** Mission status pipeline (`draft`, `planned`, `in_progress`, `completed`, `cancelled`).
- **Saved Estimates:** Archive and inspect financial comparison models.
- **Account Profiles:** Role-based access control (`customer` vs `admin`) and system connectivity status.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Three.js, React Three Fiber, React Three Drei, Framer Motion, Lucide React, Recharts, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, TypeScript, Official `@google/genai` SDK, `@supabase/supabase-js`, Zod, Helmet, CORS, Express Rate Limit |
| **Database & Auth** | Supabase PostgreSQL, Row Level Security (RLS), Triggers, B-Tree Indexes |
| **Testing** | Vitest, Supertest |
| **Design System** | Deep Aerospace Theme (`#050B16` background, `#00D9FF` cyan primary, glassmorphic panels) |

---

## 📁 Repository Structure

```
aeroclean-ai/
│
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # GlassCard, GradientButton, SectionHeading, etc.
│   │   │   ├── layout/         # Navbar, Footer, DashboardLayout, MobileNav
│   │   │   ├── landing/        # HeroSection, FeatureGrid, ImpactSection, etc.
│   │   │   ├── drone/          # DroneModel, InteractiveDroneCanvas, Fallback
│   │   │   └── forms/          # CostEstimator, DemoRequestForm, ContactForm
│   │   ├── pages/
│   │   │   ├── public/         # Home, Technology, HowItWorks, Estimate, Contact, About
│   │   │   ├── auth/           # Login, Register, ForgotPassword
│   │   │   └── dashboard/      # Overview, Buildings, Projects, Estimates, AiAdvisor
│   │   ├── contexts/           # AuthContext (with Instant Demo Mode)
│   │   └── lib/                # API client, Supabase client
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # Gemini SDK, Supabase, Environment config
│   │   ├── controllers/        # AI, Buildings, Projects, Estimates, Inquiries
│   │   ├── middleware/         # Auth, Zod Validation, Rate Limiters, Errors
│   │   ├── routes/             # REST API routes (/api/v1)
│   │   ├── services/           # Gemini AI service, Building, Project, Estimate
│   │   └── validators/         # Centralized Zod request & response schemas
│   └── package.json
│
├── supabase/
│   ├── migrations/             # Production PostgreSQL SQL migration with RLS
│   └── seed.sql                # Seed data for immediate evaluation
│
├── docs/                       # Architecture, Database, API, Deployment guides
├── README.md
└── package.json
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Installation
Clone and install all workspace dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# (Optional) Return to root for unified script runners
cd ..
npm install
```

### 2. Environment Configuration

#### Backend: `server/.env`
Create `server/.env` (see `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Add your Google Gemini API Key for live AI responses
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Optional: Add your Supabase credentials for remote PostgreSQL sync
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
> *Note: If credentials are not provided initially, AeroClean AI operates in high-fidelity simulation and in-memory repository mode, enabling full interactive testing without configuration delays!*

#### Frontend: `client/.env`
Create `client/.env` (see `client/.env.example`):
```env
VITE_API_BASE_URL=/api/v1
```

### 3. Run Backend & Frontend

#### Terminal 1 — Backend:
```bash
cd server
npm run dev
# Server starts at http://localhost:5000/api/v1
```

#### Terminal 2 — Frontend:
```bash
cd client
npm run dev
# Application starts at http://localhost:5173
```

---

## 🧪 Automated Testing

Run the backend test suite:
```bash
cd server
npm test
```
*Tests verify API health, cost calculation formulas, Zod validation, rate limiters, auth guards, and AI suitability response parsing.*

---

## 🎯 Instant Evaluation Access

For rapid assessment by evaluators and hackathon judges:
- Navigate to `/login`
- Click **"Demo Customer"** to log in instantly as *Aditya Sharma (Vertex Commercial Towers)*.
- Click **"Demo Admin"** to test administrative privileges.

---

## 🛡️ Aviation & Safety Notice

AeroClean AI represents an autonomous robotics concept platform. All figures, turnaround targets, and AI consultations are preliminary planning models. Physical exterior operations require site-specific structural assessments, certified ground exclusion perimeters, and regulatory clearance from local civil aviation authorities.
