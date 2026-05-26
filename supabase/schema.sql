-- 1. Create the 'audits' table to store deterministic calculations
create table public.audits (
  id uuid primary key default gen_random_uuid(),
  team_size integer not null,
  use_case text not null,
  tools jsonb not null,
  total_current_spend numeric not null,
  total_monthly_savings numeric not null,
  total_annual_savings numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on audits
alter table public.audits enable row level security;

-- Create policies for 'audits' (anyone can insert an audit, and anyone can read an audit if they have the ID)
create policy "Allow public insert" on public.audits
  for insert with check (true);

create policy "Allow public select" on public.audits
  for select using (true);


-- 2. Create the 'leads' table to capture user emails and startup metadata
create table public.leads (
  id bigint generated always as identity primary key,
  email text not null,
  company text,
  role text,
  team_size integer,
  audit_id uuid references public.audits(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on leads
alter table public.leads enable row level security;

-- Create policies for 'leads'
-- Anyone can submit a lead (Allow public insert)
create policy "Allow public insert" on public.leads
  for insert with check (true);

-- No public read access to leads (protects user emails and PII from public access)
-- Only service role / authenticated administrators can view lead entries
create policy "Allow admin read" on public.leads
  for select using (auth.role() = 'service_role');
