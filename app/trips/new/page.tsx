import { createClient } from '@/lib/supabase/server'
import NewTripForm from '@/components/new-trip-form'

export default async function NewTripPage() {
  const supabase = await createClient()
  const [{ data: cities }, { data: activities }] = await Promise.all([
    supabase.from('cities').select('id, name, country, image_url').order('popularity', { ascending: false }).limit(12),
    supabase.from('activities').select('id, name, description, image_url, city_id').order('created_at', { ascending: false }).limit(6),
  ])

  return <NewTripForm cities={cities ?? []} activities={activities ?? []} />
}
