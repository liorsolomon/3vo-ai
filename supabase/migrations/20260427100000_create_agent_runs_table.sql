-- Server-side run counter for Day 12 revenue snapshot
-- Tracks every successful agent completion (fire-and-forget from the API route)
create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  ran_at timestamptz not null default now()
);

alter table agent_runs enable row level security;

-- Append-only from server (anon key); no reads for anon
create policy "service insert" on agent_runs
  for insert with check (true);
