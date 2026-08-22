'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Compass,
  Heart,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
  DollarSign,
  Calendar,
  Check,
  RotateCcw,
  UserRound,
  Layers,
  ChevronRight,
  Plane,
  X
} from 'lucide-react'
import {
  DestinationRecommendation,
  ActivityRecommendation,
  getRecommendedDestinations,
  getRecommendedActivities
} from '@/lib/recommendations'
import {
  getUserPreferences,
  saveUserPreferences,
  getUserFavorites,
  toggleUserFavorite,
  getUserTripsFromSupabase,
  UserPreferences,
  DEFAULT_USER_PREFERENCES
} from '@/lib/supabase/user-data'

const ALL_STYLES = ['Cultural', 'Adventure', 'Coastal', 'City', 'Food & Dining', 'Nature', 'Relaxation']
const ALL_BUDGETS: UserPreferences['budget_tier'][] = ['Budget', 'Moderate', 'Luxury', 'Ultra-Luxury']
const ALL_ACCOMMODATIONS: UserPreferences['preferred_accommodation'][] = ['Hostel', 'Airbnb', 'Hotel', 'Resort', 'Villa', 'Riad']

function getFallbackDestinationImage(name: string, country: string) {
  const label = `${name} | ${country}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 667"><rect width="900" height="667" fill="#163f4a"/><path d="M0 470L210 285l130 110 135-165 185 180 110-85 130 120v222H0z" fill="#2f6870"/><circle cx="705" cy="145" r="70" fill="#f2c078" opacity=".9"/><path d="M450 170c-46 0-83 37-83 83 0 62 83 155 83 155s83-93 83-155c0-46-37-83-83-83zm0 113a30 30 0 1 1 0-60 30 30 0 0 1 0 60z" fill="#f5e6c8"/><text x="450" y="520" fill="#fff" font-family="Georgia,serif" font-size="42" text-anchor="middle">${label}</text><text x="450" y="570" fill="#b9d9d5" font-family="Arial,sans-serif" font-size="22" text-anchor="middle">GlobeTrotter destination</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function RecommendationsView() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const [favorites, setFavorites] = useState<string[]>([])
  const [userTrips, setUserTrips] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [tunerOpen, setTunerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [minScore, setMinScore] = useState<number>(70)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Load user data from Supabase / localStorage on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [prefs, favs, trips] = await Promise.all([
          getUserPreferences(),
          getUserFavorites(),
          getUserTripsFromSupabase(),
        ])
        setPreferences(prefs)
        setFavorites(favs)
        setUserTrips(trips.map((t) => t.destination || t.name))
      } catch (err) {
        console.error('Failed to load recommendation user data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculate dynamic recommendations based on user preferences and history
  const recommendations: DestinationRecommendation[] = useMemo(() => {
    return getRecommendedDestinations(preferences, userTrips, favorites)
  }, [preferences, userTrips, favorites])

  // Personalized activities
  const recommendedActivities: ActivityRecommendation[] = useMemo(() => {
    return getRecommendedActivities(preferences)
  }, [preferences])

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return recommendations.filter((dest) => {
      const matchesSearch = `${dest.name} ${dest.country} ${dest.region} ${dest.tags.join(' ')}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory =
        filterCategory === 'All' ||
        (filterCategory === '90%+ Match' && dest.matchScore >= 90) ||
        dest.type.toLowerCase() === filterCategory.toLowerCase() ||
        dest.styles.some((s) => s.toLowerCase() === filterCategory.toLowerCase())
      const matchesScore = dest.matchScore >= minScore
      return matchesSearch && matchesCategory && matchesScore
    })
  }, [recommendations, searchQuery, filterCategory, minScore])

  // Handle favorite toggle
  async function handleToggleFavorite(destName: string, dest: DestinationRecommendation) {
    const { list } = await toggleUserFavorite(destName, 'destination', {
      country: dest.country,
      region: dest.region,
      type: dest.type,
      image: dest.image,
    })
    setFavorites(list)
  }

  // Update a single preference and persist to Supabase
  async function updatePreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    await saveUserPreferences(updated)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  // Toggle travel style tag
  async function toggleStyle(style: string) {
    const current = preferences.travel_styles
    const updatedStyles = current.includes(style)
      ? current.length > 1
        ? current.filter((s) => s !== style)
        : current
      : [...current, style]
    await updatePreference('travel_styles', updatedStyles)
  }

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        {/* Header */}
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Compass size={20} />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="/" className="hover:text-foreground">Discover</Link>
            <Link href="/recommendations" className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-accent" /> AI Recommendations
            </Link>
            <Link href="/trips" className="hover:text-foreground">My trips</Link>
            <Link href="/activities" className="hover:text-foreground">Activities</Link>
            <Link href="/community" className="hover:text-foreground">Community</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTunerOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition hover:bg-accent hover:text-accent-foreground sm:px-3.5"
              aria-label="Tune Persona"
            >
              <SlidersHorizontal size={14} /> <span className="hidden sm:inline">Tune Persona</span>
            </button>
            <Link
              href="/profile"
              className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <UserRound size={18} />
            </Link>
          </div>
        </header>

        {/* Hero / Persona Banner */}
        <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#122e38] via-[#1b4352] to-[#0f242d] p-6 sm:mx-8 sm:p-10 border border-border/40">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md">
                  <Sparkles size={13} /> Supabase AI Engine
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
                  {preferences.traveler_type}
                </span>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300">
                    <Check size={12} /> Synced to Supabase
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Curated exclusively for <i className="font-normal text-accent">your journey.</i>
              </h1>

              <p className="mt-3 text-sm text-white/80 max-w-xl leading-relaxed">
                Recommendations calculated from your Supabase profile preferences, budget tier, preferred accommodations, and travel history.
              </p>

              {/* Active Persona Tags */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/60 font-medium">Active DNA:</span>
                {preferences.travel_styles.map((style) => (
                  <span key={style} className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                    {style}
                  </span>
                ))}
                <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent">
                  Budget: {preferences.budget_tier}
                </span>
                <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                  Stay: {preferences.preferred_accommodation}
                </span>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-md lg:w-80">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Database Profile Sync</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-white/90">
                <div className="flex justify-between">
                  <span className="text-white/60">Top Match Score:</span>
                  <span className="font-bold text-accent">{recommendations[0]?.matchScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Top Destination:</span>
                  <span className="font-medium">{recommendations[0]?.name}, {recommendations[0]?.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Saved Bookmarks:</span>
                  <span className="font-medium">{favorites.length} saved</span>
                </div>
              </div>
              <button
                onClick={() => setTunerOpen(true)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground transition hover:scale-[1.02]"
              >
                <SlidersHorizontal size={14} /> Adjust Travel Persona
              </button>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="px-4 pt-8 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
              <Search size={17} className="shrink-0 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recommended destinations, tags, regions..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X size={15} className="text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </label>

            {/* Quick category filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', '90%+ Match', 'Cultural', 'Coastal', 'Adventure', 'City'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    filterCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent flex items-center gap-1.5">
                <Sparkles size={13} /> Ranked by Match Score
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl mt-1">Recommended Destinations</h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {filteredDestinations.length} personalized places
            </span>
          </div>

          {/* Destination Cards Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((dest) => {
              const isFav = favorites.includes(dest.name)
              return (
                <article
                  key={dest.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-black/25"
                >
                  {/* Image container */}
                  <div className="relative aspect-[1.35] w-full overflow-hidden bg-muted">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = getFallbackDestinationImage(dest.name, dest.country)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Match Score Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-accent backdrop-blur-md border border-accent/30">
                      <Sparkles size={13} className="text-accent" />
                      <span>{dest.matchScore}% Match</span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => handleToggleFavorite(dest.name, dest)}
                      className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/80"
                      aria-label={`Save ${dest.name}`}
                    >
                      <Heart
                        size={17}
                        fill={isFav ? 'currentColor' : 'none'}
                        className={isFav ? 'text-accent' : 'text-white'}
                      />
                    </button>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                        {dest.region} · {dest.country}
                      </p>
                      <h3 className="font-serif text-2xl">{dest.name}</h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    {/* Why Recommended Pill Breakdown */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                        Why recommended for you:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.matchReasons.map((reason, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-accent/10 border border-accent/20 px-2 py-0.5 text-[11px] text-accent font-medium"
                          >
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs leading-5 text-muted-foreground line-clamp-2">
                      {dest.description}
                    </p>

                    {/* Stats bar */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/50 p-2.5 text-center text-xs">
                      <div>
                        <span className="block text-[10px] text-muted-foreground uppercase">Est. Cost</span>
                        <span className="font-semibold text-foreground">${dest.avgDailyCost}/day</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground uppercase">Stay</span>
                        <span className="font-semibold text-foreground">{dest.recommendedAccommodation}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground uppercase">Duration</span>
                        <span className="font-semibold text-foreground">{dest.suggestedDurationDays} days</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {dest.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/trips/new?city=${encodeURIComponent(`${dest.name}, ${dest.country}`)}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      <Plus size={15} /> Plan Trip to {dest.name}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <Search className="mx-auto text-muted-foreground" size={28} />
              <p className="mt-3 text-sm text-muted-foreground">No destinations match your current filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterCategory('All')
                }}
                className="mt-4 rounded-xl border border-border px-4 py-2 text-xs hover:bg-muted"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Personalized Experiences Section */}
        <section className="border-t border-border px-4 py-8 sm:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent flex items-center gap-1.5">
                <Zap size={13} /> Tailored Experiences
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl mt-1">Recommended Activities</h2>
            </div>
            <Link href="/activities" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
              Browse all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedActivities.map((act) => (
              <div
                key={act.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-muted/20 p-4 transition-all hover:border-accent/50 hover:bg-muted/35"
              >
                <div>
                  <div className="relative aspect-[1.4] overflow-hidden rounded-xl bg-muted">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-accent backdrop-blur-sm border border-accent/20">
                      {act.matchScore}% Match
                    </span>
                    <span className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                      {act.priceFormatted}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-lg leading-tight line-clamp-1">{act.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} className="text-accent" /> {act.city}, {act.country}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{act.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                    {act.category}
                  </span>
                  <Link
                    href={`/trips/new?activityId=${act.id}`}
                    className="font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    Add <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Persona Tuner Modal */}
      {tunerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-black/50 sm:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-accent/20 text-accent">
                  <SlidersHorizontal size={18} />
                </span>
                <div>
                  <h2 className="font-serif text-xl">Tune Travel Persona</h2>
                  <p className="text-xs text-muted-foreground">Updates your Supabase user preferences instantly.</p>
                </div>
              </div>
              <button
                onClick={() => setTunerOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              {/* Travel Styles */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Travel Styles & Vibes (Select all that fit)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_STYLES.map((style) => {
                    const isSelected = preferences.travel_styles.includes(style)
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-accent text-accent-foreground shadow-sm'
                            : 'border border-border bg-muted/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {style} {isSelected && '✓'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Budget Tier */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Budget Level
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ALL_BUDGETS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => updatePreference('budget_tier', tier)}
                      className={`rounded-xl p-2.5 text-xs font-semibold transition text-center ${
                        preferences.budget_tier === tier
                          ? 'border border-accent bg-accent/15 text-accent'
                          : 'border border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Accommodation */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Preferred Accommodation
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {ALL_ACCOMMODATIONS.map((stay) => (
                    <button
                      key={stay}
                      type="button"
                      onClick={() => updatePreference('preferred_accommodation', stay)}
                      className={`rounded-xl py-2 px-1 text-xs font-semibold transition text-center truncate ${
                        preferences.preferred_accommodation === stay
                          ? 'border border-accent bg-accent/15 text-accent'
                          : 'border border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {stay}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Pace */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Travel Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Relaxed', 'Balanced', 'Fast-Paced'] as const).map((pace) => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => updatePreference('preferred_pace', pace)}
                      className={`rounded-xl py-2 text-xs font-semibold transition text-center ${
                        preferences.preferred_pace === pace
                          ? 'border border-accent bg-accent/15 text-accent'
                          : 'border border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {pace}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setPreferences(DEFAULT_USER_PREFERENCES)
                  saveUserPreferences(DEFAULT_USER_PREFERENCES)
                }}
                className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw size={13} /> Reset Defaults
              </button>
              <button
                type="button"
                onClick={() => setTunerOpen(false)}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90"
              >
                Apply & View Recommendations
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
