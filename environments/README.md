# AeroClean AI - Environment Configurations

This folder centralizes and documents the separate environment variable setups for the **Client (Frontend)** and **Server (Backend)** services.

---

## Architecture & Separation of Concerns

| Configuration | Scope | Target File | Purpose |
| :--- | :--- | :--- | :--- |
| **Client Frontend** | Browser Runtime | `client/.env` | Public configuration variables prefixed with `VITE_` exposed to the Vite React bundle. |
| **Server Backend** | Node.js Runtime | `server/.env` | Private server-only variables (service role keys, JWT secrets, database connection). |

---

## 1. Client Environment (`client/.env`)

The Vite React application only exposes variables starting with `VITE_` to the browser bundle:

```env
VITE_API_BASE_URL=/api/v1
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_GEMINI_API_KEY=<your-gemini-key>
```

- **`VITE_API_BASE_URL`**: Set to `/api/v1` for same-origin proxying on Vercel or local Vite dev proxy, or `http://localhost:5000/api/v1` when calling the API directly.
- **`VITE_SUPABASE_URL`** & **`VITE_SUPABASE_ANON_KEY`**: Public client-side authentication and realtime subscriptions.
- **`VITE_GEMINI_API_KEY`**: Client-side Gemini 2.5 Flash assistant key for frontend prototyping.

---

## 2. Server Environment (`server/.env`)

The Express backend runs on Node.js and requires private server-side secrets:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

GEMINI_API_KEY=<your-gemini-key>
GEMINI_MODEL=gemini-2.5-flash

JWT_SECRET=<your-jwt-secret>
LOG_LEVEL=info
```

- **`SUPABASE_SERVICE_ROLE_KEY`**: Elevated privilege key used strictly on the server for administrative data operations. **Never expose this in `client/.env`**.
- **`JWT_SECRET`**: Used by Express authentication middleware to sign and verify user tokens.

---

## Security Best Practices
- All `.env` and `*.env` files are automatically excluded in `.gitignore` to prevent secret leaks to version control.
- For deployment on platforms like **Vercel**, configure these variables in the **Vercel Project Dashboard** under **Settings > Environment Variables**, selecting either the `client` or `server` service scope.
