# AVAX CHRONICLES — The On‑Chain Tribunal

Minimal scaffold for the AVAX CHRONICLES UI (design-first demo).

Quick start

```bash
cd /workspaces/AVAXCHRONICLES
npm install
npm run dev
```

What’s included
- Vite + React
- TailwindCSS + design tokens
- Wagmi + RainbowKit configured for Avalanche C‑Chain (`https://api.avax.network/ext/bc/C/rpc`)
- Sample components, pages, and wallet connect in `src`.

Optional Supabase
- To enable Supabase persistence, create a project and add tables: `cases`, `evidence`, `users`, `verdict_votes`.
- Provide env vars in a `.env` file at project root using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).
- When present, the app will use Supabase; otherwise it falls back to a localStorage mock backend suitable for local testing.

Supabase schema
- A SQL schema is included at `supabase/schema.sql`. Run it in the Supabase SQL editor. It creates `users`, `cases`, `evidence`, and `verdict_votes` tables and includes RLS notes and example policies.

Animations
- Framer Motion is used for subtle animations: case verdict reveal (sweep + hammer shake), evidence list reveal, and interactive button taps.

Serverless grantPoints endpoint
- A Vercel-style serverless function is included at `api/grantPoints.js`. It uses the Supabase service role key (server-side) to safely increment a user's points. Protect it using `ADMIN_SECRET`.

Usage (example curl):

```bash
curl -X POST https://your.vercel.app/api/grantPoints \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -d '{"address":"0xabc...","points":10}'
```

Deployment notes
- Deploy the `api` folder to Vercel or another serverless provider and set the environment variables `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_SECRET` in the project settings. Do NOT expose the service role key to client-side code.

Security
- The endpoint requires an admin secret header to prevent abuse. In production consider:
  - Using provider-managed secrets and IP restrictions.
  - Implementing audited logs and rate limits.

Next steps
- Generate stronger RLS policies tailored to your auth model, or implement server-side Edge Functions for additional sensitive operations.

Enjoy building AVAX CHRONICLES — ask me to scaffold policies or serverless deployment configs next.
# AVAX CHRONICLES — The On‑Chain Tribunal

Minimal scaffold for the AVAX CHRONICLES UI (design-first demo).

Quick start

```bash
cd /workspaces/AVAXCHRONICLES
npm install
npm run dev
```

What’s included
- Vite + React
- TailwindCSS + design tokens
- Wagmi + RainbowKit configured for Avalanche C‑Chain (`https://api.avax.network/ext/bc/C/rpc`)
- Sample `CaseCard` and wallet connect in `src`.

Optional Supabase
- To enable Supabase persistence, create a project and add tables: `cases`, `evidence`, `users`, `verdict_votes`.
- Provide env vars in a `.env` file at project root using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).
- When present, the app will use Supabase; otherwise it falls back to a localStorage mock backend.
# When present, the app will use Supabase; otherwise it falls back to a localStorage mock backend.

Supabase schema
- A SQL schema is included at `supabase/schema.sql`. Run it in the Supabase SQL editor. It creates `users`, `cases`, `evidence`, and `verdict_votes` tables and includes RLS notes and example policies.

Animations
- Framer Motion is used for subtle animations: case verdict reveal (sweep + hammer shake), evidence list reveal, and interactive button taps.

Next steps
- Implement pages (Submit Case, Case Detail, Profile)
- Add points backend and persistent storage
- Polish animations (Framer Motion) and tests
# AVAXCHRONICLES
AVAX CHRONICLES IT IS 
