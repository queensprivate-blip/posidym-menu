-- Схема для следующего этапа: полноценная облачная админка Supabase.
-- Пока не запускать: v0.19 работает локально через localStorage.
create table if not exists menu_items (
  id text primary key,
  section text not null,
  name text not null,
  description text default '',
  price numeric not null default 0,
  image_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table menu_items enable row level security;
