'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Compass,
  Heart,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
  Zap
} from 'lucide-react'
import {
  getRecommendedDestinations,
  DestinationRecommendation
} from '@/lib/recommendations'
import {
  getUserPreferences,
  getUserFavorites,
  toggleUserFavorite,
  getUserTripsFromSupabase,
  UserPreferences,
  DEFAULT_USER_PREFERENCES
} from '@/lib/supabase/user-data'
import { createClient } from '@/lib/supabase/client'

type DashboardTrip = {
  id: string
  name: string
  destination: string
  dates: string
  image: string
}

const tripImages = [
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1000&q=80',
]

function formatTripDates(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return 'Dates not set'
  const format = (date?: string) => date ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) : '—'
  return `${format(startDate)} — ${format(endDate)}`
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [profileOpen, setProfileOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('Discover')
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const [userTrips, setUserTrips] = useState<string[]>([])
  const [previousTrips, setPreviousTrips] = useState<DashboardTrip[]>([])
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const filters = ['All', '90%+ Match', 'Coastal', 'Cultural', 'Adventure', 'City']

  // Load user data from Supabase / cache
  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserEmail(user.email ?? '')
          const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).maybeSingle()
          setUserName(profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || '')
        }
        const [prefs, favs, trips] = await Promise.all([
          getUserPreferences(),
          getUserFavorites(),
          getUserTripsFromSupabase(),
        ])
        setPreferences(prefs)
        setSaved(favs)
        setUserTrips(trips.map((t) => t.destination || t.name))
        setPreviousTrips(trips.map((trip, index) => ({
          id: trip.id,
          name: trip.name,
          destination: trip.destination,
          dates: formatTripDates(trip.start_date, trip.end_date),
          image: tripImages[index % tripImages.length],
        })))
      } catch (e) {
        console.warn('Could not load user data from Supabase:', e)
      }
    }
    loadUserData()
  }, [])

  // Calculate live recommendations
  const allRecommended: DestinationRecommendation[] = useMemo(() => {
    return getRecommendedDestinations(preferences, userTrips, saved)
  }, [preferences, userTrips, saved])

  // Filtered based on search and category
  const filtered = useMemo(() => {
    return allRecommended.filter((d) => {
      const matchesCategory =
        category === 'All' ||
        (category === '90%+ Match' && d.matchScore >= 90) ||
        d.type.toLowerCase() === category.toLowerCase() ||
        d.styles.some((s) => s.toLowerCase() === category.toLowerCase())
      const matchesQuery = `${d.name} ${d.region} ${d.country} ${d.tags.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [allRecommended, category, query])

  // Top 3 highest match score for hero recommendations
  const topPicks = useMemo(() => allRecommended.slice(0, 3), [allRecommended])

  // Handle favorite toggle with Supabase sync
  async function handleToggleFavorite(dest: DestinationRecommendation) {
    const { list } = await toggleUserFavorite(dest.name, 'destination', {
      country: dest.country,
      region: dest.region,
      type: dest.type,
      image: dest.image,
    })
    setSaved(list)
  }

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        {/* Header */}
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <button className="flex items-center gap-3" onClick={() => setActiveTab('Discover')} aria-label="Go to GlobeTrotter home">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Compass size={20} />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
          </button>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Primary navigation">
            <button onClick={() => setActiveTab('Discover')} className={activeTab === 'Discover' ? 'font-semibold text-foreground' : 'hover:text-foreground'}>Discover</button>
            <Link href="/recommendations" className="hover:text-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-accent" /> AI Recommendations
            </Link>
            <Link href="/trips" className="hover:text-foreground">My trips</Link>
            <Link href="/activities" className="hover:text-foreground">Activities</Link>
            <Link href="/community" className="hover:text-foreground">Community</Link>
          </nav>
          <div className="relative flex items-center gap-3">
            <Link href="/recommendations" className="hidden sm:flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-accent-foreground">
              <Sparkles size={13} /> {preferences.budget_tier} · {preferences.travel_styles[0] || 'Explorer'}
            </Link>
            <button className="hidden rounded-full p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground sm:block" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-full border border-border bg-muted/60 p-1 pr-3" aria-expanded={profileOpen} aria-label="Open profile menu">
              <span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{(userName || userEmail || 'GT').slice(0, 2).toUpperCase()}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-border bg-popover p-2 text-sm shadow-xl">
                <Link href="/profile" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted font-medium">Your profile & persona</Link>
                <Link href="/recommendations" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted flex items-center gap-1.5">
                  <Sparkles size={13} className="text-accent" /> AI Recommendations
                </Link>
                <span className="block px-3 py-2 text-xs text-muted-foreground">{userEmail || 'Guest mode'}</span>
                {userEmail ? <button onClick={async () => { await createClient().auth.signOut(); window.location.href = '/auth' }} className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">Log out</button> : <Link href="/auth" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">Log in / Register</Link>}
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl bg-[#163a47] px-6 py-10 sm:mx-8 sm:px-12 sm:py-16">
          <Image src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85" alt="Sunlit mountain lake surrounded by peaks" fill className="absolute inset-0 object-cover opacity-55 mix-blend-luminosity" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102c36]/95 via-[#163a47]/50 to-transparent" />
          <div className="relative max-w-xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} /> Powered by User Data & AI
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-white sm:text-6xl">
              Go somewhere<br /><i className="font-normal text-accent">wonderful.</i>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/75 sm:text-base">
              Personalized for your {preferences.travel_styles.join(', ')} style and {preferences.budget_tier} travel preferences.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/recommendations" className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]">
                <Sparkles size={16} /> View AI Matches <ArrowRight size={16} />
              </Link>
              <Link href="/trips/new" className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
                Plan a Trip
              </Link>
            </div>
          </div>
        </section>

        {/* AI Recommendations Highlight Section */}
        <section className="mx-4 mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:mx-8 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Sparkles size={15} />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Personalized For You</p>
              </div>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Top Matches from Your Profile</h2>
            </div>
            <Link href="/recommendations" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
              Explore all recommendations <ArrowRight size={13} />
            </Link>
          </div>

          {/* Top 3 Cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {topPicks.map((pick) => {
              const isFav = saved.includes(pick.name)
              return (
                <div key={pick.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent/60 hover:shadow-xl hover:shadow-black/20">
                  <div className="relative aspect-[1.5] w-full overflow-hidden rounded-xl bg-muted">
                    <Image src={pick.image} alt={pick.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-bold text-accent backdrop-blur-sm border border-accent/20">
                      {pick.matchScore}% Match
                    </span>
                    <button
                      onClick={() => handleToggleFavorite(pick)}
                      aria-label={`Save ${pick.name}`}
                      className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/80"
                    >
                      <Heart size={15} fill={isFav ? 'currentColor' : 'none'} className={isFav ? 'text-accent' : 'text-white'} />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 text-white">
                      <p className="text-[10px] uppercase tracking-wider text-white/70">{pick.region} · {pick.country}</p>
                      <h3 className="font-serif text-lg font-bold">{pick.name}</h3>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-1 flex-col justify-between space-y-3">
                    <div className="rounded-lg bg-accent/10 p-2 text-[11px] text-accent font-medium leading-relaxed">
                      ✓ {pick.matchReasons[0] || 'Matches your travel persona'}
                    </div>
                    <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                        <span>Est. ₹{pick.avgDailyCost}/day</span>
                        <span>Stay: {pick.recommendedAccommodation}</span>
                      </div>
                      <Link
                        href={`/trips/new?city=${encodeURIComponent(`${pick.name}, ${pick.country}`)}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/90 px-2 py-2 text-[11px] font-bold text-primary-foreground transition hover:bg-primary"
                      >
                        <Plus size={14} /> Plan trip to {pick.name}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Main Explore Section */}
        <section className="px-4 pb-8 pt-7 sm:px-8 sm:pt-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your compass</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Where will you wander?</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-accent" /> {allRecommended.length} destinations curated
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-2 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-card px-4 py-3">
              <Search size={18} className="shrink-0 text-muted-foreground" />
              <span className="sr-only">Search destinations</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by country, vibe, or tag..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <div className="flex gap-2 overflow-x-auto">
              <Link href="/recommendations" className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition">
                <Sparkles size={16} /> Persona Tuner
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Regional & Style Selections</h2>
            <Link href="/recommendations" className="hidden text-sm font-semibold text-accent hover:underline sm:block">
              View AI Ranking <ArrowRight size={14} className="ml-1 inline" />
            </Link>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setCategory(filter)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  category === filter
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Destination Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((destination) => {
              const isSaved = saved.includes(destination.name)
              return (
                <article key={destination.name} className="group relative aspect-[0.8] overflow-hidden rounded-2xl bg-muted shadow-md">
                  <Image src={destination.image} alt={`${destination.name}, ${destination.region}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 20vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur-sm border border-accent/20">
                    {destination.matchScore}% Match
                  </span>
                  <button
                    onClick={() => handleToggleFavorite(destination)}
                    aria-label={`Save ${destination.name}`}
                    className="absolute right-2.5 top-2.5 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/70 transition hover:scale-110"
                  >
                    <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-accent' : 'text-white'} />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">{destination.region}</p>
                        <h3 className="font-serif text-lg leading-tight">{destination.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-white/70 uppercase">Est. Cost</span>
                        <span className="text-[11px] font-bold text-accent">₹{destination.avgDailyCost}/day</span>
                      </div>
                    </div>
                    <p className="mt-1 mb-2.5 text-[11px] text-accent/90 line-clamp-1 font-medium">{destination.matchReasons[0]}</p>
                    <Link
                      href={`/trips/new?city=${encodeURIComponent(`${destination.name}, ${destination.country}`)}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/90 px-2 py-1.5 text-[10px] font-bold text-primary-foreground backdrop-blur-sm transition hover:bg-primary"
                    >
                      <Plus size={12} /> Plan trip to {destination.name}
                    </Link>
                  </div>
                </article>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
                No destinations found for &quot;{query}&quot;. Try another search.
              </p>
            )}
          </div>

          {/* Previous Trips Section */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-8">
            <h2 className="font-serif text-2xl">Previous trips</h2>
            <Link href="/trips" className="text-sm font-semibold text-accent hover:underline">
              See archive <ArrowRight size={14} className="ml-1 inline" />
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {previousTrips.map((trip) => (
              <article key={trip.id} className="group overflow-hidden rounded-2xl border border-border bg-muted/35">
                <div className="relative aspect-[1.8] overflow-hidden">
                  <Image src={trip.image} alt={trip.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white backdrop-blur-sm">Saved trip</span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg">{trip.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{trip.destination}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{trip.dates}</p>
                </div>
              </article>
            ))}
            {!previousTrips.length && <div className="col-span-full rounded-2xl border border-dashed border-border px-5 py-8 text-center"><p className="text-sm text-muted-foreground">Your saved trips will appear here.</p><Link href="/trips/new" className="mt-3 inline-flex text-sm font-semibold text-accent hover:underline">Plan your first trip <ArrowRight size={14} className="ml-1 inline" /></Link></div>}
          </div>
        </section>

        {/* Floating CTA */}
        <Link href="/trips/new" className="fixed bottom-24 right-5 z-10 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105 sm:bottom-8 sm:right-8 md:bottom-8">
          <Plus size={17} /> Plan a trip
        </Link>
      </div>
    </main>
  )
}
