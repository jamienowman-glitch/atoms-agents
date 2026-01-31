-- Registry for High-Value Muscle Components
-- Distinct from 'tools' which are internal utilities.

create table if not exists public.muscles (
  id uuid default gen_random_uuid() primary key,
  key text unique not null, -- e.g. 'audio.transcoder'
  name text not null,       -- Display Name
  category text not null,   -- 'audio', 'video', 'cad'
  status text not null default 'dev', -- 'dev', 'prod', 'sale_ready'
  pricing_model text default 'paid', -- 'free', 'paid'
  description text,
  slice_path text, -- URL/Path to the exported bundle
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.muscles enable row level security;
create policy "Allow all access to authenticated users" on public.muscles for all using (true);
