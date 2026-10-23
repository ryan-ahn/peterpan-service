create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text not null default '',
  avatar_url text,
  provider text not null,
  provider_user_id text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (provider, provider_user_id)
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  board text not null,
  category text,
  year integer,
  title text not null,
  summary text not null default '',
  body text not null default '',
  pinned boolean not null default false,
  published boolean not null default true,
  external_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_board_check check (board in ('news', 'management', 'donation')),
  constraint posts_category_check check (
    category is null or category in ('notice', 'activity', 'press')
  )
);

create index if not exists posts_board_list_idx
  on posts (board, published, pinned desc, created_at desc);

create table if not exists post_files (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts (id) on delete cascade,
  bucket text not null,
  path text not null,
  file_name text not null,
  mime text not null,
  size integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

create table if not exists donation_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null,
  kind text not null,
  amount text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table posts enable row level security;
alter table post_files enable row level security;
alter table site_settings enable row level security;
alter table donation_inquiries enable row level security;

drop policy if exists posts_public_read on posts;
create policy posts_public_read on posts
  for select using (published = true);

drop policy if exists post_files_public_read on post_files;
create policy post_files_public_read on post_files
  for select using (
    exists (
      select 1 from posts
      where posts.id = post_files.post_id and posts.published = true
    )
  );

drop policy if exists site_settings_public_read on site_settings;
create policy site_settings_public_read on site_settings
  for select using (true);

insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', true),
  ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists public_read_site_files on storage.objects;
create policy public_read_site_files on storage.objects
  for select to public
  using (bucket_id in ('documents', 'media'));
