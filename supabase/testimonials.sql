create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  project text,
  rating integer default 5,
  date text,
  image text,
  email text not null,
  approved boolean default false,
  created_at timestamp with time zone default now()
);

create index if not exists testimonials_approved_idx on testimonials (approved);
create index if not exists testimonials_email_idx on testimonials (email);
