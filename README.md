# LeadFlow — Automated Lead Management & Email Tracking

Full-stack lead management with **Next.js (App Router)**, **Supabase**, **Resend**, and **Groq AI**.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in env vars, then run supabase/schema.sql in Supabase SQL Editor
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## File Structure

```
src/
├── app/
│   ├── page.tsx                    → Lead capture form
│   ├── dashboard/page.tsx          → Analytics dashboard
│   └── api/
│       ├── submit-lead/route.ts    → Save lead, AI classify, send email
│       └── track/
│           ├── open/route.ts       → Track email opens
│           └── click/route.ts      → Track link clicks
├── components/
│   ├── LeadForm.tsx
│   └── DashboardRefresh.tsx
└── lib/
    ├── supabase.ts                 → Supabase clients
    ├── email.ts                    → Resend email template
    ├── groq.ts                     → AI classification (fetch)
    ├── dashboard.ts
    └── types.ts
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Lead capture form |
| `/dashboard` | Analytics (auto-refreshes every 30s + manual refresh) |
| `POST /api/submit-lead` | Handle form submission |
| `GET /api/track/open?lead_id=XXX` | Record open, return 1×1 GIF |
| `GET /api/track/click?lead_id=XXX&redirect=URL` | Record click, redirect |

Set `NEXT_PUBLIC_BASE_URL` to your production domain for email tracking links to work in production.
