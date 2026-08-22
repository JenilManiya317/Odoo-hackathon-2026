'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CalendarDays, Check, Compass, Loader2, MapPin, Plus, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getUserPreferences, UserPreferences, DEFAULT_USER_PREFERENCES, saveLocalTrip } from '@/lib/supabase/user-data'
import additionalDestinations from '@/data/destinations.json'

type City = { id: string; name: string; country: string; image_url: string | null }
type Activity = { id: string; name: string; description: string | null; image_url: string | null; city_id: string | null; cost: number | null }

const fallbackImages = [
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=700&q=80',
]

const catalogCities: City[] = additionalDestinations.map((destination) => ({
  id: `catalog-${destination.id}`,
  name: destination.name,
  country: destination.country,
  image_url: destination.image,
}))

export default function NewTripForm({ cities, activities }: { cities: City[]; activities: Activity[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get('activityId')
  const cityParam = searchParams.get('city')
  const [form, setForm] = useState({ startDate: '', place: '', endDate: '' })
  const [selected, setSelected] = useState<Activity[]>([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const availableCities = useMemo(() => {
    const merged = [...cities, ...catalogCities]
    return Array.from(new Map(merged.map((city) => [`${city.name}, ${city.country}`, city])).values())
  }, [cities])

  useEffect(() => {
    if (!cityParam || !availableCities.some((city) => `${city.name}, ${city.country}` === cityParam)) return
    setForm((current) => ({ ...current, place: cityParam }))
  }, [availableCities, cityParam])

  useEffect(() => {
    async function load() {
      const prefs = await getUserPreferences()
      setPreferences(prefs)
    }
    load()
  }, [])

  useEffect(() => {
    if (!activityId) return
    const activity = activities.find((item) => item.id === activityId)
    if (activity) setSelected((current) => current.some((item) => item.id === activity.id) ? current : [...current, activity])
  }, [activities, activityId])

  const suggestions = useMemo(() => {
    if (activities.length) return activities
    return availableCities.slice(0, 6).map((city) => ({
      id: city.id,
      name: `Explore ${city.name}`,
      description: `${city.name}, ${city.country}`,
      image_url: city.image_url,
      city_id: city.id,
      cost: null,
    }))
  }, [activities, availableCities])

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const toggle = (activity: Activity) => setSelected((current) => current.some((item) => item.id === activity.id) ? current.filter((item) => item.id !== activity.id) : [...current, activity])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setStatus('')
    if (!form.place || !form.startDate || !form.endDate) return setError('Please complete every trip field.')
    if (form.startDate >= form.endDate) return setError('End date must be after the start date.')
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const selectedCity = availableCities.find(
        (item) => `${item.name}, ${item.country}`.toLowerCase() === form.place.toLowerCase() || item.name.toLowerCase() === form.place.toLowerCase()
      )
      const placeParts = form.place.split(',')
      let city: City = selectedCity || {
        id: `custom-${form.place.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: placeParts[0].trim(),
        country: placeParts[1]?.trim() || 'Worldwide',
        image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80',
      }

      if (user && city.id.startsWith('catalog-')) {
        const catalogDestination = additionalDestinations.find((destination) => destination.id === city.id.replace('catalog-', ''))
        const { data: createdCityData } = await supabase.rpc('get_or_create_catalog_city', {
          p_name: city.name,
          p_country: city.country,
          p_region: catalogDestination?.region ?? null,
          p_type: catalogDestination?.type ?? 'Cultural',
          p_image_url: city.image_url,
          p_avg_daily_cost: catalogDestination?.avgDailyCost ?? 120,
          p_recommended_accommodation: catalogDestination?.recommendedAccommodation ?? 'Hotel',
          p_description: catalogDestination?.description ?? null,
        }).maybeSingle()

        let createdCity = createdCityData as City | null

        if (!createdCity) {
          const { data: existingCity } = await supabase.from('cities').select('id, name, country').ilike('name', city.name).maybeSingle()
          if (existingCity) {
            createdCity = existingCity as City
          } else {
            const { data: inserted } = await supabase.from('cities').insert({
              name: city.name,
              country: city.country,
              image_url: city.image_url,
            }).select('id, name, country').maybeSingle()
            if (inserted) createdCity = inserted as City
          }
        }
        if (createdCity) {
          city = createdCity
        }
      }

      let tripId = `trip_${Date.now()}`
      let createdAt = new Date().toISOString()

      if (user) {
        const { data: trip } = await supabase
          .from('trips')
          .insert({
            user_id: user.id,
            name: `Trip to ${form.place}`,
            start_date: form.startDate,
            end_date: form.endDate,
            description: `Trip to ${form.place}`,
            is_public: false,
          })
          .select('id, created_at')
          .maybeSingle()

        if (trip) {
          tripId = trip.id
          if (trip.created_at) createdAt = trip.created_at

          if (!city.id.startsWith('catalog-') && !city.id.startsWith('custom-')) {
            const { data: stop } = await supabase.from('stops').insert({
              trip_id: trip.id,
              city_id: city.id,
              arrival_date: form.startDate,
              departure_date: form.endDate,
              order_index: 0,
            }).select('id').maybeSingle()

            const selectedActivityIds = selected
              .filter((activity) => activities.some((item) => item.id === activity.id))
              .map((activity) => activity.id)

            if (stop && selectedActivityIds.length) {
              await supabase.from('trip_activities').insert(
                selectedActivityIds.map((activityId) => ({
                  stop_id: stop.id,
                  activity_id: activityId,
                  cost: activities.find((activity) => activity.id === activityId)?.cost ?? null,
                }))
              )
            }
          }
        }
      }

      saveLocalTrip({
        id: tripId,
        name: `Trip to ${form.place}`,
        destination: form.place,
        start_date: form.startDate,
        end_date: form.endDate,
        created_at: createdAt,
      })

      setStatus('Trip saved! Redirecting to My Trips...')
      setTimeout(() => {
        router.push('/trips')
      }, 500)
    } catch {
      setError('The travel service is unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={20} /></span>
            <span className="font-serif text-xl font-bold">GlobeTrotter</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/recommendations" className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition">
              <Sparkles size={14} /> AI Recommendations
            </Link>
            <Link href="/" className="rounded-full border border-border bg-muted/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground" aria-label="Back to dashboard">
              <ArrowLeft size={17} />
            </Link>
          </div>
        </header>

        <div className="border-b border-border px-5 py-5 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Create a new trip</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Plan a new adventure.</h1>
        </div>

        <section className="px-5 py-6 sm:px-10 sm:py-8">
          <form onSubmit={submit} className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-accent/15 text-accent"><CalendarDays size={19} /></span>
                <div>
                  <h2 className="font-serif text-xl">Trip details</h2>
                  <p className="text-sm text-muted-foreground">Set the basics, then choose recommended ideas.</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <Sparkles size={13} /> {preferences.travel_styles[0] || 'Curated'} style
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="sm:col-span-2 lg:col-span-1">
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">Select a place</span>
                <input list="city-options" required value={form.place} onChange={(e) => update('place', e.target.value)} placeholder="Choose a destination" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent" />
                <datalist id="city-options">
                  {availableCities.map((city) => (
                    <option key={city.id} value={`${city.name}, ${city.country}`} />
                  ))}
                </datalist>
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">Start date</span>
                <input required type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent" />
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">End date</span>
                <input required type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-accent" />
              </label>
            </div>

            {(error || status) && (
              <p role="status" className={`mt-4 rounded-xl px-3 py-2 text-sm ${error ? 'bg-destructive/10 text-destructive' : 'bg-accent/15 text-accent'}`}>
                {error || status}
              </p>
            )}

            <button disabled={loading} className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-6">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? 'Saving trip...' : 'Create trip'}
            </button>
          </form>

          <div className="mt-9">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Personalized for your travel DNA</p>
                <h2 className="mt-1 font-serif text-2xl">Recommended places to visit & add</h2>
              </div>
              <MapPin size={21} className="mb-1 text-accent" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {suggestions.map((activity, index) => {
                const isSelected = selected.some((item) => item.id === activity.id)
                return (
                  <article key={activity.id} className="group overflow-hidden rounded-2xl border border-border bg-muted/30">
                    <div className="relative aspect-[0.78] overflow-hidden">
                      <img src={activity.image_url || fallbackImages[index % fallbackImages.length]} alt={activity.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                      <button type="button" onClick={() => toggle(activity)} aria-label={`${isSelected ? 'Remove' : 'Add'} ${activity.name}`} className={`absolute bottom-2 right-2 grid size-8 place-items-center rounded-full ${isSelected ? 'bg-accent text-accent-foreground' : 'bg-black/40 text-white backdrop-blur-sm'}`}>
                        {isSelected ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                      <div className="absolute bottom-3 left-3 right-10 text-white">
                        <h3 className="font-serif text-sm leading-tight">{activity.name}</h3>
                        <p className="mt-1 line-clamp-1 text-[11px] text-white/70">{activity.description || 'A great place to explore'}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
