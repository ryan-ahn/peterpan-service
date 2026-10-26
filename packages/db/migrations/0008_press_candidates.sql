create table if not exists press_candidates (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text not null,
  summary text not null default '',
  publisher text not null default '',
  published_at timestamptz not null,
  keyword text not null default '',
  status text not null default 'pending',
  post_id uuid references posts (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint press_candidates_status_check check (status in ('pending', 'approved', 'hidden'))
);

create index if not exists press_candidates_list_idx
  on press_candidates (status, published_at desc);

alter table press_candidates enable row level security;
