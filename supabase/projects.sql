create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  image text not null,
  description text not null,
  details jsonb not null default '[]'::jsonb,
  photos jsonb not null default '[]'::jsonb,
  category text not null,
  created_at timestamp with time zone default now()
);

create index if not exists projects_category_idx on projects (category);
