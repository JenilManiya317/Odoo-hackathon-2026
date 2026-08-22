-- ============================================================
-- GlobeTrotter Backend: 002 - Row Level Security
-- Run this after 001_create_tables.sql
-- cities and activities are public reference data -> no RLS needed
-- ============================================================

-- Enable RLS
alter table trips enable row level security;
alter table stops enable row level security;
alter table trip_activities enable row level security;
alter table profiles enable row level security;

-- ---------- TRIPS ----------
create policy "Users manage own trips"
on trips for all
using (auth.uid() = user_id);

create policy "Public trips are viewable"
on trips for select
using (is_public = true);

-- ---------- STOPS ----------
create policy "Users manage own stops"
on stops for all
using (
  exists (
    select 1 from trips
    where trips.id = stops.trip_id
    and trips.user_id = auth.uid()
  )
);

create policy "Public trip stops are viewable"
on stops for select
using (
  exists (
    select 1 from trips
    where trips.id = stops.trip_id
    and trips.is_public = true
  )
);

-- ---------- TRIP ACTIVITIES ----------
create policy "Users manage own trip activities"
on trip_activities for all
using (
  exists (
    select 1 from stops
    join trips on trips.id = stops.trip_id
    where stops.id = trip_activities.stop_id
    and trips.user_id = auth.uid()
  )
);

create policy "Public trip activities are viewable"
on trip_activities for select
using (
  exists (
    select 1 from stops
    join trips on trips.id = stops.trip_id
    where stops.id = trip_activities.stop_id
    and trips.is_public = true
  )
);

-- ---------- PROFILES ----------
create policy "Users manage own profile"
on profiles for all
using (auth.uid() = id);
