-- Prevent client users from changing their admin flag and protect reference data.
create or replace function public.prevent_admin_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_admin is distinct from old.is_admin and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only an existing administrator can change administrator access';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_admin_flag on public.profiles;
create trigger protect_profile_admin_flag
  before update on public.profiles
  for each row execute procedure public.prevent_admin_escalation();

alter table public.cities enable row level security;
alter table public.activities enable row level security;

drop policy if exists "Public can view cities" on public.cities;
create policy "Public can view cities" on public.cities for select using (true);
drop policy if exists "Admins can manage cities" on public.cities;
create policy "Admins can manage cities" on public.cities for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public can view activities" on public.activities;
create policy "Public can view activities" on public.activities for select using (true);
drop policy if exists "Admins can manage activities" on public.activities;
create policy "Admins can manage activities" on public.activities for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users manage own trip covers" on storage.objects;
drop policy if exists "Users manage own uploaded files" on storage.objects;
create policy "Users manage own trip covers"
on storage.objects for update
using (bucket_id = 'trip-covers' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'trip-covers' and auth.uid()::text = (storage.foldername(name))[1]);