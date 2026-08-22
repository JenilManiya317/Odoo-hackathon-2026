'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowDownUp, CircleUserRound, Filter, Grip, Loader2, MapPin, Search, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ItineraryBuilder from '@/components/itinerary-builder'

type Activity = { id: string; title: string; detail: string; expense: string; category: string }
type Day = { label: string; date: string; activities: Activity[] }

export default function ItineraryView() {
  const searchParams = useSearchParams()
  const tripId = searchParams.get('tripId')
  const [initialDays, setInitialDays] = useState<Day[]>([])
  const [tripName, setTripName] = useState('Selected trip')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all')
  const [sort, setSort] = useState<'day' | 'cost'>('day')

  useEffect(() => {
    async function loadItinerary() {
      if (!tripId) { setLoading(false); return }
      const supabase = createClient()
      const [{ data: trip }, { data: stops, error }] = await Promise.all([
        supabase.from('trips').select('name').eq('id', tripId).maybeSingle(),
        supabase.from('stops').select('id, arrival_date, departure_date, cities(name, country), trip_activities(id, cost, activities(name, description, type))').eq('trip_id', tripId).order('order_index'),
      ])
      if (trip) setTripName(trip.name)
      if (!error) setInitialDays((stops ?? []).map((stop, index) => {
        const city = Array.isArray(stop.cities) ? stop.cities[0] : stop.cities
        const activities = (stop.trip_activities ?? []).map((item) => {
          const activity = Array.isArray(item.activities) ? item.activities[0] : item.activities
          return { id: item.id, title: activity?.name ?? 'Planned activity', detail: activity?.description ?? 'No activity details provided.', expense: item.cost ? `$${item.cost}` : 'Free', category: activity?.type ?? 'Activity' }
        })
        return { label: `Stop ${index + 1}`, date: `${stop.arrival_date ?? 'Date not set'} — ${stop.departure_date ?? 'Date not set'}${city ? ` · ${city.name}, ${city.country}` : ''}`, activities }
      }))
      setLoading(false)
    }
    loadItinerary()
  }, [tripId])

  const days = useMemo(() => initialDays.map((day) => ({
    ...day,
    activities: day.activities
      .filter((activity) => `${activity.title} ${activity.detail} ${activity.category}`.toLowerCase().includes(query.toLowerCase()))
      .filter((activity) => filter === 'all' || (filter === 'free' ? activity.expense === 'Free' : activity.expense !== 'Free'))
      .sort((a, b) => sort === 'cost' ? b.expense.localeCompare(a.expense) : a.id.localeCompare(b.id)),
  })).filter((day) => day.activities.length > 0), [filter, initialDays, query, sort])

  if (searchParams.get('edit') === '1') return <ItineraryBuilder />

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[980px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</Link>
          <Link href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"><CircleUserRound size={22} /></Link>
        </header>
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:px-9">
          <label className="relative min-w-0 flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><span className="sr-only">Search itinerary</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bar ......" className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent" /></label>
          <div className="grid grid-cols-3 gap-2 sm:flex"><button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs font-semibold transition hover:bg-muted"><Grip size={14} /> Group by</button><button onClick={() => setFilter(filter === 'all' ? 'paid' : filter === 'paid' ? 'free' : 'all')} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs font-semibold transition hover:bg-muted"><Filter size={14} /> {filter === 'all' ? 'Filter' : filter === 'paid' ? 'Paid' : 'Free'}</button><button onClick={() => setSort(sort === 'day' ? 'cost' : 'day')} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs font-semibold transition hover:bg-muted"><ArrowDownUp size={14} /> Sort by...</button></div>
        </div>
        <section className="px-4 py-6 sm:px-9 sm:py-8">
          <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{tripName}</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Your itinerary</h1><div className="mt-3"><Link href={tripId ? `/trips/itinerary?tripId=${tripId}&edit=1` : '/trips'} className="text-sm font-semibold text-accent hover:underline">Build or edit itinerary</Link></div></div>
          {loading && <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>}
          <div className="mt-7 hidden grid-cols-[100px_minmax(0,1fr)_130px] items-center gap-4 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:grid"><span>Day</span><span>Physical Activity</span><span className="text-right">Expense</span></div>
          <div className="mt-5 space-y-8">{days.map((day) => <section key={day.label} aria-labelledby={day.label}><div className="mb-3 flex items-center gap-3"><span className="rounded-xl border border-accent/60 bg-accent/10 px-3 py-2 font-serif text-base text-accent">{day.label}</span><span className="text-sm text-muted-foreground">{day.date}</span></div><div className="space-y-2">{day.activities.map((activity, index) => <div key={activity.id} className="grid grid-cols-1 gap-2 sm:grid-cols-[100px_minmax(0,1fr)_130px] sm:gap-4"><div className="hidden sm:block" /> <div className="relative"><article className="rounded-2xl border border-border bg-muted/20 p-4 transition hover:border-accent/70 hover:bg-muted/40"><div className="flex items-start justify-between gap-3"><div><h3 className="font-serif text-lg">{activity.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{activity.detail}</p></div><MapPin size={18} className="mt-1 shrink-0 text-accent" /></div><span className="mt-3 inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{activity.category}</span></article>{index < day.activities.length - 1 && <div className="absolute -bottom-3 left-6 z-10 h-4 border-l border-dashed border-accent/70" aria-hidden="true" />}</div><div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 sm:block sm:px-3 sm:py-4"><span className="text-xs uppercase tracking-[0.15em] text-muted-foreground sm:block">Expense</span><span className="font-serif text-lg text-accent">{activity.expense}</span></div></div>)}</div></section>)}</div>
          {days.length === 0 && <div className="rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">No itinerary stops match your search.</div>}
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-muted/20 px-4 py-4"><div><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Estimated total</p><p className="mt-1 font-serif text-2xl">${initialDays.flatMap((day) => day.activities).reduce((total, activity) => total + (activity.expense === 'Free' ? 0 : Number(activity.expense.replace(/[^0-9.]/g, '')) || 0), 0).toFixed(2)}</p></div><Wallet size={22} className="text-accent" /></div>
        </section>
      </div>
    </main>
  )
}
