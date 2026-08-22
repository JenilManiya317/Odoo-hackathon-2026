-- Persist builder details and ensure uploads stay in the uploader's folder.
alter table public.stops add column if not exists description text;
alter table public.stops add column if not exists budget text;

drop policy if exists "Authenticated users can upload trip covers" on storage.objects;
create policy "Authenticated users can upload trip covers"
on storage.objects for insert
with check (bucket_id = 'trip-covers' and auth.uid()::text = (storage.foldername(name))[1]);

