-- Admin access is granted explicitly per profile.
alter table public.profiles add column if not exists is_admin boolean default false not null;
alter table public.profiles add column if not exists email text;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

update public.profiles set email = auth_users.email
from auth.users as auth_users
where public.profiles.id = auth_users.id and public.profiles.email is null;

drop policy if exists "Admins can view profiles" on public.profiles;
create policy "Admins can view profiles" on public.profiles for select using (public.is_admin());
drop policy if exists "Admins can view trips" on public.trips;
create policy "Admins can view trips" on public.trips for select using (public.is_admin());
drop policy if exists "Admins can view stops" on public.stops;
create policy "Admins can view stops" on public.stops for select using (public.is_admin());
drop policy if exists "Admins can view favorites" on public.user_favorites;
create policy "Admins can view favorites" on public.user_favorites for select using (public.is_admin());