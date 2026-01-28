-- 1. Create 'canvases' table if it doesn't exist
create table if not exists public.canvases (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    name text not null,
    description text,
    category text default 'general',
    status text default 'live',
    created_at timestamptz default now()
);

-- Enable RLS for canvases
alter table public.canvases enable row level security;

-- Policy for canvases (Read-only for authenticated)
drop policy if exists "Allow read access to authenticated users" on public.canvases;
create policy "Allow read access to authenticated users"
on public.canvases for select
to authenticated
using (true);

-- 2. Create 'maybes_notes' table
create table if not exists public.maybes_notes (
    id uuid primary key default gen_random_uuid(),
    tenant_id text not null,
    user_id text not null,
    space_id text,
    surface_id text,
    type text check (type in ('text', 'audio', 'image')),
    content_text text,
    content_uri text,
    content_meta jsonb default '{}'::jsonb,
    position jsonb default '{"x": 0, "y": 0}'::jsonb,
    zoom float default 1.0,
    is_archived boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_maybes_notes_tenant on public.maybes_notes(tenant_id);
create index if not exists idx_maybes_notes_user on public.maybes_notes(user_id);
create index if not exists idx_maybes_notes_space on public.maybes_notes(space_id);

-- Enable RLS for maybes_notes
alter table public.maybes_notes enable row level security;

-- Policy for maybes_notes (Tenant Isolation - Simplified for V1)
-- ideally: using (tenant_id = auth.jwt() ->> 'tenant_id')
drop policy if exists "Enable all access for authenticated users" on public.maybes_notes;
create policy "Enable all access for authenticated users"
on public.maybes_notes for all
to authenticated
using (true)
with check (true);

-- 3. Seed Data

-- Register Canvas
insert into public.canvases (key, name, description, category, status)
values (
    'canvas.maybes',
    'MAYBES Note Canvas',
    'A city-builder style note taking canvas with text and audio nodes.',
    'productivity',
    'live'
)
on conflict (key) do update set
    name = excluded.name,
    description = excluded.description,
    category = excluded.category;

-- Register UI Atom
insert into public.ui_atoms (key, name, category, props_schema, status, description)
values (
    'node.maybes.note',
    'Maybes Note Node',
    'node',
    '{
        "type": {
            "type": "select",
            "options": ["text", "voice"]
        }
    }'::jsonb,
    'live',
    'A versatile note node for text and voice content.'
)
on conflict (key) do update set
    name = excluded.name,
    props_schema = excluded.props_schema,
    description = excluded.description;
