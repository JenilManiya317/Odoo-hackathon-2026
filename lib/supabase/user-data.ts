'use client'

import { createClient } from '@/lib/supabase/client'

export type UserPreferences = {
  travel_styles: string[]
  budget_tier: 'Budget' | 'Moderate' | 'Luxury' | 'Ultra-Luxury'
  preferred_accommodation: 'Hostel' | 'Airbnb' | 'Hotel' | 'Resort' | 'Villa' | 'Riad'
  preferred_pace: 'Relaxed' | 'Balanced' | 'Fast-Paced'
  favorite_regions: string[]
  traveler_type: 'Solo Explorer' | 'Couple Adventurer' | 'Family Traveler' | 'Group Seeker'
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  travel_styles: ['Cultural', 'Adventure', 'Coastal'],
  budget_tier: 'Moderate',
  preferred_accommodation: 'Hotel',
  preferred_pace: 'Balanced',
  favorite_regions: ['Europe', 'Asia', 'South America'],
  traveler_type: 'Solo Explorer',
}

const LOCAL_PREF_KEY = 'globetrotter_user_preferences'
const LOCAL_FAV_KEY = 'globetrotter_user_favorites'
const LOCAL_TRIP_KEY = 'globetrotter_user_trips'

export async function getUserPreferences(): Promise<UserPreferences> {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('travel_styles, budget_tier, preferred_accommodation, preferred_pace, favorite_regions, traveler_type')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        return {
          travel_styles: data.travel_styles || DEFAULT_USER_PREFERENCES.travel_styles,
          budget_tier: data.budget_tier || DEFAULT_USER_PREFERENCES.budget_tier,
          preferred_accommodation: data.preferred_accommodation || DEFAULT_USER_PREFERENCES.preferred_accommodation,
          preferred_pace: data.preferred_pace || DEFAULT_USER_PREFERENCES.preferred_pace,
          favorite_regions: data.favorite_regions || DEFAULT_USER_PREFERENCES.favorite_regions,
          traveler_type: data.traveler_type || DEFAULT_USER_PREFERENCES.traveler_type,
        }
      }
    }
  } catch (err) {
    console.warn('Could not load preferences from Supabase, checking local storage:', err)
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem(LOCAL_PREF_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // ignore
  }

  return DEFAULT_USER_PREFERENCES
}

export async function saveUserPreferences(prefs: UserPreferences): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_PREF_KEY, JSON.stringify(prefs))
    } catch {
      // ignore
    }
  }

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          travel_styles: prefs.travel_styles,
          budget_tier: prefs.budget_tier,
          preferred_accommodation: prefs.preferred_accommodation,
          preferred_pace: prefs.preferred_pace,
          favorite_regions: prefs.favorite_regions,
          traveler_type: prefs.traveler_type,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) {
        console.error('Failed to save to Supabase:', error)
        return { success: false, error: error.message }
      }
    }
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function getUserFavorites(): Promise<string[]> {
  if (typeof window === 'undefined') return []

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id, item_name')
        .eq('user_id', user.id)

      if (data && !error) {
        return data.map((d) => d.item_name || d.item_id)
      }
    }
  } catch (err) {
    console.warn('Could not load favorites from Supabase:', err)
  }

  try {
    const cached = localStorage.getItem(LOCAL_FAV_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // ignore
  }

  return []
}

export async function toggleUserFavorite(
  itemName: string,
  itemType: 'destination' | 'activity' | 'trip' = 'destination',
  itemData?: Record<string, unknown>
): Promise<{ saved: boolean; list: string[] }> {
  let list: string[] = []
  try {
    list = await getUserFavorites()
  } catch {
    list = []
  }

  const isSaved = list.includes(itemName)
  const updatedList = isSaved ? list.filter((i) => i !== itemName) : [...list, itemName]

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(updatedList))
    } catch {
      // ignore
    }
  }

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      if (isSaved) {
        await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: user.id, item_type: itemType, item_name: itemName })
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            item_type: itemType,
            item_id: itemName.toLowerCase().replace(/\s+/g, '-'),
            item_name: itemName,
            item_data: itemData || {},
          })
      }
    }
  } catch (err) {
    console.warn('Could not sync favorite to Supabase:', err)
  }

  return { saved: !isSaved, list: updatedList }
}

export type UserTripItem = { id: string; name: string; destination: string; image?: string; start_date?: string; end_date?: string; is_public?: boolean; created_at?: string }

export function getLocalTrips(): UserTripItem[] {
  if (typeof window === 'undefined') return []
  try {
    const cached = localStorage.getItem(LOCAL_TRIP_KEY)
    if (cached) return JSON.parse(cached)
  } catch {
    // ignore
  }
  return []
}

export function saveLocalTrip(trip: UserTripItem): void {
  if (typeof window === 'undefined') return
  try {
    const current = getLocalTrips()
    const updated = [trip, ...current.filter((t) => t.id !== trip.id)]
    localStorage.setItem(LOCAL_TRIP_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export async function getUserTripsFromSupabase(): Promise<UserTripItem[]> {
  const localTrips = getLocalTrips()
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('trips')
        .select('id, name, description, start_date, end_date, is_public, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data && !error) {
        const remoteTrips: UserTripItem[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          destination: t.description?.replace(/^Trip to /, '') || t.name,
          image: localTrips.find((localTrip) => localTrip.id === t.id)?.image,
          start_date: t.start_date,
          end_date: t.end_date,
          is_public: t.is_public,
          created_at: t.created_at,
        }))
        const mergedMap = new Map<string, UserTripItem>()
        remoteTrips.forEach((t) => mergedMap.set(t.id, t))
        localTrips.forEach((t) => { if (!mergedMap.has(t.id)) mergedMap.set(t.id, t) })
        return Array.from(mergedMap.values())
      }
    }
  } catch (err) {
    console.warn('Could not fetch user trips from Supabase:', err)
  }

  return localTrips
}
