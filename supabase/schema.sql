create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  item_key text primary key,
  type text not null check (type in ('bar','hookah')),
  section_id text not null,
  section_title text not null,
  name text not null,
  description text not null default '',
  volume text not null default '',
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  available boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.menu_items enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = auth.uid()) $$;

drop policy if exists "Public can read menu" on public.menu_items;
create policy "Public can read menu" on public.menu_items for select using (true);

drop policy if exists "Admins can insert menu" on public.menu_items;
create policy "Admins can insert menu" on public.menu_items for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update menu" on public.menu_items;
create policy "Admins can update menu" on public.menu_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete menu" on public.menu_items;
create policy "Admins can delete menu" on public.menu_items for delete to authenticated using (public.is_admin());

revoke all on public.admin_users from anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_items to authenticated;
