create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  last_name text not null,
  first_name text not null,
  email text not null,
  prestation_type text not null,
  date text not null,
  start_time text,
  duration numeric,
  location text,
  event_type text,
  event_details text,
  contact_preference text,
  special_retouches text,
  inspiration_photos jsonb,
  status text not null default 'pending',
  gallery_photos jsonb,
  gallery_created boolean default false,
  gallery_code text,
  gallery_expires_at timestamp with time zone,
  email_sent boolean default false,
  created_at timestamp with time zone default now()
);

-- Colonnes ajoutées progressivement (safe si déjà présentes)
alter table reservations add column if not exists gallery_photos jsonb;
alter table reservations add column if not exists gallery_created boolean default false;
alter table reservations add column if not exists gallery_code text;
alter table reservations add column if not exists gallery_expires_at timestamp with time zone;
alter table reservations add column if not exists email_sent boolean default false;
alter table reservations add column if not exists start_time text;
alter table reservations add column if not exists duration numeric;
alter table reservations add column if not exists event_type text;
alter table reservations add column if not exists event_details text;
alter table reservations add column if not exists contact_preference text;

create index if not exists reservations_status_idx on reservations (status);
create index if not exists reservations_date_idx on reservations (date);
create index if not exists reservations_gallery_code_idx on reservations (gallery_code);
