create table if not exists public.ui_atoms (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    name text not null,
    category text not null,
    props_schema jsonb default '{}'::jsonb,
    status text default 'live',
    description text,
    created_at timestamptz default now()
);

alter table public.ui_atoms
    add column if not exists category text;

alter table public.ui_atoms
    add column if not exists props_schema jsonb default '{}'::jsonb;

alter table public.ui_atoms
    add column if not exists status text default 'live';

alter table public.ui_atoms
    add column if not exists description text;

alter table public.ui_atoms enable row level security;

drop policy if exists "Allow read access to authenticated users" on public.ui_atoms;

create policy "Allow read access to authenticated users"
on public.ui_atoms for select
to authenticated
using (true);

insert into public.ui_atoms (key, name, category, props_schema, status, description)
values
    ('ui_atom.contextual_default', 'Contextual Atom', 'contextual', '{}'::jsonb, 'live', 'Default contextual UI atom placeholder')
on conflict (key) do update set
    name = excluded.name,
    category = excluded.category,
    props_schema = excluded.props_schema,
    status = excluded.status,
    description = excluded.description;
