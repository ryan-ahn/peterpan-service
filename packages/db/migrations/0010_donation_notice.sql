alter table donation_inquiries add column if not exists depositor_name text not null default '';
alter table donation_inquiries add column if not exists wall_name text not null default '';
