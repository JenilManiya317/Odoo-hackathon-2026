'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { Compass, Eye, EyeOff, Loader2, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', firstName: '', lastName: '', email: '', phone: '', city: '', country: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: form.username, password: form.password })
      if (error) setMessage('Invalid email or password.')
      else window.location.href = '/'
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone, city: form.city, country: form.country },
        },
      })
      setMessage(error ? 'We could not create your account. Check your details and try again.' : 'Registration received. Check your email to confirm your account.')
    }
    setLoading(false)
  }

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <label className="flex flex-col gap-2 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      <input required={mode === 'login' || ['firstName', 'lastName', 'email'].includes(key)} type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder={label} className="h-11 rounded-xl border border-border bg-background/70 px-3.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
    </label>
  )

  const passwordField = (
    <label className="flex flex-col gap-2 text-xs font-medium text-muted-foreground">
      <span>Password</span>
      <span className="relative">
        <input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="Password" className="h-11 w-full rounded-xl border border-border bg-background/70 px-3.5 pr-11 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
        <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  )

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2 text-sm font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span> GlobeTrotter</Link>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="hidden rounded-3xl border border-border bg-card p-10 lg:flex lg:flex-col lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your world awaits</p><h1 className="mt-5 max-w-md font-serif text-5xl leading-tight">Every journey begins with a hello.</h1><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Create a personal travel space for the places you have been and the places still calling your name.</p></div><div className="flex items-center gap-3 text-sm text-muted-foreground"><MapPin size={17} className="text-accent" /> Discover more, remember everything.</div></section>
          <section className="rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-black/15 sm:p-8">
            <div className="mb-7 flex rounded-xl bg-muted p-1"><button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${mode === 'login' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>Log in</button><button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${mode === 'register' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>Register</button></div>
            <div className="mb-6"><h2 className="font-serif text-3xl">{mode === 'login' ? 'Welcome back.' : 'Join the journey.'}</h2><p className="mt-2 text-sm text-muted-foreground">{mode === 'login' ? 'Pick up where your next adventure begins.' : 'Tell us a little about yourself.'}</p></div>
            <form onSubmit={submit} className="space-y-4">
              {mode === 'login' ? <>{field('Email address', 'username', 'email')}{passwordField}</> : <><div className="grid gap-4 sm:grid-cols-2">{field('First name', 'firstName')}{field('Last name', 'lastName')}{field('Email address', 'email', 'email')}{field('Phone number', 'phone', 'tel')}{field('City', 'city')}{field('Country', 'country')}</div>{passwordField}</>}
              {message && <p role="status" className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">{message}</p>}
              <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{mode === 'login' ? 'Log in' : 'Create account'}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
