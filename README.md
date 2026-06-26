# LeadFlow — Automated Lead Management & Email Tracking

Full-stack lead management with **Next.js (App Router)**, **Supabase**, **EmailJS**, and **Groq AI**.

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
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### EmailJS template setup (required)

1. Go to [EmailJS Templates](https://dashboard.emailjs.com/admin/templates) → open your template
2. In the right sidebar, set **To Email** to exactly: `{{to_email}}`
   - Or use `{{user_email}}` if your template already uses that name
3. Set **From Name** to e.g. `LeadFlow`
4. In the email body, use variables like `{{to_name}}`, `{{requirement}}`, etc.

**If you see "recipients address is corrupted" (422):** the To Email field in your template is not set to `{{to_email}}` or `{{user_email}}`.

Create an EmailJS template with these variables:

| Variable | Description |
|----------|-------------|
| `to_name` | Lead's full name |
| `to_email` | Lead's email (set as "To Email" in template settings) |
| `requirement` | Lead's message |
| `company` | Company name or `N/A` |
| `phone` | Phone number |
| `trackable_link` | CTA link with click tracking |
| `tracking_pixel` | 1×1 open-tracking image URL |

Add the tracking pixel to your template HTML:

```html
<img src="{{tracking_pixel}}" width="1" height="1" alt="" />
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
    ├── email.ts                    → EmailJS sending
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
