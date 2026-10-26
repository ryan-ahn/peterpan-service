alter table profiles add column if not exists phone text not null default '';
alter table profiles add column if not exists birth_date date;
alter table profiles add column if not exists updated_at timestamptz not null default now();

alter table donation_inquiries
  add column if not exists user_id uuid references profiles (id) on update cascade on delete set null;

create index if not exists donation_inquiries_user_idx
  on donation_inquiries (user_id, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists public_read_avatars on storage.objects;
create policy public_read_avatars on storage.objects
  for select to public
  using (bucket_id = 'avatars');

-- 회원은 자기 id 폴더({userId}/...)에만 사진을 올리고 지운다
drop policy if exists avatars_owner_insert on storage.objects;
create policy avatars_owner_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_owner_update on storage.objects;
create policy avatars_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_owner_delete on storage.objects;
create policy avatars_owner_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
