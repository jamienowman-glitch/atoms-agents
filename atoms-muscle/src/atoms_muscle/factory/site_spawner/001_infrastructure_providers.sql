-- Create table for storing infrastructure provider metadata
-- Keys are NOT stored here, only references to vault files on disk.

create table if not exists public.infrastructure_providers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  driver text not null, -- 'cloudflare_registrar', 'namecheap', etc.
  vault_filename text not null, -- Reference to file in ~/northstar-keys/
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (though for internal tools we might be loose, let's correspond to standard)
alter table public.infrastructure_providers enable row level security;

-- Policy: Allow read/write for authenticated users (or service role)
-- Assuming this is a single-user internal tool for now.
create policy "Allow all access to authenticated users"
  on public.infrastructure_providers
  for all
  using (true);
