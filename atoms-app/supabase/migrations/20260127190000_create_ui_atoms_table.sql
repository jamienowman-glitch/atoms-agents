create table if not exists public.ui_atoms (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    name text not null,
    description text,
    created_at timestamptz default now()
);

alter table public.ui_atoms enable row level security;

create policy "Allow read access to authenticated users"
on public.ui_atoms for select
to authenticated
using (true);

insert into public.ui_atoms (key, name, description)
values
    ('ui_atom.contextual_default', 'Contextual Atom', 'Default contextual UI atom placeholder')
on conflict (key) do update set
    name = excluded.name,
    description = excluded.description;
