-- Tracks Stripe subscribers for revenue monitoring and Day 12 snapshot
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  stripe_customer_id text,
  stripe_session_id text,
  subscribed_at timestamptz not null default now(),
  cancelled_at timestamptz,
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due'))
);

-- Enable RLS — only service role can read; webhook uses anon key with upsert
alter table subscribers enable row level security;

-- Allow insert/update from server (webhook uses anon key)
create policy "service insert" on subscribers
  for insert with check (true);

create policy "service update" on subscribers
  for update using (true);

-- No public select
