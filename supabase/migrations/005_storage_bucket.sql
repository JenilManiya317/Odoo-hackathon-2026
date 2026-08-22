-- ============================================================
-- GlobeTrotter Backend: 005 - Storage Bucket
-- Creates a bucket for trip cover photo uploads
-- ============================================================

insert into storage.buckets (id, name, public)
values ('trip-covers', 'trip-covers', true)
on conflict (id) do nothing;

-- Anyone can view cover photos (public bucket)
create policy "Public read access for trip covers"
on storage.objects for select
using (bucket_id = 'trip-covers');

-- Only authenticated users can upload
create policy "Authenticated users can upload trip covers"
on storage.objects for insert
with check (bucket_id = 'trip-covers' and auth.role() = 'authenticated');

-- Users can only update/delete their own uploaded files
-- (assumes file path starts with the user's uid, e.g. "<uid>/cover.jpg")
create policy "Users manage own trip covers"
on storage.objects for update
using (bucket_id = 'trip-covers' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own trip covers"
on storage.objects for delete
using (bucket_id = 'trip-covers' and auth.uid()::text = (storage.foldername(name))[1]);
