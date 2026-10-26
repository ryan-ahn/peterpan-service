create table if not exists bylaws (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  revised_on date,
  bucket text not null,
  path text not null,
  file_name text not null,
  mime text not null,
  size integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists bylaws_single_published
  on bylaws (published) where published;

alter table bylaws enable row level security;

drop policy if exists bylaws_public_read on bylaws;
create policy bylaws_public_read on bylaws
  for select using (published = true);

insert into bylaws (title, revised_on, bucket, path, file_name, mime, size, published)
select '재단법인 피터팬 자폐인복지재단 정관', date '2026-09-15', 'documents',
  'bylaws/bylaws.pdf', '피터팬재단_정관.pdf', 'application/pdf', 449458, true
where not exists (select 1 from bylaws);
