'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronUp, CircleUserRound, Pencil, Plus, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Section = { id: string; title: string; description: string; dateRange: string; budget: string; open: boolean; cityId: string | null }

type City = { id: string; name: string; country: string }

export default function ItineraryBuilder() {
  const searchParams = useSearchParams()
  const tripId = searchParams.get('tripId')
  const [sections, setSections] = useState<Section[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      if (!tripId) { setError('Choose a trip before editing its itinerary.'); return }
      const supabase = createClient()
      const [{ data: stops, error: stopsError }, { data: cityRows }] = await Promise.all([
        supabase.from('stops').select('id, city_id, arrival_date, departure_date, cities(name, country)').eq('trip_id', tripId).order('order_index'),
        supabase.from('cities').select('id, name, country').order('name'),
      ])
      if (stopsError) { setError('We could not load this itinerary.'); return }
      setCities(cityRows ?? [])
      setSections((stops ?? []).map((stop, index) => {
        const city = Array.isArray(stop.cities) ? stop.cities[0] : stop.cities
        return { id: stop.id, title: city ? `${city.name}, ${city.country}` : `Stop ${index + 1}`, description: city ? `Plan your time in ${city.name}.` : 'Add details for this stop.', dateRange: `${stop.arrival_date ?? ''} to ${stop.departure_date ?? ''}`, budget: 'Budget not set', open: true, cityId: stop.city_id }
      }))
    }
    load()
  }, [tripId])

  function addSection() {
    const city = cities[sections.length % Math.max(cities.length, 1)]
    setSections((current) => [...current, { id: `new-${Date.now()}`, title: city ? `${city.name}, ${city.country}` : `Stop ${current.length + 1}`, description: city ? `Plan your time in ${city.name}.` : 'Add details for this stop.', dateRange: ' to ', budget: 'Budget not set', open: true, cityId: city?.id ?? null }])
    setSaved(false)
  }

  function updateSection(id: string, key: 'title' | 'description' | 'dateRange' | 'budget', value: string) {
    setSections((current) => current.map((section) => section.id === id ? { ...section, [key]: value } : section))
    setSaved(false)
  }

  async function saveDraft() {
    if (!tripId || !sections.length) return setError('Add at least one stop before saving.')
    setError('')
    const supabase = createClient()
    const results = await Promise.all(sections.map((section, index) => {
      const [arrivalDate, departureDate] = section.dateRange.split(' to ').map((date) => date.trim())
      const values = { trip_id: tripId, city_id: section.cityId, arrival_date: arrivalDate || null, departure_date: departureDate || null, order_index: index }
      return section.id.startsWith('new-')
        ? supabase.from('stops').insert(values)
        : supabase.from('stops').update(values).eq('id', section.id)
    }))
    if (results.some((result) => result.error)) return setError('We could not save the itinerary.')
    setSaved(true)
  }

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[980px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</Link>
          <Link href="/auth" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"><CircleUserRound size={22} /></Link>
        </header>
        <div className="border-b border-border px-5 py-5 sm:px-10">
          <Link href={tripId ? `/trips/new?tripId=${tripId}` : '/trips'} className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft size={16} /> Back to trip details</Link>
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Screen 5 · Build itinerary</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Build your itinerary</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Shape your trip into simple sections for travel, stays, and activities.</p></div><button onClick={saveDraft} className="hidden shrink-0 items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold transition hover:bg-muted sm:inline-flex"><Save size={16} /> {saved ? 'Saved' : 'Save draft'}</button></div>
        </div>
        <section className="space-y-3 px-5 py-5 sm:px-10 sm:py-8">
          {error && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          {sections.map((section, index) => (
            <article key={section.id} className="rounded-2xl border border-border bg-muted/20 p-4 transition hover:border-accent/60 sm:p-5">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><select aria-label={`Edit ${section.title} city`} value={section.cityId ?? ''} onChange={(event) => { const city = cities.find((item) => item.id === event.target.value); updateSection(section.id, 'title', city ? `${city.name}, ${city.country}` : 'Unassigned stop'); setSections((current) => current.map((item) => item.id === section.id ? { ...item, cityId: event.target.value || null } : item)) }} className="w-full max-w-xs bg-transparent font-serif text-lg outline-none"><option value="">Unassigned stop</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.country}</option>)}</select><Pencil size={14} className="shrink-0 text-muted-foreground" /></div>{section.open && <textarea aria-label={`${section.title} description`} value={section.description} onChange={(event) => updateSection(section.id, 'description', event.target.value)} rows={2} className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-muted-foreground outline-none" />}</div><button aria-label={`${section.open ? 'Collapse' : 'Expand'} ${section.title}`} onClick={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, open: !item.open } : item))} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">{section.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button></div>
              {section.open && <div className="mt-4 grid gap-3 sm:grid-cols-2"><input aria-label={`${section.title} date range`} value={section.dateRange} onChange={(event) => updateSection(section.id, 'dateRange', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent" /><input aria-label={`${section.title} budget`} value={section.budget} onChange={(event) => updateSection(section.id, 'budget', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent" /></div>}
              <span className="mt-3 block text-xs text-muted-foreground">{index + 1} of {sections.length} itinerary sections</span>
            </article>
          ))}
          <div className="flex flex-col items-center gap-3 pt-3"><button onClick={addSection} className="inline-flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-5 py-3 font-serif text-base transition hover:bg-accent hover:text-accent-foreground"><Plus size={19} /> Add another Section</button><button onClick={saveDraft} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:hidden"><Save size={15} /> {saved ? 'Draft saved' : 'Save draft'}</button></div>
        </section>
      </div>
    </main>
  )
}
