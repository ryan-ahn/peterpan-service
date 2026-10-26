create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id) on update cascade on delete set null,
  actor_name text not null default '',
  menu text not null,
  action text not null,
  target text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists admin_logs_created_idx on admin_logs (created_at desc);

alter table admin_logs enable row level security;
