'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Compass,
  DollarSign,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound
} from 'lucide-react'
import {
  getUserPreferences,
  UserPreferences,
  DEFAULT_USER_PREFERENCES
} from '@/lib/supabase/user-data'
import { createClient } from '@/lib/supabase/client'

type Activity = {
  id: string
  title: string
  city: string
  description: string
  category: string
  price: string
  priceNum: number
  image: string
}

const fallbackActivities: Activity[] = [
  { id: 'fallback-1', title: 'Paragliding over the valley', city: 'Interlaken, Switzerland', description: 'Soar above alpine lakes and snow-capped peaks with a certified local pilot.', category: 'Adventure', price: 'From ₹145', priceNum: 145, image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=900&q=85' },
  { id: 'fallback-2', title: 'Kyoto tea ceremony', city: 'Kyoto, Japan', description: 'Learn the rituals and quiet art of matcha in a traditional tea house.', category: 'Culture', price: 'From ₹52', priceNum: 52, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=85' },
  { id: 'fallback-3', title: 'Sunset sailing cruise', city: 'Santorini, Greece', description: 'Drift past volcanic cliffs with a small-group cruise and local mezze.', category: 'Relaxation', price: 'From ₹89', priceNum: 89, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85' },
  { id: 'fallback-4', title: 'Street food discovery walk', city: 'Lisbon, Portugal', description: 'Taste neighborhood favorites while a local guide shares the city’s stories.', category: 'Food & drink', price: 'From ₹38', priceNum: 38, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85' },
  { id: 'fallback-5', title: 'Rainforest waterfall hike', city: 'La Fortuna, Costa Rica', description: 'Follow a lush jungle trail to a cool natural pool beneath a towering fall.', category: 'Nature', price: 'From ₹64', priceNum: 64, image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=85' },
  { id: 'fallback-6', title: 'Midnight museum evening', city: 'Paris, France', description: 'See timeless masterpieces after dark with an art historian by your side.', category: 'Arts', price: 'From ₹72', priceNum: 72, image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=85' },
]

export function ActivitySearch() {
  const [query, setQuery] = useState('')
  const [grouped, setGrouped] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const [activities, setActivities] = useState<Activity[]>(fallbackActivities)

  useEffect(() => {
    async function load() {
      const prefs = await getUserPreferences()
      setPreferences(prefs)
    }
    load()
  }, [])

  useEffect(() => {
    async function loadActivities() {
      const { data, error } = await createClient().from('activities').select('id, name, description, type, cost, image_url, cities(name, country)').order('created_at', { ascending: false })
      if (error || !data?.length) return
      setActivities(data.map((item) => {
        const city = Array.isArray(item.cities) ? item.cities[0] : item.cities
        return { id: item.id, title: item.name, city: city ? `${city.name}, ${city.country}` : 'Unassigned city', description: item.description ?? 'Explore something memorable.', category: item.type ?? 'Activity', price: item.cost ? `From ₹${item.cost}` : 'Free', priceNum: Number(item.cost) || 0, image: item.image_url || fallbackActivities[0].image }
      }))
    }
    loadActivities()
  }, [])

  // Score activities according to Supabase travel preferences
  const scoredActivities = useMemo(() => {
    return activities.map((activity) => {
      let score = 70
      let matchBadge = 'Curated'

      const isMatchStyle = preferences.travel_styles.some(
        (s) =>
          s.toLowerCase().includes(activity.category.toLowerCase()) ||
          activity.category.toLowerCase().includes(s.toLowerCase())
      )

      if (isMatchStyle) {
        score += 24
        matchBadge = `Matches ${activity.category}`
      }

      if (preferences.budget_tier === 'Budget' && activity.priceNum <= 60) {
        score += 5
        matchBadge = 'Budget Friendly Pick'
      } else if (preferences.budget_tier === 'Luxury' && activity.priceNum >= 80) {
        score += 5
      }

      return {
        ...activity,
        matchScore: Math.min(99, score),
        matchBadge,
      }
    })
  }, [preferences])

  const results = useMemo(() => {
    const found = scoredActivities.filter((activity) =>
      `${activity.title} ${activity.city} ${activity.category}`.toLowerCase().includes(query.toLowerCase())
    )
    return [...found].sort((a, b) => {
      if (sortAsc) return a.title.localeCompare(b.title)
      return b.matchScore - a.matchScore
    })
  }, [scoredActivities, query, sortAsc])

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[980px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20 sm:min-h-[calc(100vh-3rem)]">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to GlobeTrotter home">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Compass size={19} />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/recommendations" className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition">
              <Sparkles size={14} /> AI Recommendations
            </Link>
            <Link href="/profile" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Open profile">
              <UserRound size={18} />
            </Link>
          </div>
        </header>

        {/* Filter bar */}
        <section className="border-b border-border px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <Search size={17} className="shrink-0 text-muted-foreground" />
              <span className="sr-only">Search activities or cities</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search activities or city..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              <button
                onClick={() => setGrouped(!grouped)}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"
              >
                <SlidersHorizontal size={15} /> Group by <span className="text-muted-foreground">{grouped ? 'City' : 'Type'}</span>
              </button>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                aria-expanded={filterOpen}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"
              >
                <Filter size={15} /> Filter
              </button>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"
              >
                Sort by... <span className="text-muted-foreground">{sortAsc ? 'A–Z' : 'AI Match'}</span>
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-muted/50 p-3 text-sm">
              <span className="mr-1 text-muted-foreground">Quick filters:</span>
              {['Adventure', 'Culture', 'Food & drink', 'Relaxation'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setQuery(filter)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent/60 hover:bg-background"
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Results */}
        <section className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                <Sparkles size={14} /> Ranked For Your Travel Profile ({preferences.travel_styles.join(', ')})
              </p>
              <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Activity Experiences</h1>
            </div>
            <span className="text-sm text-muted-foreground">{results.length} experiences</span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {results.map((activity) => (
              <Link
                href={`/trips/new?activityId=${activity.id}`}
                key={activity.title}
                className="group flex min-h-[144px] overflow-hidden rounded-2xl border border-border bg-background shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-black/25"
              >
                <div className="relative w-28 shrink-0 overflow-hidden sm:w-44">
                  <img src={activity.image} alt={`${activity.title} in ${activity.city}`} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur-sm">
                    {activity.matchScore}% Match
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                      {activity.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign size={12} />{activity.price}
                    </span>
                    <span className="hidden sm:inline-block text-[11px] text-accent/80 font-medium">
                      ✓ {activity.matchBadge}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl">{activity.title}</h2>
                  <p className="hidden text-sm leading-5 text-muted-foreground sm:block">{activity.description}</p>
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1.5 truncate">
                      <MapPin size={13} className="shrink-0 text-accent" />{activity.city}
                    </span>
                    <span className="font-semibold text-accent transition-transform group-hover:translate-x-1 flex items-center gap-1">
                      Add to Trip <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {!results.length && (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                <Search className="mx-auto text-muted-foreground" size={26} />
                <p className="mt-3 text-sm text-muted-foreground">No experiences match &quot;{query}&quot;.</p>
                <button onClick={() => setQuery('')} className="mt-4 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted">
                  Show all results
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
