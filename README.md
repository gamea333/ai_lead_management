# AI Lead Management & Email Tracking System

A full-stack automated lead management system that captures leads, sends personalized emails, tracks engagement, and classifies leads using AI.

🔗 **Live Demo**: https://ai-lead-management-git-master-gamea333s-projects.vercel.app/

---

## Features

- **Lead Capture Form** — Collects name, email, phone, company, and requirement
- **Automated Personalized Email** — Sends a branded confirmation email to every lead instantly
- **Email Open Tracking** — Tracks when a lead opens the email via a 1×1 tracking pixel
- **Link Click Tracking** — Tracks when a lead clicks the CTA button in the email
- **Analytics Dashboard** — Real-time stats: total leads, emails sent, open rate, click rate
- **AI Lead Classification** — Automatically classifies each lead's requirement into a category and priority using Groq AI (llama-3.3-70b-versatile)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) |
| Email | EmailJS |
| AI Classification | Groq API — llama-3.3-70b-versatile |
| Deployment | Vercel |

---

## Architecture
User submits form

│

▼

Next.js API Route (/api/submit-lead)

│

├──▶ Supabase → saves lead data

│

├──▶ EmailJS → sends personalized email

│         │

│         ├── tracking pixel (/api/track/open)

│         └── trackable CTA link (/api/track/click)

│

└──▶ Groq AI → classifies requirement

└── saves category + priority to Supabase
Email Events (open/click) → saved to email_events table

│

▼

Dashboard (/dashboard)

shows real-time analytics

---

## Database Schema

```sql
-- Stores all lead submissions
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  requirement text not null,
  ai_category text,
  ai_priority text,
  created_at timestamptz default now()
);

-- Stores email engagement events
create table email_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  event_type text not null, -- 'sent', 'opened', 'clicked'
  created_at timestamptz default now()
);
```

---

## How Tracking Works

### Email Open Tracking
Every email contains a hidden 1×1 transparent GIF pixel:
```html
<img src="https://yourapp.vercel.app/api/track/open?lead_id=XXX" width="1" height="1" />
```
When the email is opened, the image loads, hitting the API route which records an `opened` event in Supabase.

### Link Click Tracking
The CTA button in the email points to:
/api/track/click?lead_id=XXX&redirect=https://yourwebsite.com
When clicked, it records a `clicked` event in Supabase, then redirects the user to the actual destination.

---

## AI Classification

Each lead submission is automatically analyzed by **Groq's llama-3.3-70b-versatile** model:

| Requirement | Category | Priority |
|-------------|----------|----------|
| "I need a chatbot for my website" | AI Automation | High |
| "Looking for basic email newsletter" | Marketing | Low |
| "Need CRM integration urgently" | Integration | High |

Results are stored in the `leads` table and displayed as badges on the dashboard.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_BASE_URL=
```

---

## Local Setup

```bash
# Clone the repository
git clone https://github.com/gamea333/ai_lead_management.git
cd ai_lead_management

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the form.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for analytics.

---

## Project Structure
/app

/page.tsx                    → Lead capture form

/dashboard/page.tsx          → Analytics dashboard

/api

/submit-lead/route.ts      → Handle form + email + AI

/track

/open/route.ts           → Email open tracking

/click/route.ts          → Link click tracking

/lib

/supabase.ts                 → Supabase client

---

## Dashboard Metrics

| Metric | Description |
|--------|-------------|
| Total Leads | All form submissions |
| Emails Sent | Emails successfully delivered |
| Emails Opened | Leads who opened the email |
| Open Rate | (Opened / Sent) × 100 |
| Link Clicks | Unique leads who clicked the CTA |
| Click Rate | (Clicked / Sent) × 100 |

---

Built with ❤️ for the AI Lead Management Hackathon2 / 2
