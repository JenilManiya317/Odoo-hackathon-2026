-- Complete the schema used by authentication, dashboard, and trip creation.

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists email text;

alter table public.cities add column if not exists image_url text;
alter table public.cities add column if not exists region text;
alter table public.cities add column if not exists type text default 'Cultural';
alter table public.cities add column if not exists avg_daily_cost numeric default 120;
alter table public.cities add column if not exists recommended_accommodation text default 'Hotel';
alter table public.cities add column if not exists description text;
alter table public.activities add column if not exists created_at timestamp with time zone default now();

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  travel_styles text[] default array['Cultural', 'Adventure', 'Coastal']::text[],
  budget_tier text default 'Moderate',
  preferred_accommodation text default 'Hotel',
  preferred_pace text default 'Balanced',
  favorite_regions text[] default array['Europe', 'Asia']::text[],
  traveler_type text default 'Solo Explorer',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_type text not null,
  item_id text not null,
  item_name text not null,
  item_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  unique (user_id, item_type, item_id)
);

alter table public.user_preferences enable row level security;
alter table public.user_favorites enable row level security;

drop policy if exists "Users can view their own preferences" on public.user_preferences;
create policy "Users can view their own preferences" on public.user_preferences for select using (auth.uid() = user_id);
drop policy if exists "Users can insert their own preferences" on public.user_preferences;
create policy "Users can insert their own preferences" on public.user_preferences for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update their own preferences" on public.user_preferences;
create policy "Users can update their own preferences" on public.user_preferences for update using (auth.uid() = user_id);

drop policy if exists "Users can view their favorites" on public.user_favorites;
create policy "Users can view their favorites" on public.user_favorites for select using (auth.uid() = user_id);
drop policy if exists "Users can insert favorites" on public.user_favorites;
create policy "Users can insert favorites" on public.user_favorites for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete their favorites" on public.user_favorites;
create policy "Users can delete their favorites" on public.user_favorites for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, city, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', concat_ws(' ', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name')),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'country'
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    city = excluded.city,
    country = excluded.country;
  return new;
end;
$$ language plpgsql security definer;