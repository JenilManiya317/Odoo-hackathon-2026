-- Community stories, likes, and authenticated chat.
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  title text not null,
  body text not null,
  location text not null,
  tag text not null,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.community_likes (
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  primary key (post_id, user_id)
);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamp with time zone default now() not null
);

alter table public.community_posts enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_messages enable row level security;

drop policy if exists "Public can view community posts" on public.community_posts;
create policy "Public can view community posts" on public.community_posts for select using (true);
drop policy if exists "Users can create community posts" on public.community_posts;
create policy "Users can create community posts" on public.community_posts for insert with check (auth.uid() = author_id);
drop policy if exists "Authors can update community posts" on public.community_posts;
create policy "Authors can update community posts" on public.community_posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
drop policy if exists "Authors can delete community posts" on public.community_posts;
create policy "Authors can delete community posts" on public.community_posts for delete using (auth.uid() = author_id);

drop policy if exists "Users can view community likes" on public.community_likes;
create policy "Users can view community likes" on public.community_likes for select using (true);
drop policy if exists "Users can like community posts" on public.community_likes;
create policy "Users can like community posts" on public.community_likes for insert with check (auth.uid() = user_id);
drop policy if exists "Users can remove community likes" on public.community_likes;
create policy "Users can remove community likes" on public.community_likes for delete using (auth.uid() = user_id);

drop policy if exists "Authenticated users can view community chat" on public.community_messages;
create policy "Authenticated users can view community chat" on public.community_messages for select using (auth.uid() is not null);
drop policy if exists "Users can send community chat messages" on public.community_messages;
create policy "Users can send community chat messages" on public.community_messages for insert with check (auth.uid() = user_id);

create index if not exists community_posts_created_at_idx on public.community_posts(created_at desc);
create index if not exists community_messages_created_at_idx on public.community_messages(created_at desc);
