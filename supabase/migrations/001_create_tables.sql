-- ============================================================
-- GlobeTrotter Backend: 001 - Create Tables
-- Run this first in the Supabase SQL Editor
-- ============================================================

-- Profiles: extends Supabase's built-in auth.users
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  photo_url text,
  language text default 'en',
  created_at timestamp default now()
);

-- Cities: reference data, shared by all users
create table if not exists cities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  country text,
  cost_index numeric,
  popularity int
);

-- Activities: reference data, shared by all users
create table if not exists activities (
  id uuid default gen_random_uuid() primary key,
  city_id uuid references cities on delete cascade,
  name text not null,
  type text,
  cost numeric,
  duration text,
  description text,
  image_url text
);

-- Trips: created by users
create table if not exists trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  start_date date,
  end_date date,
  description text,
  cover_photo text,
  is_public boolean default false,
  created_at timestamp default now()
);

-- Stops: a city visit within a trip
create table if not exists stops (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips on delete cascade,
  city_id uuid references cities,
  arrival_date date,
  departure_date date,
  order_index int
);

-- Trip activities: activities assigned to a specific stop
create table if not exists trip_activities (
  id uuid default gen_random_uuid() primary key,
  stop_id uuid references stops on delete cascade,
  activity_id uuid references activities,
  scheduled_date date,
  scheduled_time time,
  cost numeric
);
