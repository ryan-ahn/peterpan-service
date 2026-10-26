create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  pinned boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notices_list_idx
  on notices (published, pinned desc, created_at desc);

alter table notices enable row level security;

drop policy if exists notices_public_read on notices;
create policy notices_public_read on notices
  for select using (published = true);

insert into notices (id, slug, title, body, pinned, published, created_at, updated_at)
select id, slug, title, body, pinned, published, created_at, updated_at
from posts
where board = 'news' and category = 'notice'
on conflict (id) do nothing;

delete from posts where board = 'news' and category = 'notice';

alter table posts drop constraint if exists posts_category_check;
alter table posts add constraint posts_category_check check (
  category is null or category in ('activity', 'press')
);
