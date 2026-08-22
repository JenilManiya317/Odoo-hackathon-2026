'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpDown, Compass, Filter, Heart, MapPin, Search, SlidersHorizontal, UserRound } from 'lucide-react'

const posts = [
  { name: 'Maya Chen', initials: 'MC', location: 'Kyoto, Japan', title: 'A quiet morning around Arashiyama', body: 'The bamboo grove is beautiful before 8am. Walk the river path afterward for a slower, more local view of Kyoto.', tag: 'Cultural', likes: 42, tone: 'bg-[#496b62]' },
  { name: 'Jon Bell', initials: 'JB', location: 'Amalfi Coast, Italy', title: 'The best way to see the coast', body: 'Take the early ferry from Salerno and spend the afternoon swimming near Atrani. The views are worth every step.', tag: 'Coastal', likes: 31, tone: 'bg-[#6d5748]' },
  { name: 'Aisha Rahman', initials: 'AR', location: 'Marrakech, Morocco', title: 'Three colors of the medina', body: 'Save time for the spice market, a rooftop mint tea, and the quieter lanes beyond the main square.', tag: 'City break', likes: 56, tone: 'bg-[#7b5c4f]' },
  { name: 'Leo Martins', initials: 'LM', location: 'Patagonia, Chile', title: 'Pack layers, leave room for wonder', body: 'The weather changes fast on the trail. Start with a sunrise hike and keep the afternoon open for the unexpected.', tag: 'Adventure', likes: 28, tone: 'bg-[#435e6b]' },
]

export function CommunityFeed() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('Recent')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('Popular')
  const [liked, setLiked] = useState<string[]>([])

  const visiblePosts = useMemo(() => posts.filter((post) => filter === 'All' || post.tag === filter).filter((post) => `${post.name} ${post.location} ${post.title} ${post.body}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'Popular' ? b.likes - a.likes : 0), [filter, query, sort])

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1120px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20 sm:min-h-[calc(100vh-3rem)]">
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to GlobeTrotter home"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span><span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span></Link>
          <Link href="/profile" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Open profile"><UserRound size={18} /></Link>
        </header>
        <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(250px,0.85fr)]">
          <section className="min-w-0 border-b border-border lg:border-b-0 lg:border-r">
            <div className="border-b border-border p-5 sm:p-7">
              <div className="flex flex-col gap-3 lg:flex-row"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"><Search size={16} className="shrink-0 text-muted-foreground" /><span className="sr-only">Search community</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bar ......" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label><div className="flex gap-2 overflow-x-auto"><button onClick={() => setGroup(group === 'Recent' ? 'Destination' : 'Recent')} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-3 py-3 text-xs hover:bg-muted"><SlidersHorizontal size={14} />Group by <span className="text-muted-foreground">{group}</span></button><button onClick={() => setFilter(filter === 'All' ? 'Adventure' : 'All')} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-3 py-3 text-xs hover:bg-muted"><Filter size={14} />Filter</button><button onClick={() => setSort(sort === 'Popular' ? 'Recent' : 'Popular')} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-3 py-3 text-xs hover:bg-muted"><ArrowUpDown size={14} />Sort by <span className="text-muted-foreground">{sort}</span></button></div></div>
              <div className="mt-6 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Travel stories</p><h1 className="mt-1 font-serif text-3xl">Community tab</h1></div><span className="text-xs text-muted-foreground">{visiblePosts.length} stories</span></div>
            </div>
            <div className="space-y-3 p-5 sm:p-7">{visiblePosts.map((post) => <article key={post.name} className="group flex gap-3 sm:gap-4"><div className={`grid size-10 shrink-0 place-items-center rounded-full ${post.tone} text-xs font-bold text-primary-foreground`}>{post.initials}</div><div className="min-w-0 flex-1 rounded-2xl border border-border bg-muted/25 p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:bg-muted/45 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold">{post.name}</h2><p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} className="text-accent" />{post.location}</p></div><span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">{post.tag}</span></div><h3 className="mt-4 font-serif text-xl">{post.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{post.body}</p><button onClick={() => setLiked((current) => current.includes(post.name) ? current.filter((name) => name !== post.name) : [...current, post.name])} className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-accent" aria-label={`Like story by ${post.name}`}><Heart size={15} fill={liked.includes(post.name) ? 'currentColor' : 'none'} className={liked.includes(post.name) ? 'text-accent' : ''} />{post.likes + (liked.includes(post.name) ? 1 : 0)} likes</button></div></article>)}{!visiblePosts.length && <p className="py-12 text-center text-sm text-muted-foreground">No stories match your search.</p>}</div>
          </section>
          <aside className="p-5 sm:p-8"><div className="sticky top-6 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">A shared atlas</p><h2 className="mt-3 font-serif text-2xl">Travel is better together.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">A community space where GlobeTrotters share experiences about a trip, destination, or activity.</p><div className="my-6 h-px bg-border" /><p className="text-sm leading-6 text-muted-foreground">Use the search, grouping, filter, and sorting options to narrow down the stories you are looking for.</p><Link href="/trips/new" className="mt-6 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02]">Share your next trip</Link></div></aside>
        </div>
      </div>
    </main>
  )
}
