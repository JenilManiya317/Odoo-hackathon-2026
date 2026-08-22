import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SharedItinerary } from '@/components/shared-itinerary'

export default async function SharedItineraryPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const supabase = await createClient()
  const { data: trip } = await supabase.from('trips').select('name, is_public').eq('id', tripId).eq('is_public', true).maybeSingle()
  if (!trip) notFound()
  const { data: stops } = await supabase.from('stops').select('id, arrival_date, departure_date, cities(name, country), trip_activities(activities(name))').eq('trip_id', tripId).order('order_index')
  return <SharedItinerary name={trip.name} stops={(stops ?? []).map((stop) => { const city = Array.isArray(stop.cities) ? stop.cities[0] : stop.cities; return { id: stop.id, city: city ? `${city.name}, ${city.country}` : 'Unassigned stop', arrival: stop.arrival_date, departure: stop.departure_date, activities: (stop.trip_activities ?? []).map((item) => { const activity = Array.isArray(item.activities) ? item.activities[0] : item.activities; return activity?.name ?? 'Planned activity' }) } })} />
}
