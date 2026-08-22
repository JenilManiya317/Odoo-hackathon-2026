'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, Compass, Filter, Heart, Loader2, MapPin, Plus, Search, SlidersHorizontal, Trash2, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getDetailedFavorites, getUserTripsFromSupabase, toggleUserFavorite } from '@/lib/supabase/user-data'

type Trip = {
  id: string
  name: string
  destination: string
  dates: string
  status: 'Ongoing' | 'Up-coming' | 'Liked & Saved' | 'Completed'
  image: string
  places: number
  accent: string
  activities: string[]
  isFavorite?: boolean
}

const tripImages = ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=85']

const categories: Trip['status'][] = ['Ongoing', 'Up-coming', 'Liked & Saved', 'Completed']

export function TripListing() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [groupBy, setGroupBy] = useState<'status' | 'destination'>('status')
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent')
  const [filterOpen, setFilterOpen] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    async function loadTrips() {
      const [items, favorites] = await Promise.all([
        getUserTripsFromSupabase(),
        getDetailedFavorites(),
      ])

      const today = new Date().toISOString().slice(0, 10)

      const createdTrips: Trip[] = items.map((trip, index) => ({
        id: trip.id,
        name: trip.name,
        destination: trip.destination || 'Destination not set',
        dates: trip.start_date && trip.end_date ? `${trip.start_date} — ${trip.end_date}` : 'Pre-planned',
        status: trip.end_date && trip.end_date < today ? 'Completed' : trip.start_date && trip.start_date <= today ? 'Ongoing' : 'Up-coming',
        image: trip.image || tripImages[index % tripImages.length],
        places: 1,
        accent: 'Personal trip',
        activities: (trip as any).activities || [],
        isFavorite: false,
      }))

      const likedTrips: Trip[] = favorites.map((fav, index) => ({
        id: fav.id,
        name: `Favorited: ${fav.name}`,
        destination: fav.name,
        dates: 'Saved to Favorites',
        status: 'Liked & Saved',
        image: (fav.data?.image as string) || tripImages[(index + 2) % tripImages.length],
        places: 1,
        accent: 'Liked Place',
        activities: [],
        isFavorite: true,
      }))

      setTrips([...createdTrips, ...likedTrips])
      setLoading(false)
    }
    loadTrips()
  }, [])

  async function deleteTrip(trip: Trip) {
    if (trip.isFavorite) {
      if (!window.confirm(`Remove ${trip.destination} from your saved favorites?`)) return
      await toggleUserFavorite(trip.destination)
      setTrips((current) => current.filter((item) => item.id !== trip.id))
      return
    }

    if (!window.confirm(`Delete ${trip.name}?`)) return
    try {
      await createClient().from('trips').delete().eq('id', trip.id)
      const cached = localStorage.getItem('globetrotter_user_trips')
      if (cached) {
        const list = JSON.parse(cached)
        localStorage.setItem('globetrotter_user_trips', JSON.stringify(list.filter((item: { id: string }) => item.id !== trip.id)))
      }
    } catch {
      // ignore
    }
    setTrips((current) => current.filter((item) => item.id !== trip.id))
  }

  const filteredTrips = useMemo(() => {
    const result = trips.filter((trip) => `${trip.name} ${trip.destination}`.toLowerCase().includes(query.toLowerCase()) && (showCompleted || trip.status !== 'Completed'))
    return [...result].sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : trips.indexOf(a) - trips.indexOf(b))
  }, [query, showCompleted, sortBy])

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[980px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20 sm:min-h-[calc(100vh-3rem)]">
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to GlobeTrotter home">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span>
            <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
          </Link>
          <Link href="/auth" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Open profile"><UserRound size={18} /></Link>
        </header>

        <section className="border-b border-border px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <Search size={17} className="shrink-0 text-muted-foreground" />
              <span className="sr-only">Search trips</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved & pre-planned trips..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <div className="flex gap-2 overflow-x-auto">
              <button onClick={() => setGroupBy(groupBy === 'status' ? 'destination' : 'status')} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"><SlidersHorizontal size={15} /> Group by <span className="text-muted-foreground">{groupBy === 'status' ? 'Status' : 'Place'}</span></button>
              <button onClick={() => setFilterOpen(!filterOpen)} aria-expanded={filterOpen} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"><Filter size={15} /> Filter</button>
              <button onClick={() => setSortBy(sortBy === 'recent' ? 'name' : 'recent')} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted">Sort by <span className="text-muted-foreground">{sortBy === 'recent' ? 'Recent' : 'Name'}</span><ChevronDown size={14} /></button>
            </div>
          </div>
          {filterOpen && <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm"><span className="text-muted-foreground">Show completed trips</span><button onClick={() => setShowCompleted(!showCompleted)} className={`h-6 w-11 rounded-full p-1 transition-colors ${showCompleted ? 'bg-accent' : 'bg-border'}`} aria-label="Toggle completed trips"><span className={`block size-4 rounded-full bg-background transition-transform ${showCompleted ? 'translate-x-5' : ''}`} /></button></div>}
        </section>

        <section className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
          {loading && <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>}
          {categories.map((category) => {
            const categoryTrips = filteredTrips.filter((trip) => trip.status === category)
            if (!categoryTrips.length) return null
            return (
              <div key={category}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-serif text-2xl sm:text-3xl flex items-center gap-2">
                    {category === 'Liked & Saved' && <Heart size={20} className="text-accent fill-accent" />}
                    {category}
                  </h2>
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{categoryTrips.length} {categoryTrips.length === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="space-y-3">
                  {categoryTrips.map((trip) => (
                    <div key={trip.id} className="group relative flex min-h-[150px] overflow-hidden rounded-2xl border border-border bg-muted/30 transition-all hover:border-accent/60">
                      <Link href={trip.isFavorite ? `/trips/new?city=${encodeURIComponent(trip.destination)}` : `/trips/itinerary?tripId=${trip.id}`} className="flex min-w-0 flex-1">
                        <div className="relative w-[34%] min-w-[120px] overflow-hidden sm:w-[28%]">
                          <img src={trip.image} alt={`${trip.destination} travel scene`} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${trip.isFavorite ? 'bg-accent/20 text-accent' : 'bg-accent/15 text-accent'}`}>{trip.accent}</span>
                            <span className="text-xs text-muted-foreground">{trip.places} {trip.places === 1 ? 'place' : 'places'}</span>
                          </div>
                          <h3 className="truncate font-serif text-xl sm:text-2xl">{trip.name}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-accent" />{trip.destination}</span>
                            <span className="flex items-center gap-1.5"><CalendarDays size={13} />{trip.dates}</span>
                          </div>
                          {trip.activities && trip.activities.length > 0 && <p className="truncate text-xs text-muted-foreground">Activities: {trip.activities.join(', ')}</p>}
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 pr-4">
                        <Link href={`/trips/new?city=${encodeURIComponent(trip.destination)}`} aria-label={`Plan trip to ${trip.destination}`} className="flex items-center gap-1 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:opacity-90">
                          <Plus size={13} /> Plan trip
                        </Link>
                        <button onClick={() => deleteTrip(trip)} aria-label={`Delete ${trip.name}`} className="p-2 text-muted-foreground hover:text-destructive">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {!filteredTrips.length && !loading && (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <Search className="mx-auto text-muted-foreground" size={26} />
              <p className="mt-3 text-sm text-muted-foreground">No trips or saved destinations found.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
