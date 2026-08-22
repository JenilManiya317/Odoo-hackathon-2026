'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, SlidersHorizontal, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

type TripEvent = { name: string; start: string; end: string; tone: string }

export function CalendarView() {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [events, setEvents] = useState<TripEvent[]>([])
  const [query, setQuery] = useState('')
  const [grouped, setGrouped] = useState(false)
  const [filtered, setFiltered] = useState(false)

  useEffect(() => {
    async function loadTrips() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('trips').select('name, start_date, end_date').eq('user_id', user.id).not('start_date', 'is', null).not('end_date', 'is', null)
      setEvents((data ?? []).map((trip, index) => ({ name: trip.name.toUpperCase(), start: trip.start_date!, end: trip.end_date!, tone: index % 2 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground' })))
    }
    loadTrips()
  }, [])

  const days = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const cells: (number | null)[] = Array(firstDay).fill(null)
    for (let day = 1; day <= totalDays; day += 1) cells.push(day)
    while (cells.length % 7) cells.push(null)
    return cells
  }, [month])

  const visibleEvents = events.filter((event) => !query || event.name.toLowerCase().includes(query.toLowerCase()))
  const eventForDay = (day: number) => visibleEvents.find((event) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day).getTime()
    return date >= new Date(`${event.start}T00:00:00`).getTime() && date <= new Date(`${event.end}T00:00:00`).getTime()
  })

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-card/60 shadow-2xl shadow-black/20">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <a href="/" className="font-serif text-xl tracking-wide text-foreground">GlobeTrotter</a>
          <a href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border transition hover:border-accent hover:text-accent"><UserRound className="size-4" /></a>
        </header>

        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:px-7">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search calendar events</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bar ......" className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </label>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <button type="button" onClick={() => setGrouped(!grouped)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm transition ${grouped ? 'border-accent text-accent' : 'border-input hover:border-accent'}`} aria-pressed={grouped}>Group by <ChevronDown className="size-3.5" /></button>
            <button type="button" onClick={() => setFiltered(!filtered)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm transition ${filtered ? 'border-accent text-accent' : 'border-input hover:border-accent'}`} aria-pressed={filtered}><SlidersHorizontal className="size-3.5" /> Filter</button>
            <button type="button" onClick={() => setMonth(new Date())} className="h-11 rounded-xl border border-input px-3 text-sm transition hover:border-accent">Sort by...</button>
          </div>
        </div>

        <section className="p-4 sm:p-7 lg:p-10">
          <div className="mb-6 text-center">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-accent">Your journey at a glance</p>
            <h1 className="font-serif text-3xl sm:text-4xl">Calendar View</h1>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground shadow-xl">
            <div className="flex items-center justify-between border-b border-primary-foreground/15 px-4 py-5 sm:px-7">
              <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month" className="grid size-10 place-items-center rounded-full transition hover:bg-primary-foreground/10"><ArrowLeft className="size-5" /></button>
              <h2 className="font-serif text-2xl sm:text-3xl">{monthNames[month.getMonth()]} {month.getFullYear()}</h2>
              <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month" className="grid size-10 place-items-center rounded-full transition hover:bg-primary-foreground/10"><ArrowRight className="size-5" /></button>
            </div>
            <div className="grid grid-cols-7 border-b border-primary-foreground/15">
              {weekDays.map((day) => <div key={day} className="px-1 py-3 text-center text-[10px] font-semibold tracking-wider text-primary-foreground/65 sm:text-xs">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const event = day ? eventForDay(day) : undefined
                const starts = event ? new Date(`${event.start}T00:00:00`).toDateString() === new Date(month.getFullYear(), month.getMonth(), day ?? 0).toDateString() : false
                return <div key={`${day}-${index}`} className={`relative min-h-20 border-b border-r border-primary-foreground/10 p-2 sm:min-h-28 sm:p-3 ${day && index % 7 > 4 ? 'bg-primary-foreground/[0.03]' : ''}`}>
                  {day && <span className="text-sm font-medium">{day}</span>}
                  {event && <div className={`absolute inset-x-1 bottom-2 rounded-md px-1.5 py-1 text-[9px] font-bold leading-tight sm:inset-x-2 sm:text-[10px] ${event.tone} ${starts ? '' : 'opacity-80'}`} title={event.name}>{starts ? event.name : ' '}</div>}
                </div>
              })}
            </div>
          </div>
          {filtered && <p className="mt-4 text-center text-sm text-muted-foreground">Showing planned events only.</p>}
          {grouped && <p className="mt-1 text-center text-sm text-muted-foreground">Trips are grouped by destination.</p>}
        </section>
      </div>
    </main>
  )
}
