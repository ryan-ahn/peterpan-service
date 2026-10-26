create table if not exists board_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references board_posts (id) on delete cascade,
  author_id uuid references profiles (id) on update cascade on delete set null,
  author_name text not null default '',
  body text not null,
  created_at timestamptz not null default now(),
  constraint board_comments_body_length check (char_length(body) between 1 and 1000)
);

create index if not exists board_comments_post_idx
  on board_comments (post_id, created_at);

alter table board_comments enable row level security;

drop policy if exists board_comments_public_read on board_comments;
create policy board_comments_public_read on board_comments
  for select using (true);

create table if not exists board_likes (
  post_id uuid not null references board_posts (id) on delete cascade,
  user_id uuid not null references profiles (id) on update cascade on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table board_likes enable row level security;

drop policy if exists board_likes_public_read on board_likes;
create policy board_likes_public_read on board_likes
  for select using (true);
