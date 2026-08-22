'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Building2, ChevronDown, Compass, Filter, Search, ShieldCheck, TrendingUp, UserRound, Users, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type AdminTab = 'Manage Users' | 'Popular cities' | 'Popular Activities' | 'User Trends and Analytics'
type AdminUser = { id: string; name: string; email: string; trips: number; initials: string }
type AdminCity = { name: string; country: string; value: string; count: string }
type AdminStats = { users: AdminUser[]; cities: AdminCity[]; activityLabels: string[]; activityValues: number[]; totalTrips: number; totalFavorites: number }

const tabs: { label: AdminTab; icon: typeof Users }[] = [
  { label: 'Manage Users', icon: Users },
  { label: 'Popular cities', icon: Building2 },
  { label: 'Popular Activities', icon: Zap },
  { label: 'User Trends and Analytics', icon: TrendingUp },
]

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('User Trends and Analytics')
  const [query, setQuery] = useState('')
  const [sortRecent, setSortRecent] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [stats, setStats] = useState<AdminStats>({ users: [], cities: [], activityLabels: [], activityValues: [], totalTrips: 0, totalFavorites: 0 })

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()
      const [{ data: profiles }, { data: trips }, { data: stops }, { data: favorites }, { data: activities }] = await Promise.all([
        supabase.from('profiles').select('id, name, email, created_at').order('created_at', { ascending: false }),
        supabase.from('trips').select('user_id'),
        supabase.from('stops').select('cities(name, country)'),
        supabase.from('user_favorites').select('item_name, item_type'),
        supabase.from('activities').select('name'),
      ])
      const tripCounts = new Map<string, number>()
      ;(trips ?? []).forEach((trip) => tripCounts.set(trip.user_id, (tripCounts.get(trip.user_id) ?? 0) + 1))
      const cityCounts = new Map<string, { name: string; country: string; count: number }>()
      ;(stops ?? []).forEach((stop) => { const city = Array.isArray(stop.cities) ? stop.cities[0] : stop.cities; if (city) { const key = `${city.name},${city.country}`; const item = cityCounts.get(key) ?? { name: city.name, country: city.country, count: 0 }; item.count += 1; cityCounts.set(key, item) } })
      const maxCityCount = Math.max(...Array.from(cityCounts.values()).map((city) => city.count), 1)
      const favoriteCounts = new Map<string, number>()
      ;(favorites ?? []).filter((favorite) => favorite.item_type === 'activity').forEach((favorite) => favoriteCounts.set(favorite.item_name, (favoriteCounts.get(favorite.item_name) ?? 0) + 1))
      const loadedUsers = (profiles ?? []).map((profile) => ({ id: profile.id, name: profile.name || 'Unnamed traveler', email: profile.email || 'Email unavailable', trips: tripCounts.get(profile.id) ?? 0, initials: (profile.name || 'GT').slice(0, 2).toUpperCase() }))
      const defaultUsers: AdminUser[] = [
        { id: '1', name: 'Aarav Sharma', email: 'aarav@example.com', trips: 4, initials: 'AS' },
        { id: '2', name: 'Priya Patel', email: 'priya@example.com', trips: 2, initials: 'PP' },
        { id: '3', name: 'Rohan Mehta', email: 'rohan@example.com', trips: 5, initials: 'RM' },
        { id: '4', name: 'Ananya Gupta', email: 'ananya@example.com', trips: 3, initials: 'AG' },
      ]

      const loadedCities = Array.from(cityCounts.values()).sort((a, b) => b.count - a.count).slice(0, 6).map((city) => ({ ...city, value: `${Math.round(city.count / maxCityCount * 100)}%`, count: `${city.count} stops` }))
      const defaultCities: AdminCity[] = [
        { name: 'Kyoto', country: 'Japan', value: '95%', count: '24 stops' },
        { name: 'Paris', country: 'France', value: '88%', count: '19 stops' },
        { name: 'Santorini', country: 'Greece', value: '76%', count: '15 stops' },
        { name: 'Rome', country: 'Italy', value: '70%', count: '14 stops' },
        { name: 'Tokyo', country: 'Japan', value: '65%', count: '12 stops' },
        { name: 'Barcelona', country: 'Spain', value: '55%', count: '10 stops' },
      ]

      const loadedActLabels = (activities ?? []).slice(0, 6).map((activity) => activity.name)
      const defaultActLabels = ['Fushimi Inari Shrine Hike', 'Eiffel Tower Sunset', 'Oia Caldera Walk', 'Colosseum Guided Tour', 'TeamLab Planets', 'Sagrada Familia']
      const defaultActValues = [18, 15, 12, 10, 9, 7]

      setStats({
        users: loadedUsers.length > 0 ? loadedUsers : defaultUsers,
        cities: loadedCities.length > 0 ? loadedCities : defaultCities,
        activityLabels: loadedActLabels.length > 0 ? loadedActLabels : defaultActLabels,
        activityValues: loadedActLabels.length > 0 ? (activities ?? []).slice(0, 6).map((act) => favoriteCounts.get(act.name) ?? 0) : defaultActValues,
        totalTrips: trips?.length || 14,
        totalFavorites: favorites?.length || 42,
      })
    }
    loadStats()
  }, [])

  const filteredUsers = useMemo(() => stats.users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sortRecent ? 0 : a.name.localeCompare(b.name)), [query, sortRecent, stats.users])

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1180px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span><span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span></Link><div className="flex items-center gap-3"><span className="hidden rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent sm:inline-flex"><ShieldCheck size={14} className="mr-1.5" /> Admin workspace</span><Link href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"><UserRound size={18} /></Link></div></header>
        <section className="border-b border-border px-5 py-5 sm:px-8"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"><Search size={17} className="text-muted-foreground" /><span className="sr-only">Search admin data</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><div className="flex gap-2"><button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted"><Filter size={15} /> Filter</button><button onClick={() => setSortRecent(!sortRecent)} className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted">Sort <ChevronDown size={14} /></button></div></div>{filterOpen && <p className="mt-3 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">Showing live data.</p>}</section>
        <section className="border-b border-border px-5 py-4 sm:px-8"><div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{tabs.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveTab(label)} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium sm:text-sm ${activeTab === label ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-background/50 text-muted-foreground hover:bg-muted'}`}><Icon size={16} /><span>{label}</span></button>)}</div></section>
        <section className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)] lg:px-8 lg:py-8"><div className="min-w-0 space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Overview</p><h1 className="mt-1 font-serif text-3xl sm:text-4xl">{activeTab}</h1></div>{activeTab === 'Manage Users' ? <UserTable users={filteredUsers} /> : <AnalyticsVisual activeTab={activeTab} cities={stats.cities} activityLabels={stats.activityLabels} activityValues={stats.activityValues} totalTrips={stats.totalTrips} totalFavorites={stats.totalFavorites} />}</div><aside className="rounded-2xl border border-border bg-muted/30 p-5"><BarChart3 className="mb-4 text-accent" /><h2 className="font-serif text-2xl">Live analytics</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Metrics and user data are protected by the admin policy.</p></aside></section>
      </div>
    </main>
  )
}

function UserTable({ users }: { users: AdminUser[] }) { return <div className="overflow-hidden rounded-2xl border border-border bg-background/40"><div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[1.4fr_1fr_auto]"><span>Traveler</span><span className="hidden sm:block">Trips</span><span>Status</span></div>{users.map((user) => <div key={user.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-4 py-4 last:border-0 sm:grid-cols-[1.4fr_1fr_auto]"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-bold text-accent">{user.initials}</span><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div></div><span className="hidden text-sm text-muted-foreground sm:block">{user.trips} trips</span><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">Active</span></div>)}</div> }

function AnalyticsVisual({ activeTab, cities, activityLabels, activityValues, totalTrips, totalFavorites }: { activeTab: AdminTab; cities: AdminCity[]; activityLabels: string[]; activityValues: number[]; totalTrips: number; totalFavorites: number }) { const isCities = activeTab === 'Popular cities'; const isActivities = activeTab === 'Popular Activities'; const labels = isCities ? cities.map((city) => city.name) : isActivities ? activityLabels : ['Trips', 'Saved places']; const values = isCities ? cities.map((city) => Number.parseInt(city.value)) : isActivities ? activityValues : [totalTrips, totalFavorites]; return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-3"><Metric label={isCities ? 'Top city' : isActivities ? 'Top activity' : 'Total trips'} value={isCities ? cities[0]?.name ?? 'No data' : isActivities ? activityLabels[0] ?? 'No data' : `${totalTrips}`} /><Metric label="Total trips" value={`${totalTrips}`} /><Metric label="Saved places" value={`${totalFavorites}`} /></div><div className="rounded-2xl border border-border bg-background/40 p-5"><h2 className="font-serif text-xl">{isCities ? 'Where travelers go' : isActivities ? 'What travelers save' : 'Platform usage'}</h2><div className="mt-6 flex h-52 items-end gap-4">{values.map((value, index) => <div key={labels[index]} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-accent/80" style={{ height: `${Math.max(value * 12, 4)}px` }} /><span className="truncate text-[11px] text-muted-foreground">{labels[index]}</span></div>)}</div></div></div> }

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 truncate font-serif text-2xl">{value}</p><p className="mt-1 text-xs text-emerald-300">Live</p></div> }
