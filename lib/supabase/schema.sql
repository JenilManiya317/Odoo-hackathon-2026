-- Supabase Schema for GlobeTrotter Personalized Recommendations & User Data

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Travel Preferences Table
create table if not exists public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique,
  travel_styles text[] default array['Cultural', 'Adventure', 'Coastal']::text[],
  budget_tier text default 'Moderate' check (budget_tier in ('Budget', 'Moderate', 'Luxury', 'Ultra-Luxury')),
  preferred_accommodation text default 'Hotel' check (preferred_accommodation in ('Hostel', 'Airbnb', 'Hotel', 'Resort', 'Villa', 'Riad')),
  preferred_pace text default 'Balanced' check (preferred_pace in ('Relaxed', 'Balanced', 'Fast-Paced')),
  favorite_regions text[] default array['Europe', 'Asia']::text[],
  traveler_type text default 'Explorer' check (traveler_type in ('Solo Explorer', 'Couple Adventurer', 'Family Traveler', 'Group Seeker')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- 2. User Saved / Favorited Items Table
create table if not exists public.user_favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('destination', 'activity', 'trip')),
  item_id text not null,
  item_name text not null,
  item_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, item_type, item_id)
);

alter table public.user_favorites enable row level security;

create policy "Users can view their favorites"
  on public.user_favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert favorites"
  on public.user_favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their favorites"
  on public.user_favorites for delete
  using (auth.uid() = user_id);

-- 3. Trips Table (if not existing)
create table if not exists public.trips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date,
  description text,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trips enable row level security;

create policy "Users can view their own trips"
  on public.trips for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can create their trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their trips"
  on public.trips for update
  using (auth.uid() = user_id);

-- 4. Cities / Destinations Table
create table if not exists public.cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country text not null,
  region text,
  type text default 'Cultural',
  image_url text,
  popularity integer default 80,
  avg_daily_cost numeric default 120,
  recommended_accommodation text default 'Hotel',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cities enable row level security;

create policy "Public can view cities"
  on public.cities for select
  using (true);

-- 5. Activities Table
create table if not exists public.activities (
  id uuid primary key default uuid_generate_v4(),
  city_id uuid references public.cities(id) on delete set null,
  name text not null,
  description text,
  category text default 'Culture',
  price numeric default 50,
  image_url text,
  duration_hours numeric default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activities enable row level security;

create policy "Public can view activities"
  on public.activities for select
  using (true);

-- 6. Storage Bucket for User Avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true) 
on conflict (id) do nothing;

create policy "Avatars are publicly accessible" 
on storage.objects for select 
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar" 
on storage.objects for insert 
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar" 
on storage.objects for update 
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
