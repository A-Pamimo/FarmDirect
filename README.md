# HarvestLink

HarvestLink is a brand-first marketplace that lets neighbours discover local farmers by story, values, and featured harvests. The MVP pairs a React experience with an Express/PostGIS API to support geo-filtered discovery, batch hub logistics, Stripe checkout (or mock mode), and a live impact ticker that celebrates the difference every order makes.

## Monorepo structure

```
HarvestLink/
├── apps/
│   ├── api/    # Express + Postgres/PostGIS API
│   └── web/    # React + Vite + Tailwind web client
├── packages/
│   └── shared/ # Shared constants & types
├── db/         # (inside apps/api) SQL migrations & seed scripts
└── README.md
```

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the values as needed (Stripe, Twilio, SMTP, etc.). Leaving Stripe blank will enable mock checkout mode.
3. **Prepare the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
   The migration enables PostGIS and creates all tables with demo data.
4. **Run the full stack**
   ```bash
   npm run dev
   ```
   This starts the shared types watcher plus the API on `localhost:3000` and the web client on `localhost:5173`.

## Demo flow

1. Open `http://localhost:5173/` and enter a demo postal code (`S7N 0W5`, `M5V 2T6`, or `V6B 1A1`).
2. Explore the discovery grid, then open a farmer profile to read their story and featured product.
3. Enter your name/email/postal code and click **Support this farmer**. Stripe Checkout launches (mock mode will open the in-app confirmation page).
4. After checkout completes, the assigned community hub appears in the API response (email/SMS if configured, or console logs in mock mode).
5. Watch the Impact Ticker climb live on the landing page as orders complete.
6. Visit the Farmer Deliveries dashboard (`/farmer/:id/deliveries`) to see batch orders grouped by hub with an illustrative mini-map.

## Key scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs shared type watcher, Express API, and Vite dev server together. |
| `npm run build` | Builds the shared package, API, and web app. |
| `npm start` | Launches the compiled API (Render/Fly/Railway ready). |
| `npm run test` | Builds shared types and runs API + web test suites. |
| `npm run db:migrate` | Applies SQL migrations (enables PostGIS, creates tables & indexes). |
| `npm run db:seed` | Loads the demo farms, hubs, customers, and impact counters. |

## Testing

- **API**: Vitest + Supertest cover geo helpers and impact math. Extend with live endpoint tests as needed.
- **Web**: Vitest + React Testing Library cover hero components like the ImpactTicker and FarmerCard.

Run both suites via:
```bash
npm run test
```

## Integrations & fallbacks

- **Stripe Checkout**: Provide `STRIPE_SECRET_KEY` + `WEBHOOK_SECRET` to run full test-mode payments. Without them the API auto-approves orders and returns an in-app mock checkout link that still bumps impact counters.
- **Twilio + Nodemailer**: Configure credentials for SMS/email notifications. Missing values fall back to console logs and UI toasts so the demo never breaks.
- **PostGIS**: The first migration enables PostGIS and GIST indexes. If the extension fails to install, ensure your Postgres service supports PostGIS (Neon/Timescale/Railway do).

## Deployment notes

- **Web**: Deploy `apps/web` on Vercel (environment variable `VITE_API_BASE_URL` pointing to the hosted API).
- **API**: Deploy `apps/api` on Render/Fly/Railway. Remember to run `npm run build --workspace=packages/shared && npm run build --workspace=apps/api` during build.
- **Database**: Provision a Postgres database with PostGIS (Neon or Timescale). Run the migration and seed scripts once.

Set the `APP_BASE_URL` and `API_BASE_URL` env vars appropriately so Stripe success/cancel URLs resolve in production.

## Troubleshooting

- **Stripe signature errors**: Double-check `WEBHOOK_SECRET`. In mock mode you can skip Stripe entirely.
- **PostGIS errors**: Ensure the database user can `CREATE EXTENSION postgis;`. Some hosted providers require enabling PostGIS at the console first.
- **Twilio/SMTP unavailable**: Leave the env vars blank during demos. The platform will log notifications instead of failing the order.
- **Shared package not found**: Run `npm run build --workspace=packages/shared` if you add new shared types so that both API and web see the latest output.

Enjoy sharing the stories behind every harvest!
