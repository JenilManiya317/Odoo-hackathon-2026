'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Bell, ChevronDown, Compass, Heart, MapPin, Plus, Search, SlidersHorizontal, Sparkles, Star, X } from 'lucide-react'

const destinations = [
  { name: 'Amalfi Coast', region: 'Italy', type: 'Coastal', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80', color: 'coral' },
  { name: 'Kyoto', region: 'Japan', type: 'Cultural', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80', color: 'sage' },
  { name: 'Marrakech', region: 'Morocco', type: 'Cultural', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=80', color: 'gold' },
  { name: 'Patagonia', region: 'Chile', type: 'Adventure', image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80', color: 'blue' },
  { name: 'Copenhagen', region: 'Denmark', type: 'City', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80', color: 'coral' },
]

const previousTrips = [
  { name: 'Lisbon & Porto', dates: 'May 12 — May 21, 2024', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1000&q=80', places: '12 places saved' },
  { name: 'The Greek Islands', dates: 'Aug 04 — Aug 15, 2023', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=1000&q=80', places: '8 places saved' },
  { name: 'New York City', dates: 'Oct 19 — Oct 25, 2022', image: 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1000&q=80', places: '15 places saved' },
]

export default function Page() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [profileOpen, setProfileOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('Discover')
  const filters = ['All', 'Coastal', 'Cultural', 'Adventure', 'City']
  const filtered = useMemo(() => destinations.filter((d) => (category === 'All' || d.type === category) && `${d.name} ${d.region}`.toLowerCase().includes(query.toLowerCase())), [category, query])

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <button className="flex items-center gap-3" onClick={() => setActiveTab('Discover')} aria-label="Go to GlobeTrotter home">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={20} /></span>
            <span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span>
          </button>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Primary navigation">
            {['Discover', 'My trips', 'Saved'].map((item) => <button key={item} onClick={() => setActiveTab(item)} className={activeTab === item ? 'font-semibold text-foreground' : 'hover:text-foreground'}>{item}</button>)}
          </nav>
          <div className="relative flex items-center gap-3">
            <button className="hidden rounded-full p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground sm:block" aria-label="Notifications"><Bell size={18} /></button>
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-full border border-border bg-muted/60 p-1 pr-3" aria-expanded={profileOpen} aria-label="Open profile menu"><span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">AM</span><ChevronDown size={14} className="text-muted-foreground" /></button>
            {profileOpen && <div className="absolute right-0 top-12 z-20 w-40 rounded-xl border border-border bg-popover p-2 text-sm shadow-xl"><Link href="/auth" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">Your profile</Link><Link href="/auth" className="block w-full rounded-lg px-3 py-2 text-left hover:bg-muted">Log in</Link></div>}
          </div>
        </header>

        <section className="relative mx-4 mt-4 overflow-hidden rounded-2xl bg-[#163a47] px-6 py-10 sm:mx-8 sm:px-12 sm:py-16">
          <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85" alt="Sunlit mountain lake surrounded by peaks" className="absolute inset-0 size-full object-cover opacity-55 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102c36]/95 via-[#163a47]/50 to-transparent" />
          <div className="relative max-w-xl"><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"><Sparkles size={14} /> Curated for curious minds</p><h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-white sm:text-6xl">Go somewhere<br /><i className="font-normal text-accent">wonderful.</i></h1><p className="mt-5 max-w-md text-sm leading-6 text-white/75 sm:text-base">Find the places that make you feel most alive. Your next story starts here.</p><Link href="/trips/new" className="mt-7 flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]">Start exploring <ArrowRight size={16} /></Link></div>
        </section>

        <section className="px-4 pb-8 pt-7 sm:px-8 sm:pt-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your compass</p><h2 className="mt-1 font-serif text-2xl sm:text-3xl">Where will you wander?</h2></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={16} className="text-accent" /> 24 trips planned</div></div>
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-2 sm:flex-row"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-card px-4 py-3"><Search size={18} className="shrink-0 text-muted-foreground" /><span className="sr-only">Search destinations</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a country, city, or feeling..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}</label><div className="flex gap-2 overflow-x-auto"><button className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-card"><SlidersHorizontal size={16} /> Filters</button><button className="whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-card">Sort by <span className="text-muted-foreground">Recommended</span></button></div></div>

          <div className="mt-8 flex items-center justify-between"><h2 className="font-serif text-2xl">Top regional selections</h2><button className="hidden text-sm font-semibold text-accent hover:underline sm:block">View all <ArrowRight size={14} className="ml-1 inline" /></button></div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">{filters.map((filter) => <button key={filter} onClick={() => setCategory(filter)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${category === filter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{filter}</button>)}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{filtered.map((destination) => <article key={destination.name} className="group relative aspect-[0.8] overflow-hidden rounded-2xl bg-muted"><img src={destination.image} alt={`${destination.name}, ${destination.region}`} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" /><button onClick={() => setSaved((s) => s.includes(destination.name) ? s.filter((n) => n !== destination.name) : [...s, destination.name])} aria-label={`Save ${destination.name}`} className="absolute right-2 top-2 rounded-full bg-black/25 p-2 text-white backdrop-blur-sm hover:bg-black/50"><Heart size={15} fill={saved.includes(destination.name) ? 'currentColor' : 'none'} /></button><div className="absolute bottom-3 left-3 text-white"><p className="text-[11px] font-medium uppercase tracking-wider text-white/70">{destination.region}</p><h3 className="font-serif text-lg">{destination.name}</h3></div></article>)}{filtered.length === 0 && <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No destinations found. Try another search.</p>}</div>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-8"><h2 className="font-serif text-2xl">Previous trips</h2><button className="text-sm font-semibold text-accent hover:underline">See archive <ArrowRight size={14} className="ml-1 inline" /></button></div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">{previousTrips.map((trip) => <article key={trip.name} className="group overflow-hidden rounded-2xl border border-border bg-muted/35"><div className="relative aspect-[1.8] overflow-hidden"><img src={trip.image} alt={trip.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] text-white backdrop-blur-sm">{trip.places}</span></div><div className="p-4"><h3 className="font-serif text-lg">{trip.name}</h3><p className="mt-1 text-xs text-muted-foreground">{trip.dates}</p></div></article>)}</div>
        </section>
        <button className="fixed bottom-5 right-5 z-10 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105 sm:bottom-8 sm:right-8"><Plus size={17} /> Plan a trip</button>
      </div>
    </main>
  )
}
