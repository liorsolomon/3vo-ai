create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  idea text not null,
  submitted_at timestamptz default now(),
  processed boolean default false,
  paperclip_issue_id text
);

alter table ideas enable row level security;

-- Public form submissions may insert; no public read/update/delete
create policy "Allow public idea submissions"
  on ideas for insert
  to anon
  with check (true);
