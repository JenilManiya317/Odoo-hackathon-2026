'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Compass,
  Loader2,
  Edit3,
  Heart,
  LogOut,
  MapPin,
  Plus,
  Save,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Zap
} from 'lucide-react'
import {
  getUserPreferences,
  saveUserPreferences,
  getUserFavorites,
  getUserTripsFromSupabase,
  UserPreferences,
  DEFAULT_USER_PREFERENCES
} from '@/lib/supabase/user-data'
import {
  getRecommendedDestinations,
  DestinationRecommendation
} from '@/lib/recommendations'
import { createClient } from '@/lib/supabase/client'

type ProfileTrip = {
  id?: string
  title: string
  destination: string
  dates: string
  image: string
  kind: 'Preplanned' | 'Previous'
}

const staticTrips: ProfileTrip[] = [
  { id: 'static-1', title: 'Japan in Spring', destination: 'Kyoto, Japan', dates: 'Apr 18 — Apr 26, 2026', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=85', kind: 'Preplanned' },
  { title: 'Amalfi Coast Escape', destination: 'Amalfi, Italy', dates: 'Jun 08 — Jun 16, 2026', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85', kind: 'Preplanned' },
  { title: 'Iceland Road Trip', destination: 'Reykjavik, Iceland', dates: 'Sep 02 — Sep 12, 2026', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=85', kind: 'Preplanned' },
  { title: 'Lisbon & Porto', destination: 'Portugal', dates: 'May 12 — May 21, 2024', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85', kind: 'Previous' },
  { title: 'The Greek Islands', destination: 'Cyclades, Greece', dates: 'Aug 04 — Aug 15, 2023', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=900&q=85', kind: 'Previous' },
  { title: 'New York City', destination: 'New York, USA', dates: 'Oct 19 — Oct 25, 2022', image: 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=900&q=85', kind: 'Previous' },
]

const ALL_STYLES = ['Cultural', 'Adventure', 'Coastal', 'City', 'Food & Dining', 'Nature', 'Relaxation']
const ALL_BUDGETS: UserPreferences['budget_tier'][] = ['Budget', 'Moderate', 'Luxury', 'Ultra-Luxury']
const ALL_ACCOMMODATIONS: UserPreferences['preferred_accommodation'][] = ['Hostel', 'Airbnb', 'Hotel', 'Resort', 'Villa', 'Riad']
const ALL_PACES: UserPreferences['preferred_pace'][] = ['Relaxed', 'Balanced', 'Fast-Paced']

function ProfileTripCard({ trip }: { trip: ProfileTrip }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-black/25">
      <div className="relative h-40 overflow-hidden sm:h-44">
        <Image src={trip.image} alt={`${trip.destination} travel scene`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{trip.kind}</span>
      </div>
      <div className="flex min-h-44 flex-col gap-3 p-4">
        <div>
          <h3 className="font-serif text-xl">{trip.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={13} className="text-accent" />{trip.destination}
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays size={13} />{trip.dates}</p>
        <Link href={trip.id ? `/trips/itinerary?tripId=${trip.id}` : '/trips'} className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
          View trip <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export function UserProfile() {
  const [editing, setEditing] = useState(false)
  const [editingPrefs, setEditingPrefs] = useState(false)
  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [profileTrips, setProfileTrips] = useState<ProfileTrip[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES)
  const [favorites, setFavorites] = useState<string[]>([])
  const [supabaseTrips, setSupabaseTrips] = useState<string[]>([])
  const [savedMsg, setSavedMsg] = useState(false)

  // Fetch preferences and trips from Supabase on mount
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const [{ data: profile }, prefs, favs, trips] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', user.id).maybeSingle(),
        getUserPreferences(),
        getUserFavorites(),
        getUserTripsFromSupabase(),
      ])
      setPreferences(prefs)
      setFavorites(favs)
      setSupabaseTrips(trips.map((t) => t.destination || t.name))
      setName(profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || '')
      setFirstName(user.user_metadata?.first_name || '')
      setLastName(user.user_metadata?.last_name || '')
      setPhone(user.user_metadata?.phone || '')
      setCity(user.user_metadata?.city || '')
      setCountry(user.user_metadata?.country || '')
      setAvatarUrl(user.user_metadata?.avatar_url || '')
      setProfileTrips(trips.map((trip, index) => ({ id: trip.id, title: trip.name, destination: trip.destination, dates: `${trip.start_date ?? 'Date not set'} — ${trip.end_date ?? 'Date not set'}`, image: `https://images.unsplash.com/photo-${['1555881400-74d7acaacd8b', '1530841377377-3ff06c0ca713', '1496588152823-86ff7695e68f'][index % 3]}?auto=format&fit=crop&w=900&q=85`, kind: trip.end_date && trip.end_date < new Date().toISOString().slice(0, 10) ? 'Previous' : 'Preplanned' })))
    }
    init()
  }, [])

  async function saveProfileName() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !name.trim()) return
    await supabase.from('profiles').upsert({ id: user.id, name: name.trim() })
    await supabase.auth.updateUser({
      data: { name: name.trim(), first_name: firstName, last_name: lastName, phone, city, country }
    })
    setSavedMsg(true)
    setEditing(false)
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) throw new Error('You must select an image to upload.')
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `profile_${Math.random()}.${fileExt}`
      
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(`${user.id}/${filePath}`, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/${filePath}`)
      
      await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      })
      setAvatarUrl(data.publicUrl)
    } catch (error: any) {
      alert('Error uploading avatar: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  // Calculate curated recommendations for profile
  const curatedDestinations: DestinationRecommendation[] = useMemo(() => {
    return getRecommendedDestinations(preferences, supabaseTrips, favorites).slice(0, 3)
  }, [preferences, supabaseTrips, favorites])

  const preplanned = profileTrips.filter((trip) => trip.kind === 'Preplanned')
  const previous = profileTrips.filter((trip) => trip.kind === 'Previous')

  // Save updated preferences to Supabase
  async function handleSavePreferences(updated: UserPreferences) {
    setPreferences(updated)
    await saveUserPreferences(updated)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2500)
  }

  function toggleStyle(style: string) {
    const list = preferences.travel_styles.includes(style)
      ? preferences.travel_styles.length > 1
        ? preferences.travel_styles.filter((s) => s !== style)
        : preferences.travel_styles
      : [...preferences.travel_styles, style]
    handleSavePreferences({ ...preferences, travel_styles: list })
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1040px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20 sm:min-h-[calc(100vh-3rem)]">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span>
            <span className="hidden sm:block font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/recommendations" className="flex size-9 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent transition hover:bg-accent hover:text-accent-foreground sm:h-auto sm:w-auto sm:px-3.5 sm:py-1.5 sm:gap-1.5 sm:text-xs sm:font-semibold" aria-label="AI Matches">
              <Sparkles size={14} /> <span className="hidden sm:inline">AI Matches</span>
            </Link>
            <button onClick={handleLogout} aria-label="Log Out" className="flex size-9 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive transition hover:bg-destructive hover:text-destructive-foreground sm:h-auto sm:w-auto sm:px-3.5 sm:py-1.5 sm:gap-1.5 sm:text-xs sm:font-semibold">
              <LogOut size={14} /> <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Profile Card */}
        <section className="border-b border-border px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <label htmlFor="avatar-upload" className="group relative block cursor-pointer">
                <div className="grid size-32 place-items-center overflow-hidden rounded-full border-2 border-accent/70 bg-gradient-to-br from-accent/20 to-accent/5 sm:size-36 relative">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="User profile" fill className="object-cover" sizes="128px" />
                  ) : (
                    <UserRound size={48} className="text-accent/60" />
                  )}
                  <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploading ? <Loader2 className="animate-spin text-white" size={24} /> : <Camera className="text-white" size={24} />}
                  </div>
                </div>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
              </label>
              <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-card bg-accent pointer-events-none" />
            </div>
            <div className="min-w-0 flex-1 rounded-2xl border border-border bg-background p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Your Profile & Supabase Persona</p>
                  {editing ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                      <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  ) : (
                    <>
                      <h1 className="mt-1 font-serif text-2xl sm:text-3xl">{name}</h1>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span>{email}</span>
                        {(city || country) && <span>• {city}{city && country && ', '}{country}</span>}
                        {phone && <span>• {phone}</span>}
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => editing ? saveProfileName() : setEditing(true)}
                  className="flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-muted"
                >
                  <Edit3 size={14} />{editing ? 'Save details' : 'Edit name'}
                </button>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Collecting stories, good food, and places that make you want to stay a little longer.
              </p>
            </div>
          </div>
        </section>

        {/* Travel Persona & Preferences Panel (Synced with Supabase) */}
        <section className="border-b border-border bg-muted/20 px-5 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-accent/20 text-accent">
                  <SlidersHorizontal size={13} />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Travel Persona & AI DNA</p>
              </div>
              <h2 className="mt-1 font-serif text-2xl">Your Travel Preferences</h2>
            </div>
            <div className="flex items-center gap-2">
              {savedMsg && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Check size={13} /> Saved to Supabase
                </span>
              )}
              <button
                onClick={() => setEditingPrefs(!editingPrefs)}
                className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition"
              >
                <SlidersHorizontal size={13} /> {editingPrefs ? 'Close Editor' : 'Customize Preferences'}
              </button>
            </div>
          </div>

          {editingPrefs ? (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
              {/* Style selection */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Preferred Travel Styles
                </span>
                <div className="flex flex-wrap gap-2">
                  {ALL_STYLES.map((style) => {
                    const isSelected = preferences.travel_styles.includes(style)
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'border border-border bg-muted/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {style} {isSelected && '✓'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Budget & Stay */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Budget Tier
                  </span>
                  <select
                    value={preferences.budget_tier}
                    onChange={(e) => handleSavePreferences({ ...preferences, budget_tier: e.target.value as UserPreferences['budget_tier'] })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                  >
                    {ALL_BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Preferred Stay
                  </span>
                  <select
                    value={preferences.preferred_accommodation}
                    onChange={(e) => handleSavePreferences({ ...preferences, preferred_accommodation: e.target.value as UserPreferences['preferred_accommodation'] })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                  >
                    {ALL_ACCOMMODATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Travel Pace
                  </span>
                  <select
                    value={preferences.preferred_pace}
                    onChange={(e) => handleSavePreferences({ ...preferences, preferred_pace: e.target.value as UserPreferences['preferred_pace'] })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                  >
                    {ALL_PACES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Styles</span>
                <p className="mt-1 text-xs font-bold text-foreground truncate">{preferences.travel_styles.join(', ')}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Budget Tier</span>
                <p className="mt-1 text-xs font-bold text-accent">{preferences.budget_tier}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Stay Style</span>
                <p className="mt-1 text-xs font-bold text-foreground">{preferences.preferred_accommodation}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Pace</span>
                <p className="mt-1 text-xs font-bold text-foreground">{preferences.preferred_pace}</p>
              </div>
            </div>
          )}
        </section>

        {/* AI Recommendations Curated for Profile */}
        <section className="border-b border-border px-5 py-7 sm:px-8 sm:py-8 bg-accent/5">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent flex items-center gap-1.5">
                <Sparkles size={13} /> Supabase AI Engine
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Curated For Your Profile</h2>
            </div>
            <Link href="/recommendations" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
              View All Ranked Picks <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {curatedDestinations.map((dest) => (
              <div key={dest.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-accent/60 hover:shadow-md">
                <div className="relative h-36 overflow-hidden">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 20vw" />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-bold text-accent backdrop-blur-sm">
                    {dest.matchScore}% Match
                  </span>
                  <div className="absolute bottom-2 left-2.5 text-white">
                    <p className="text-[10px] uppercase text-white/70">{dest.country}</p>
                    <h3 className="font-serif text-base font-bold">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-3.5 space-y-2">
                  <p className="text-[11px] text-accent font-medium leading-tight line-clamp-1">
                    ✓ {dest.matchReasons[0]}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <span>${dest.avgDailyCost}/day</span>
                    <Link href="/trips/new" className="font-semibold text-accent hover:underline">
                      Plan Trip →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trips Sections */}
        <div className="space-y-10 px-5 py-7 sm:px-8 sm:py-9">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Next up</p>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Preplanned Trips</h2>
              </div>
              <span className="text-sm text-muted-foreground">{preplanned.length} trips</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preplanned.map((trip) => <ProfileTripCard key={trip.id ?? trip.title} trip={trip} />)}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Your archive</p>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl">Previous Trips</h2>
              </div>
              <span className="text-sm text-muted-foreground">{previous.length} trips</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previous.map((trip) => <ProfileTripCard key={trip.id ?? trip.title} trip={trip} />)}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
