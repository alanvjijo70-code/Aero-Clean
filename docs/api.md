# AeroClean AI — REST API Documentation

Base URL: `/api/v1`

---

## 1. System Health
- **Endpoint:** `GET /health`
- **Auth:** None
- **Response:**
```json
{
  "success": true,
  "message": "AeroClean AI API is operating normally",
  "data": {
    "status": "ONLINE",
    "service": "AeroClean AI Backend Platform",
    "telemetry": "ALL SYSTEMS OPERATIONAL (SIMULATION)",
    "timestamp": "2026-11-14T11:00:00.000Z",
    "version": "1.0.0"
  }
}
```

---

## 2. Buildings API
All building endpoints require `Authorization: Bearer <token>`.

- `GET /buildings` — List authenticated user's buildings.
- `GET /buildings/:id` — Retrieve a single building profile.
- `POST /buildings` — Create building profile.
  - Body:
    ```json
    {
      "name": "Vertex Horizon Tower A",
      "building_type": "Commercial tower",
      "height_m": 185.5,
      "window_area_sqm": 14500,
      "floors": 46,
      "city": "Bengaluru",
      "country": "India",
      "glass_type": "Low-E Double Glazed",
      "dirt_severity": "moderate"
    }
    ```
- `PATCH /buildings/:id` — Update building profile fields.
- `DELETE /buildings/:id` — Remove building profile.

---

## 3. Cleaning Projects API
Requires `Authorization: Bearer <token>`.

- `GET /projects` — List missions with joined building names.
- `GET /projects/:id` — Mission details.
- `POST /projects` — Create mission.
  - Body:
    ```json
    {
      "building_id": "bldg-uuid",
      "project_name": "Q4 Exterior Facade Deep Wash",
      "status": "planned",
      "scheduled_date": "2026-12-01T08:00:00Z",
      "notes": "Rooftop umbilical tether access coordinated."
    }
    ```
- `PATCH /projects/:id` — Transition status or notes.
- `DELETE /projects/:id` — Delete project.

---

## 4. Cost Estimates API

- `POST /estimates/calculate` — Public live calculator.
  - Body:
    ```json
    {
      "window_area_sqm": 12000,
      "building_height_m": 150,
      "traditional_cost_per_sqm": 45,
      "drone_cost_per_sqm": 22,
      "traditional_productivity_sqm_h": 35,
      "drone_productivity_sqm_h": 110,
      "currency": "INR"
    }
    ```
- `POST /estimates/save` — Save estimate to portfolio (Requires Auth).
- `GET /estimates` — List saved portfolio estimates (Requires Auth).
- `DELETE /estimates/:id` — Delete saved estimate (Requires Auth).

---

## 5. Gemini AI Advisor API

- `POST /ai/cleaning-analysis` — Multi-stage suitability audit.
  - Body:
    ```json
    {
      "building_type": "Commercial tower",
      "building_height_m": 160,
      "window_area_sqm": 12000,
      "glass_type": "Low-E Double Glazed",
      "dirt_severity": "moderate",
      "environmental_exposure": "Urban high-wind corridor"
    }
    ```
- `POST /ai/operational-plan` — 5-stage cleaning workflow generator.
- `POST /ai/advisor` — Direct conversational building advisory.
- `GET /ai/history` — List consultation history (Requires Auth).

---

## 6. Public Inquiries & Submissions

- `POST /demo-requests` — Request on-site autonomous flight demonstration.
- `POST /contact` — General enterprise contact message.
- `POST /newsletter/subscribe` — Subscribe corporate email with verified consent.
