-- Posidym v0.22: расширенная админка. Выполнить один раз после schema.sql/seed.sql.

alter table public.menu_items add column if not exists archived boolean not null default false;
alter table public.menu_items add column if not exists badge text not null default '';

create table if not exists public.menu_sections (
  section_id text primary key,
  type text not null check (type in ('bar','hookah')),
  title text not null,
  note text not null default '',
  parent_group text not null default '',
  sort_order integer not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  type_label text not null default 'Акция',
  image_url text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.venue_settings (
  id integer primary key default 1 check (id = 1),
  venue_name text not null default 'Посидым Lounge',
  address text not null default 'Москва, ул. Центральная, 12',
  phone text not null default '+7 (999) 123-45-67',
  hours text not null default 'Вс–Чт 14:00–02:00 · Пт–Сб 14:00–04:00',
  review_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.venue_settings (id) values (1) on conflict (id) do nothing;

alter table public.menu_sections enable row level security;
alter table public.promotions enable row level security;
alter table public.rules enable row level security;
alter table public.venue_settings enable row level security;

-- Публичное чтение
do $$ begin
  create policy "Public can read sections" on public.menu_sections for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public can read promotions" on public.promotions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public can read rules" on public.rules for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public can read venue" on public.venue_settings for select using (true);
exception when duplicate_object then null; end $$;

-- Полный доступ администраторам
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['menu_sections','promotions','rules','venue_settings'] LOOP
    EXECUTE format('drop policy if exists "Admins manage %s" on public.%I', t, t);
    EXECUTE format('create policy "Admins manage %s" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  END LOOP;
END $$;

grant select on public.menu_sections, public.promotions, public.rules, public.venue_settings to anon, authenticated;
grant insert, update, delete on public.menu_sections, public.promotions, public.rules, public.venue_settings to authenticated;

-- Storage для изображений меню
insert into storage.buckets (id, name, public) values ('menu-media', 'menu-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read menu media" on storage.objects;
create policy "Public read menu media" on storage.objects for select using (bucket_id = 'menu-media');
drop policy if exists "Admins upload menu media" on storage.objects;
create policy "Admins upload menu media" on storage.objects for insert to authenticated
with check (bucket_id = 'menu-media' and public.is_admin());
drop policy if exists "Admins update menu media" on storage.objects;
create policy "Admins update menu media" on storage.objects for update to authenticated
using (bucket_id = 'menu-media' and public.is_admin()) with check (bucket_id = 'menu-media' and public.is_admin());
drop policy if exists "Admins delete menu media" on storage.objects;
create policy "Admins delete menu media" on storage.objects for delete to authenticated
using (bucket_id = 'menu-media' and public.is_admin());

-- Начальные разделы из уже импортированных позиций
insert into public.menu_sections(section_id,type,title,sort_order)
select section_id, min(type), min(section_title), min(sort_order)
from public.menu_items group by section_id
on conflict(section_id) do update set title=excluded.title, type=excluded.type;

-- Начальные акции и правила при пустых таблицах
insert into public.promotions(title,text,type_label,image_url,sort_order)
select * from (values
 ('1+1=3 Martini Fiero Tonic','Закажите два коктейля Martini Fiero Tonic и получите третий в подарок.','Акция','/menu-images/martini-fiero-tonic-v10.webp',10),
 ('1+1=3 Коктейль Long Island','Закажите два коктейля Long Island и получите третий в подарок.','Акция','/menu-images/long-island-v10.webp',20),
 ('Скидка в день рождения','Сообщите персоналу, что сегодня у вас день рождения, и получите скидку 15%. Действует при предъявлении документа, удостоверяющего личность.','Акция','/menu-images/product-cocwbnqtdp-jdwyexrhvb.webp',30)
) v(title,text,type_label,image_url,sort_order)
where not exists(select 1 from public.promotions);

insert into public.rules(title,text,sort_order)
select * from (values
 ('Только 18+','При посещении заведения администратор вправе попросить документ, подтверждающий возраст.',10),
 ('Бронирование','Стол считается забронированным после подтверждения администратора. Для отдельных дат возможен депозит.',20),
 ('Время брони','При опоздании более чем на 15 минут бронь может быть отменена, если вы не предупредили администратора.',30),
 ('Поведение гостей','Просим бережно относиться к имуществу заведения и уважительно общаться с другими гостями и персоналом.',40),
 ('Кальянная подача','Для комфортного отдыха действует минимальное количество кальянов на компанию: для 1–3 гостей — 1 кальян, для 3–5 гостей — 2 кальяна, для компаний от 5 гостей — 3 кальяна. Стандартное время курения одного кальяна составляет до 2 часов.',50)
) v(title,text,sort_order)
where not exists(select 1 from public.rules);
