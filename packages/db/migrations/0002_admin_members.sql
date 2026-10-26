create table if not exists admin_members (
  user_id uuid primary key references profiles (id) on update cascade on delete cascade,
  role text not null,
  granted_by uuid references profiles (id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_members_role_check check (role in ('owner', 'manager'))
);

create unique index if not exists admin_members_single_owner
  on admin_members (role) where role = 'owner';

alter table admin_members enable row level security;

insert into admin_members (user_id, role)
select profiles.id, 'owner'
from profiles
where profiles.id = '7a909614-6cbc-4e2e-980a-fef6596609b5'::uuid
on conflict (user_id) do nothing;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'role'
  ) then
    insert into admin_members (user_id, role)
    select profiles.id, 'manager'
    from profiles
    where profiles.role = 'admin'
    on conflict (user_id) do nothing;
  end if;
end;
$$;

alter table profiles drop column if exists role;
