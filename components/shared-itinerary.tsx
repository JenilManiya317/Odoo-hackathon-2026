'use client'

import { useState } from 'react'
import { Check, Copy, MapPin } from 'lucide-react'

type SharedStop = { id: string; city: string; arrival: string | null; departure: string | null; activities: string[] }

export function SharedItinerary({ name, stops }: { name: string; stops: SharedStop[] }) {
  const [copied, setCopied] = useState(false)
  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8"><div className="mx-auto max-w-3xl"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Shared itinerary</p><h1 className="mt-2 font-serif text-3xl sm:text-5xl">{name}</h1></div><button onClick={copyLink} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy link'}</button></div><section className="mt-8 space-y-4">{stops.map((stop, index) => <article key={stop.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-accent" size={18} /><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Stop {index + 1}</p><h2 className="mt-1 font-serif text-2xl">{stop.city}</h2><p className="mt-1 text-sm text-muted-foreground">{stop.arrival || 'Date not set'} to {stop.departure || 'Date not set'}</p></div></div>{stop.activities.length ? <ul className="mt-5 space-y-2 border-t border-border pt-4">{stop.activities.map((activity) => <li key={activity} className="text-sm text-muted-foreground">{activity}</li>)}</ul> : <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">No activities added yet.</p>}</article>)}{!stops.length && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">This itinerary has no stops yet.</p>}</section></div></main>
}
