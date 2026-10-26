create table if not exists board_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles (id) on update cascade on delete set null,
  author_name text not null default '',
  title text not null,
  body text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint board_posts_title_length check (char_length(title) between 1 and 100),
  constraint board_posts_body_length check (char_length(body) <= 10000)
);

create index if not exists board_posts_list_idx
  on board_posts (published, created_at desc);

create index if not exists board_posts_author_idx
  on board_posts (author_id);

alter table board_posts enable row level security;

drop policy if exists board_posts_public_read on board_posts;
create policy board_posts_public_read on board_posts
  for select using (published = true);
