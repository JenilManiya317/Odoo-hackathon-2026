-- Allow authenticated trip creators to materialize a shared catalog destination.
-- The cities table remains admin-managed for direct client writes.
create or replace function public.get_or_create_catalog_city(
  p_name text,
  p_country text,
  p_region text default null,
  p_type text default 'Cultural',
  p_image_url text default null,
  p_avg_daily_cost numeric default 120,
  p_recommended_accommodation text default 'Hotel',
  p_description text default null
)
returns table (id uuid, name text, country text, image_url text)
language plpgsql
security definer
set search_path = public
as $$
declare
  catalog_city public.cities;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select c.* into catalog_city
  from public.cities c
  where lower(c.name) = lower(p_name)
    and lower(coalesce(c.country, '')) = lower(coalesce(p_country, ''))
  limit 1;

  if not found then
    insert into public.cities (
      name,
      country,
      region,
      type,
      image_url,
      popularity,
      avg_daily_cost,
      recommended_accommodation,
      description
    )
    values (
      p_name,
      p_country,
      p_region,
      coalesce(nullif(p_type, ''), 'Cultural'),
      p_image_url,
      0,
      coalesce(p_avg_daily_cost, 120),
      coalesce(nullif(p_recommended_accommodation, ''), 'Hotel'),
      p_description
    )
    returning * into catalog_city;
  end if;

  return query select catalog_city.id, catalog_city.name, catalog_city.country, catalog_city.image_url;
end;
$$;

grant execute on function public.get_or_create_catalog_city(text, text, text, text, text, numeric, text, text) to authenticated;
