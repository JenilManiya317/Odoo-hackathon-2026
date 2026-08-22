'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowUpDown, Compass, Filter, Heart, MapPin, Search, Send, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Post = { id: string; authorId: string; name: string; initials: string; location: string; title: string; body: string; tag: string; likes: number; liked: boolean }
type ChatMessage = { id: string; authorName: string; body: string; createdAt: string }
const tones = ['bg-[#496b62]', 'bg-[#6d5748]', 'bg-[#7b5c4f]', 'bg-[#435e6b]']

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [sortPopular, setSortPopular] = useState(true)
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [chatBody, setChatBody] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('Traveler')
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)
      if (user) setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler')
      const [{ data: rows, error: postsError }, { data: likes }] = await Promise.all([
        supabase.from('community_posts').select('id, author_id, author_name, title, body, location, tag, created_at').order('created_at', { ascending: false }),
        user ? supabase.from('community_likes').select('post_id').eq('user_id', user.id) : Promise.resolve({ data: [] }),
      ])
      if (postsError) setError('Community posts are unavailable. Apply migration 010 in Supabase.')
      const likedIds = new Set((likes ?? []).map((like) => like.post_id))
      setPosts((rows ?? []).map((post, index) => ({ id: post.id, authorId: post.author_id, name: post.author_name, initials: post.author_name.slice(0, 2).toUpperCase(), location: post.location, title: post.title, body: post.body, tag: post.tag, likes: 0, liked: likedIds.has(post.id) })))
      const { data: chatRows } = user ? await supabase.from('community_messages').select('id, author_name, body, created_at').order('created_at', { ascending: true }).limit(100) : { data: [] }
      setMessages((chatRows ?? []).map((message) => ({ id: message.id, authorName: message.author_name, body: message.body, createdAt: message.created_at })))
    }
    load()
  }, [])

  const visiblePosts = useMemo(() => posts.filter((post) => filter === 'All' || post.tag === filter).filter((post) => `${post.name} ${post.location} ${post.title} ${post.body}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sortPopular ? b.likes - a.likes : 0), [filter, posts, query, sortPopular])

  async function createPost(event: FormEvent) {
    event.preventDefault()
    if (!userId) return setError('Please log in to share a story.')
    if (!postTitle.trim() || !postBody.trim()) return setError('Add a title and story before publishing.')
    const { data, error: postError } = await createClient().from('community_posts').insert({ author_id: userId, author_name: userName, title: postTitle.trim(), body: postBody.trim(), location: 'My next destination', tag: 'Travel story' }).select('id, author_id, author_name, title, body, location, tag').single()
    if (postError || !data) return setError('We could not publish your story.')
    setPosts((current) => [{ id: data.id, authorId: data.author_id, name: data.author_name, initials: data.author_name.slice(0, 2).toUpperCase(), location: data.location, title: data.title, body: data.body, tag: data.tag, likes: 0, liked: false }, ...current])
    setPostTitle(''); setPostBody(''); setError('')
  }

  async function toggleLike(post: Post) {
    if (!userId) return setError('Please log in to like a story.')
    const supabase = createClient()
    const nextLiked = !post.liked
    const result = nextLiked ? await supabase.from('community_likes').insert({ post_id: post.id, user_id: userId }) : await supabase.from('community_likes').delete().match({ post_id: post.id, user_id: userId })
    if (result.error) return setError('We could not update that like.')
    setPosts((current) => current.map((item) => item.id === post.id ? { ...item, liked: nextLiked, likes: item.likes + (nextLiked ? 1 : -1) } : item))
  }

  async function sendChat(event: FormEvent) {
    event.preventDefault()
    if (!userId) return setError('Please log in to join the chat.')
    if (!chatBody.trim()) return
    const { data, error: chatError } = await createClient().from('community_messages').insert({ user_id: userId, author_name: userName, body: chatBody.trim() }).select('id, author_name, body, created_at').single()
    if (chatError || !data) return setError('We could not send your message.')
    setMessages((current) => [...current, { id: data.id, authorName: data.author_name, body: data.body, createdAt: data.created_at }]); setChatBody('')
  }

  return <main className="min-h-screen bg-background px-3 py-3 text-foreground sm:px-6 sm:py-6"><div className="mx-auto max-w-[1120px] overflow-hidden rounded-[26px] border border-border bg-card shadow-2xl shadow-black/20"><header className="flex h-[72px] items-center justify-between border-b border-border px-5 sm:px-8"><Link href="/" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Compass size={19} /></span><span className="font-serif text-xl font-bold">GlobeTrotter</span></Link><Link href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-border bg-muted/60 text-muted-foreground hover:bg-muted"><UserRound size={18} /></Link></header><div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]"><section className="min-w-0 border-b border-border lg:border-b-0 lg:border-r"><div className="border-b border-border p-5 sm:p-7"><div className="flex flex-col gap-3 sm:flex-row"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"><Search size={16} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><button onClick={() => setFilter(filter === 'All' ? 'Adventure' : 'All')} className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-xs hover:bg-muted"><Filter size={14} />{filter}</button><button onClick={() => setSortPopular(!sortPopular)} className="flex items-center gap-2 rounded-xl border border-border px-3 py-3 text-xs hover:bg-muted"><ArrowUpDown size={14} />{sortPopular ? 'Popular' : 'Recent'}</button></div><div className="mt-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Travel stories</p><h1 className="mt-1 font-serif text-3xl">Community</h1></div></div><div className="space-y-3 p-5 sm:p-7">{error && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}{visiblePosts.map((post, index) => <article key={post.id} className="group flex gap-3 sm:gap-4"><div className={`grid size-10 shrink-0 place-items-center rounded-full ${tones[index % tones.length]} text-xs font-bold text-primary-foreground`}>{post.initials}</div><div className="min-w-0 flex-1 rounded-2xl border border-border bg-muted/25 p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold">{post.name}</h2><p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} className="text-accent" />{post.location}</p></div><span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase text-accent">{post.tag}</span></div><h3 className="mt-4 font-serif text-xl">{post.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{post.body}</p><button onClick={() => toggleLike(post)} className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-accent"><Heart size={15} fill={post.liked ? 'currentColor' : 'none'} className={post.liked ? 'text-accent' : ''} />{post.likes} likes</button></div></article>)}{!visiblePosts.length && <p className="py-12 text-center text-sm text-muted-foreground">No stories match your search.</p>}</div></section><aside className="space-y-5 p-5 sm:p-8"><form onSubmit={createPost} className="rounded-2xl border border-border bg-muted/30 p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Share a story</p><input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} placeholder="Story title" className="mt-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none" /><textarea value={postBody} onChange={(event) => setPostBody(event.target.value)} placeholder="What did you discover?" rows={4} className="mt-2 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none" /><button className="mt-3 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground">Publish story</button></form><section className="rounded-2xl border border-border bg-muted/30 p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Community chat</p><div className="mt-4 max-h-64 space-y-3 overflow-y-auto">{messages.map((message) => <div key={message.id} className="rounded-xl bg-background p-3"><p className="text-xs font-semibold">{message.authorName}</p><p className="mt-1 text-sm text-muted-foreground">{message.body}</p></div>)}{!messages.length && <p className="text-sm text-muted-foreground">Start the conversation.</p>}</div><form onSubmit={sendChat} className="mt-4 flex gap-2"><input value={chatBody} onChange={(event) => setChatBody(event.target.value)} maxLength={500} placeholder="Write a message" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none" /><button aria-label="Send chat message" className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"><Send size={16} /></button></form></section></aside></div></div></main>
}
