'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, CircleUserRound, Pencil, Plus, Save } from 'lucide-react'

type Section = { id: number; title: string; description: string; dateRange: string; budget: string; open: boolean }

const starterSections: Section[] = [
  { id: 1, title: 'Section 1', description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity', dateRange: 'Date range: xxx to yyy', budget: 'Budget of this section', open: true },
  { id: 2, title: 'Section 2', description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity', dateRange: 'Date range: xxx to yyy', budget: 'Budget of this section', open: true },
  { id: 3, title: 'Section 3', description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity', dateRange: 'Date range: xxx to yyy', budget: 'Budget of this section', open: true },
]

export default function ItineraryBuilder() {
  const [sections, setSections] = useState(starterSections)
  const [saved, setSaved] = useState(false)

  function addSection() {
    setSections((current) => [...current, { id: Date.now(), title: `Section ${current.length + 1}`, description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity', dateRange: 'Date range: xxx to yyy', budget: 'Budget of this section', open: true }])
    setSaved(false)
  }

  function updateSection(id: number, key: 'title' | 'description' | 'dateRange' | 'budget', value: string) {
    setSections((current) => current.map((section) => section.id === id ? { ...section, [key]: value } : section))
    setSaved(false)
  }

  return (
    <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[980px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20">
        <header className="flex h-[76px] items-center justify-between border-b border-border px-5 sm:px-9">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</Link>
          <Link href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"><CircleUserRound size={22} /></Link>
        </header>
        <div className="border-b border-border px-5 py-5 sm:px-10">
          <Link href="/trips/new" className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft size={16} /> Back to trip details</Link>
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Screen 5 · Build itinerary</p><h1 className="mt-2 font-serif text-3xl sm:text-4xl">Build your itinerary</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Shape your trip into simple sections for travel, stays, and activities.</p></div><button onClick={() => setSaved(true)} className="hidden shrink-0 items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold transition hover:bg-muted sm:inline-flex"><Save size={16} /> {saved ? 'Saved' : 'Save draft'}</button></div>
        </div>
        <section className="space-y-3 px-5 py-5 sm:px-10 sm:py-8">
          {sections.map((section, index) => (
            <article key={section.id} className="rounded-2xl border border-border bg-muted/20 p-4 transition hover:border-accent/60 sm:p-5">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><input aria-label={`Edit ${section.title} title`} value={section.title} onChange={(event) => updateSection(section.id, 'title', event.target.value)} className="w-full max-w-xs bg-transparent font-serif text-lg outline-none placeholder:text-muted-foreground" /><Pencil size={14} className="shrink-0 text-muted-foreground" /></div>{section.open && <textarea aria-label={`${section.title} description`} value={section.description} onChange={(event) => updateSection(section.id, 'description', event.target.value)} rows={2} className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-muted-foreground outline-none" />}</div><button aria-label={`${section.open ? 'Collapse' : 'Expand'} ${section.title}`} onClick={() => setSections((current) => current.map((item) => item.id === section.id ? { ...item, open: !item.open } : item))} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">{section.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button></div>
              {section.open && <div className="mt-4 grid gap-3 sm:grid-cols-2"><input aria-label={`${section.title} date range`} value={section.dateRange} onChange={(event) => updateSection(section.id, 'dateRange', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent" /><input aria-label={`${section.title} budget`} value={section.budget} onChange={(event) => updateSection(section.id, 'budget', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent" /></div>}
              <span className="mt-3 block text-xs text-muted-foreground">{index + 1} of {sections.length} itinerary sections</span>
            </article>
          ))}
          <div className="flex flex-col items-center gap-3 pt-3"><button onClick={addSection} className="inline-flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-5 py-3 font-serif text-base transition hover:bg-accent hover:text-accent-foreground"><Plus size={19} /> Add another Section</button><button onClick={() => setSaved(true)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:hidden"><Save size={15} /> {saved ? 'Draft saved' : 'Save draft'}</button></div>
        </section>
      </div>
    </main>
  )
}
