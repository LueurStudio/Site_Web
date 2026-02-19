alter table projects
add column if not exists hidden boolean not null default false;

create index if not exists projects_hidden_idx on projects (hidden);
