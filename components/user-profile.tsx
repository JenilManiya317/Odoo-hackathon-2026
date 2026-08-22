'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, CalendarDays, Compass, Edit3, MapPin, UserRound, Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ProfileTrip = {
  title: string
  destination: string
  dates: string
  image: string
  kind: 'Preplanned' | 'Previous'
}

const trips: ProfileTrip[] = [
  { title: 'Japan in Spring', destination: 'Kyoto, Japan', dates: 'Apr 18 — Apr 26, 2026', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=85', kind: 'Preplanned' },
  { title: 'Amalfi Coast Escape', destination: 'Amalfi, Italy', dates: 'Jun 08 — Jun 16, 2026', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85', kind: 'Preplanned' },
  { title: 'Iceland Road Trip', destination: 'Reykjavik, Iceland', dates: 'Sep 02 — Sep 12, 2026', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=85', kind: 'Preplanned' },
  { title: 'Lisbon & Porto', destination: 'Portugal', dates: 'May 12 — May 21, 2024', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85', kind: 'Previous' },
  { title: 'The Greek Islands', destination: 'Cyclades, Greece', dates: 'Aug 04 — Aug 15, 2023', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&w=900&q=85', kind: 'Previous' },
  { title: 'New York City', destination: 'New York, USA', dates: 'Oct 19 — Oct 25, 2022', image: 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=900&q=85', kind: 'Previous' },
]

function ProfileTripCard({ trip }: { trip: ProfileTrip }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-background shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-black/25">
      <div className="relative h-40 overflow-hidden sm:h-44">
        <img src={trip.image} alt={`${trip.destination} travel scene`} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">{trip.kind}</span>
      </div>
      <div className="flex min-h-44 flex-col gap-3 p-4">
        <div><h3 className="font-serif text-xl">{trip.title}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin size={13} className="text-accent" />{trip.destination}</p></div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays size={13} />{trip.dates}</p>
        <Link href="/trips/itinerary" className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">View trip <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></Link>
      </div>
    </article>
  )
}

export function UserProfile() {
  const supabase = createClient()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=85')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setFirstName(user.user_metadata?.first_name || 'Traveler')
        setLastName(user.user_metadata?.last_name || '')
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])
  
  async function handleSave() {
    if (!editing) {
      setEditing(true)
      return
    }
    setSaving(true)
    await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    })
    setEditing(false)
    setSaving(false)
  }
  
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setSaving(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`
    
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
    
    if (uploadError) {
      alert('Error uploading image. Make sure the "avatars" storage bucket exists and is public!')
      setSaving(false)
      return
    }
    
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
    
    setAvatarUrl(publicUrl)
    await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })
    
    setSaving(false)
  }

  const preplanned = trips.filter((trip) => trip.kind === 'Preplanned')
  const previous = trips.filter((trip) => trip.kind === 'Previous')

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[980px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20 sm:min-h-[calc(100vh-3rem)]">
        <header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span><span className="font-serif text-xl font-bold tracking-tight">GlobeTrotter</span></Link><Link href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"><UserRound size={18} /></Link></header>
        
        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>
        ) : (
          <section className="border-b border-border px-5 py-7 sm:px-8 sm:py-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative mx-auto shrink-0 sm:mx-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="grid size-32 place-items-center overflow-hidden rounded-full border-2 border-accent/70 bg-muted sm:size-36 relative">
                  <img src={avatarUrl} alt={`${firstName} profile`} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center text-white">
                    <Camera size={24} />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-card bg-accent" />
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              </div>
              <div className="min-w-0 flex-1 rounded-2xl border border-border bg-background p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Your profile</p>
                    {editing ? (
                      <div className="mt-2 flex gap-2">
                        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="w-full rounded-lg border border-border bg-muted px-3 py-2 font-serif text-xl outline-none focus:ring-2 focus:ring-ring" />
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="w-full rounded-lg border border-border bg-muted px-3 py-2 font-serif text-xl outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    ) : (
                      <h1 className="mt-1 font-serif text-2xl sm:text-3xl">{firstName} {lastName}</h1>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{email}</p>
                  </div>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Edit3 size={15} />}
                    {editing ? 'Save details' : 'Edit profile'}
                  </button>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Collecting stories, good food, and places that make you want to stay a little longer.</p>
              </div>
            </div>
          </section>
        )}
        
        <div className="space-y-10 px-5 py-7 sm:px-8 sm:py-9">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Next up</p><h2 className="mt-1 font-serif text-2xl sm:text-3xl">Preplanned Trips</h2></div>
              <span className="text-sm text-muted-foreground">{preplanned.length} trips</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {preplanned.map((trip) => <ProfileTripCard key={trip.title} trip={trip} />)}
            </div>
          </section>
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Your archive</p><h2 className="mt-1 font-serif text-2xl sm:text-3xl">Previous Trips</h2></div>
              <span className="text-sm text-muted-foreground">{previous.length} trips</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previous.map((trip) => <ProfileTripCard key={trip.title} trip={trip} />)}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
