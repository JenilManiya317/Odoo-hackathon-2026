'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BarChart3, Building2, ChevronDown, Compass, Filter, Search, ShieldCheck, SlidersHorizontal, TrendingUp, UserRound, Users, Zap } from 'lucide-react'

type AdminTab = 'Manage Users' | 'Popular cities' | 'Popular Activities' | 'User Trends and Analytics'

const tabs: { label: AdminTab; icon: typeof Users }[] = [
  { label: 'Manage Users', icon: Users },
  { label: 'Popular cities', icon: Building2 },
  { label: 'Popular Activities', icon: Zap },
  { label: 'User Trends and Analytics', icon: TrendingUp },
]

const users = [
  { name: 'Maya Chen', email: 'maya.chen@traveler.co', trips: 12, status: 'Active', initials: 'MC' },
  { name: 'Eli Morgan', email: 'eli.morgan@traveler.co', trips: 8, status: 'Active', initials: 'EM' },
  { name: 'Noah Williams', email: 'noah.williams@traveler.co', trips: 5, status: 'Review', initials: 'NW' },
  { name: 'Sofia Patel', email: 'sofia.patel@traveler.co', trips: 19, status: 'Active', initials: 'SP' },
]

const cities = [
  { name: 'Tokyo', country: 'Japan', value: '84%', count: '1,284 visits' },
  { name: 'Lisbon', country: 'Portugal', value: '68%', count: '968 visits' },
  { name: 'Reykjavík', country: 'Iceland', value: '52%', count: '744 visits' },
]

type AnalyticsCity = (typeof cities)[number]

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('User Trends and Analytics')
  const [query, setQuery] = useState('')
  const [sortRecent, setSortRecent] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredUsers = useMemo(() => users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [query])

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1180px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20 sm:min-h-[calc(100vh-3rem)]">
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to GlobeTrotter home"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span><span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span></Link>
          <div className="flex items-center gap-3"><span className="hidden rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent sm:inline-flex"><ShieldCheck size={14} className="mr-1.5" /> Admin workspace</span><Link href="/profile" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Open profile"><UserRound size={18} /></Link></div>
        </header>

        <section className="border-b border-border px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"><Search size={17} className="shrink-0 text-muted-foreground" /><span className="sr-only">Search admin data</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bar ......" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
            <div className="flex gap-2 overflow-x-auto"><button onClick={() => setActiveTab('User Trends and Analytics')} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"><SlidersHorizontal size={15} /> Group by <span className="text-muted-foreground">{activeTab === 'Manage Users' ? 'Users' : 'Trend'}</span></button><button onClick={() => setFilterOpen(!filterOpen)} aria-expanded={filterOpen} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"><Filter size={15} /> Filter</button><button onClick={() => setSortRecent(!sortRecent)} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted">Sort by <span className="text-muted-foreground">{sortRecent ? 'Recent' : 'Name'}</span><ChevronDown size={14} /></button></div>
          </div>
          {filterOpen && <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm"><span className="text-muted-foreground">Showing live workspace data</span><span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">{activeTab}</span></div>}
        </section>

        <section className="border-b border-border px-5 py-4 sm:px-8"><div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{tabs.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveTab(label)} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition-all sm:text-sm ${activeTab === label ? 'border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/10' : 'border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon size={16} className="shrink-0" /><span>{label}</span></button>)}</div></section>

        <section className="grid gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)] lg:px-8 lg:py-8">
          <div className="min-w-0 space-y-5">
            <div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Overview</p><h1 className="mt-1 font-serif text-3xl sm:text-4xl">{activeTab}</h1></div><span className="text-xs text-muted-foreground">Updated just now</span></div>
            {activeTab === 'Manage Users' ? <div className="overflow-hidden rounded-2xl border border-border bg-background/40"><div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[1.4fr_1fr_auto_auto]"><span>Traveler</span><span className="hidden sm:block">Trips</span><span>Status</span><span /></div>{filteredUsers.map((user) => <div key={user.email} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-4 py-4 last:border-0 sm:grid-cols-[1.4fr_1fr_auto_auto]"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-bold text-accent">{user.initials}</span><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div></div><span className="hidden text-sm text-muted-foreground sm:block">{user.trips} trips</span><span className={`rounded-full px-2.5 py-1 text-xs ${user.status === 'Active' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-accent/10 text-accent'}`}>{user.status}</span><button className="text-xs text-muted-foreground hover:text-foreground">View</button></div>)}</div> : <AnalyticsVisual activeTab={activeTab} cities={cities} />}
          </div>
          <aside className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6"><div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-accent/15 text-accent"><BarChart3 size={21} /></div><h2 className="font-serif text-2xl">Admin notes</h2><div className="mt-5 space-y-5 text-sm leading-6 text-muted-foreground"><p><strong className="font-medium text-foreground">Manage User Section:</strong> View travelers, their actions, and all trips made across the platform.</p><p><strong className="font-medium text-foreground">Popular cities:</strong> Discover destinations rising through current user trends.</p><p><strong className="font-medium text-foreground">Popular Activities:</strong> See the experiences travelers are saving and sharing.</p><p><strong className="font-medium text-foreground">User Trends and Analytics:</strong> Understand movement across key data points.</p></div></aside>
        </section>
      </div>
    </main>
  )
}

function AnalyticsVisual({ activeTab, cities }: { activeTab: AdminTab; cities: AnalyticsCity[] }) {
  const isCities = activeTab === 'Popular cities'
  const isActivities = activeTab === 'Popular Activities'
  const labels = isCities ? cities.map((city) => city.name) : isActivities ? ['Hiking', 'Food tours', 'Museums', 'Paragliding'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const values = isCities ? cities.map((city) => Number.parseInt(city.value)) : isActivities ? [78, 64, 52, 39] : [42, 56, 48, 72, 66, 84]
  return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-3"><Metric label={isCities ? 'Top city' : isActivities ? 'Top activity' : 'Active users'} value={isCities ? 'Tokyo' : isActivities ? 'Hiking' : '2,481'} change="+18.4%" /><Metric label="Avg. trip budget" value="$1,240" change="+9.2%" /><Metric label="Saved places" value="8,942" change="+24.6%" /></div><div className="rounded-2xl border border-border bg-background/40 p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-serif text-xl">{isCities ? 'Where travelers go' : isActivities ? 'What travelers do' : 'Traveler activity'}</h2><p className="mt-1 text-xs text-muted-foreground">A simple read on the latest patterns</p></div><span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent">Live</span></div>{isCities ? <div className="space-y-4">{cities.map((city) => <div key={city.name}><div className="mb-1.5 flex justify-between text-sm"><span>{city.name}, {city.country}</span><span className="text-muted-foreground">{city.count}</span></div><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-all" style={{ width: city.value }} /></div></div>)}</div> : <div className="flex h-52 items-end gap-3 sm:gap-5">{values.map((value, index) => <div key={labels[index]} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="w-full max-w-12 rounded-t-lg bg-accent/80 transition-all hover:bg-accent" style={{ height: `${value * 1.7}px` }} /><span className="truncate text-[11px] text-muted-foreground">{labels[index]}</span></div>)}</div>}</div></div>
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) { return <div className="rounded-2xl border border-border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 font-serif text-2xl">{value}</p><p className="mt-1 text-xs text-emerald-300">{change} this month</p></div> }
