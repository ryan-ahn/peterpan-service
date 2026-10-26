alter table admin_members drop constraint if exists admin_members_role_check;
alter table admin_members
  add constraint admin_members_role_check check (role in ('owner', 'super', 'manager'));

alter table admin_members add column if not exists menus text[] not null default '{}';

update admin_members
set menus = array['members', 'inquiries', 'news', 'posts', 'disclosures', 'organization', 'bylaws', 'settings']
where role = 'manager' and menus = '{}';
