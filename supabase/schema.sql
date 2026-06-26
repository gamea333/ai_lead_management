-- Run this SQL in your Supabase SQL Editor

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

create table email_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  event_type text not null check (event_type in ('sent', 'opened', 'clicked')),
  created_at timestamptz default now()
);

create index idx_email_events_lead_id on email_events(lead_id);
create index idx_email_events_event_type on email_events(event_type);
create index idx_leads_created_at on leads(created_at desc);

-- Allow service role full access; anon can insert leads only (optional for direct client access)
alter table leads enable row level security;
alter table email_events enable row level security;

create policy "Service role has full access to leads"
  on leads for all
  using (true)
  with check (true);

create policy "Service role has full access to email_events"
  on email_events for all
  using (true)
  with check (true);
