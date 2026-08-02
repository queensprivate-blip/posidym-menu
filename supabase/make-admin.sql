-- 1. Сначала создайте пользователя в Supabase Dashboard:
-- Authentication → Users → Add user
-- 2. Затем замените email ниже и выполните этот запрос в SQL Editor.

insert into public.admin_users (user_id)
select id from auth.users
where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (user_id) do nothing;
