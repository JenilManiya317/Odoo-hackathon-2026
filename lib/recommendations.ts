import { UserPreferences, DEFAULT_USER_PREFERENCES } from './supabase/user-data'

export type DestinationRecommendation = {
  id: string
  name: string
  region: string
  country: string
  type: string
  styles: string[]
  image: string
  avgDailyCost: number
  budgetTier: 'Budget' | 'Moderate' | 'Luxury' | 'Ultra-Luxury'
  recommendedAccommodation: 'Hostel' | 'Airbnb' | 'Hotel' | 'Resort' | 'Villa' | 'Riad'
  matchScore: number // 0-100%
  matchReasons: string[]
  highlightActivity: string
  bestSeason: string
  suggestedDurationDays: number
  description: string
  tags: string[]
}

export type ActivityRecommendation = {
  id: string
  title: string
  city: string
  country: string
  category: string
  price: number
  priceFormatted: string
  durationHours: number
  image: string
  description: string
  matchScore: number
  matchReason: string
}

export const DESTINATIONS_CATALOG: Omit<DestinationRecommendation, 'matchScore' | 'matchReasons'>[] = [
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    region: 'Asia',
    country: 'Japan',
    type: 'Cultural',
    styles: ['Cultural', 'City', 'Food & Dining', 'Relaxation'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 140,
    budgetTier: 'Moderate',
    recommendedAccommodation: 'Hotel',
    highlightActivity: 'Zen garden meditation & authentic tea ceremony in Gion',
    bestSeason: 'Spring / Autumn',
    suggestedDurationDays: 7,
    description: 'Ancient temples, peaceful bamboo groves, and centuries-old culinary traditions in Japan’s cultural heart.',
    tags: ['Temples', 'Culinary', 'History', 'Scenic Walks'],
  },
  {
    id: 'amalfi-italy',
    name: 'Amalfi Coast',
    region: 'Europe',
    country: 'Italy',
    type: 'Coastal',
    styles: ['Coastal', 'Relaxation', 'Food & Dining', 'Luxury'],
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 220,
    budgetTier: 'Luxury',
    recommendedAccommodation: 'Villa',
    highlightActivity: 'Private sunset sailing cruise along Positano cliffs',
    bestSeason: 'May — September',
    suggestedDurationDays: 6,
    description: 'Dramatic cliffs dropping into sapphire waters, pastel fishing villages, and cliffside lemon groves.',
    tags: ['Beaches', 'Fine Dining', 'Scenic Drives', 'Romantic'],
  },
  {
    id: 'patagonia-chile',
    name: 'Patagonia',
    region: 'South America',
    country: 'Chile',
    type: 'Adventure',
    styles: ['Adventure', 'Nature', 'Photography'],
    image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 160,
    budgetTier: 'Moderate',
    recommendedAccommodation: 'Airbnb',
    highlightActivity: 'Glacier trekking in Torres del Paine National Park',
    bestSeason: 'November — March',
    suggestedDurationDays: 9,
    description: 'Untamed wilderness, towering granite horns, cobalt glacial lakes, and windswept pampas.',
    tags: ['Trekking', 'Glaciers', 'Wildlife', 'Rugged Outdoors'],
  },
  {
    id: 'marrakech-morocco',
    name: 'Marrakech',
    region: 'Africa',
    country: 'Morocco',
    type: 'Cultural',
    styles: ['Cultural', 'City', 'Food & Dining', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 95,
    budgetTier: 'Budget',
    recommendedAccommodation: 'Riad',
    highlightActivity: 'Spice market exploration & traditional courtyard hammam',
    bestSeason: 'October — April',
    suggestedDurationDays: 5,
    description: 'Vibrant souks bursting with colors, intricate riad architecture, aromatic tagines, and Atlas mountain views.',
    tags: ['Souks', 'Riads', 'Architecture', 'Exotic Vibes'],
  },
  {
    id: 'copenhagen-denmark',
    name: 'Copenhagen',
    region: 'Europe',
    country: 'Denmark',
    type: 'City',
    styles: ['City', 'Cultural', 'Food & Dining', 'Design'],
    image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 190,
    budgetTier: 'Luxury',
    recommendedAccommodation: 'Hotel',
    highlightActivity: 'Canal tour & Michelin-starred Nordic culinary tasting',
    bestSeason: 'June — August',
    suggestedDurationDays: 4,
    description: 'A cozy bicycle capital celebrated for world-class design, waterfront cafes, and joyful hygge living.',
    tags: ['Biking', 'Nordic Design', 'Modern Art', 'Harbor Walks'],
  },
  {
    id: 'bali-indonesia',
    name: 'Bali',
    region: 'Asia',
    country: 'Indonesia',
    type: 'Coastal',
    styles: ['Coastal', 'Relaxation', 'Adventure', 'Nature'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 75,
    budgetTier: 'Budget',
    recommendedAccommodation: 'Villa',
    highlightActivity: 'Sunrise volcano trek over Mt. Batur with hot springs soak',
    bestSeason: 'April — October',
    suggestedDurationDays: 8,
    description: 'Lush terraced rice paddies, spiritual oceanfront temples, surf breaks, and tranquil wellness retreats.',
    tags: ['Tropical', 'Surfing', 'Yoga', 'Waterfalls'],
  },
  {
    id: 'reykjavik-iceland',
    name: 'Reykjavík & Highlands',
    region: 'Europe',
    country: 'Iceland',
    type: 'Adventure',
    styles: ['Adventure', 'Nature', 'Relaxation'],
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 210,
    budgetTier: 'Luxury',
    recommendedAccommodation: 'Airbnb',
    highlightActivity: 'Geothermal Blue Lagoon dip & Northern Lights chase',
    bestSeason: 'September — March (Aurora) / June — August (Midnight Sun)',
    suggestedDurationDays: 7,
    description: 'Land of fire and ice featuring steaming geysers, thundering waterfalls, volcanic fields, and celestial lights.',
    tags: ['Aurora', 'Geothermal', 'Road Trips', 'Volcanoes'],
  },
  {
    id: 'lisbon-portugal',
    name: 'Lisbon & Sintra',
    region: 'Europe',
    country: 'Portugal',
    type: 'City',
    styles: ['City', 'Cultural', 'Coastal', 'Food & Dining'],
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 110,
    budgetTier: 'Moderate',
    recommendedAccommodation: 'Airbnb',
    highlightActivity: 'Historic Tram 28 ride & fairytale Pena Palace day trip',
    bestSeason: 'March — June / September — November',
    suggestedDurationDays: 6,
    description: 'Sun-drenched hills, tiled alleyways, melancholic fado music, and custard tarts by the sparkling Atlantic.',
    tags: ['Cobblestones', 'Seafood', 'Miradouros', 'Historic'],
  },
  {
    id: 'phuket-thailand',
    name: 'Phuket & Phi Phi',
    region: 'Asia',
    country: 'Thailand',
    type: 'Coastal',
    styles: ['Coastal', 'Adventure', 'Food & Dining', 'Relaxation'],
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 65,
    budgetTier: 'Budget',
    recommendedAccommodation: 'Resort',
    highlightActivity: 'Longtail boat excursion around emerald karst lagoons',
    bestSeason: 'November — April',
    suggestedDurationDays: 6,
    description: 'White sandy coves, turquoise waters, limestone karst towers, and bustling night food markets.',
    tags: ['Islands', 'Snorkeling', 'Night Markets', 'Budget Friendly'],
  },
  {
    id: 'interlaken-switzerland',
    name: 'Interlaken & Jungfrau',
    region: 'Europe',
    country: 'Switzerland',
    type: 'Adventure',
    styles: ['Adventure', 'Nature', 'Relaxation'],
    image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=900&q=80',
    avgDailyCost: 240,
    budgetTier: 'Luxury',
    recommendedAccommodation: 'Hotel',
    highlightActivity: 'Tandem paragliding high above Lake Brienz and snowy peaks',
    bestSeason: 'December — March (Ski) / June — September (Hike)',
    suggestedDurationDays: 5,
    description: 'Alpine paradise nestled between two crystal lakes with panoramic views of the Eiger, Mönch, and Jungfrau.',
    tags: ['Alps', 'Paragliding', 'Scenic Trains', 'Snow Peaks'],
  },
]

export const ACTIVITIES_CATALOG: Omit<ActivityRecommendation, 'matchScore' | 'matchReason'>[] = [
  {
    id: 'act-1',
    title: 'Paragliding over the Alpine Valley',
    city: 'Interlaken',
    country: 'Switzerland',
    category: 'Adventure',
    price: 145,
    priceFormatted: '$145',
    durationHours: 3,
    image: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=900&q=85',
    description: 'Soar above alpine lakes and snow-capped peaks with a certified pilot and capture 4K footage of the Alps.',
  },
  {
    id: 'act-2',
    title: 'Authentic Kyoto Tea Master Ceremony',
    city: 'Kyoto',
    country: 'Japan',
    category: 'Culture',
    price: 52,
    priceFormatted: '$52',
    durationHours: 2,
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=85',
    description: 'Learn the ancient rituals and quiet philosophy of matcha in a private 200-year-old preserved tea garden.',
  },
  {
    id: 'act-3',
    title: 'Sunset Sailing & Mezze Cruise',
    city: 'Santorini',
    country: 'Greece',
    category: 'Relaxation',
    price: 89,
    priceFormatted: '$89',
    durationHours: 4,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85',
    description: 'Drift past volcanic caldera cliffs with local wine, Greek appetizers, and a swim stop at natural hot springs.',
  },
  {
    id: 'act-4',
    title: 'Old Town Secret Food & Wine Discovery',
    city: 'Lisbon',
    country: 'Portugal',
    category: 'Food & drink',
    price: 38,
    priceFormatted: '$38',
    durationHours: 3.5,
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85',
    description: 'Taste bifana, aged cheeses, Port wine, and fresh pastel de nata across historic hidden taverns with a culinary guide.',
  },
  {
    id: 'act-5',
    title: 'Torres del Paine Glacier Ice Trek',
    city: 'Patagonia',
    country: 'Chile',
    category: 'Adventure',
    price: 130,
    priceFormatted: '$130',
    durationHours: 6,
    image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85',
    description: 'Strap on crampons to explore deep blue crevasses, ice caves, and glacial lagoons with an expert mountaineer.',
  },
  {
    id: 'act-6',
    title: 'Marrakech Medina Spice & Artisan Workshop',
    city: 'Marrakech',
    country: 'Morocco',
    category: 'Culture',
    price: 45,
    priceFormatted: '$45',
    durationHours: 3,
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=900&q=85',
    description: 'Learn Moroccan tilecraft or leatherwork directly from master artisans in the secluded workshops of the old souk.',
  },
  {
    id: 'act-7',
    title: 'Midnight Louvre & Masterpieces Private Walk',
    city: 'Paris',
    country: 'France',
    category: 'Culture',
    price: 72,
    priceFormatted: '$72',
    durationHours: 2.5,
    image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=85',
    description: 'Experience the world’s most iconic art with zero daytime crowds under the glowing pyramid lighting.',
  },
  {
    id: 'act-8',
    title: 'Phi Phi Coral Reef Snorkel Safari',
    city: 'Phuket',
    country: 'Thailand',
    category: 'Adventure',
    price: 65,
    priceFormatted: '$65',
    durationHours: 5,
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=900&q=85',
    description: 'Glide through secluded turquoise bays with sea turtles, harmless reef sharks, and vibrant coral formations.',
  },
]

/**
 * Calculates a personalized match score (60 - 99%) and reasons for a destination based on:
 * - User travel styles matching destination styles
 * - User budget tier matching destination cost
 * - Preferred accommodation matching
 * - Region preferences
 * - User's previous trip history in Supabase
 */
export function calculateDestinationScore(
  dest: Omit<DestinationRecommendation, 'matchScore' | 'matchReasons'>,
  prefs: UserPreferences = DEFAULT_USER_PREFERENCES,
  pastTripDestinations: string[] = [],
  savedFavorites: string[] = []
): { score: number; reasons: string[] } {
  let score = 55
  const reasons: string[] = []

  // 1. Style match (+20 max)
  const sharedStyles = dest.styles.filter((s) => prefs.travel_styles.some((userStyle) => userStyle.toLowerCase() === s.toLowerCase()))
  if (sharedStyles.length > 0) {
    const styleBoost = Math.min(22, sharedStyles.length * 8)
    score += styleBoost
    reasons.push(`Matches your ${sharedStyles.slice(0, 2).join(' & ')} vibe`)
  }

  // 2. Budget affinity (+12 max)
  const budgetMap: Record<string, number> = { Budget: 80, Moderate: 160, Luxury: 250, 'Ultra-Luxury': 400 }
  const userBudgetLevel = budgetMap[prefs.budget_tier] || 150
  const costDiff = Math.abs(dest.avgDailyCost - userBudgetLevel)
  if (costDiff < 40) {
    score += 12
    reasons.push(`Optimal for your ${prefs.budget_tier} budget tier (~$${dest.avgDailyCost}/day)`)
  } else if (costDiff < 80) {
    score += 6
  }

  // 3. Accommodation match (+8 max)
  if (dest.recommendedAccommodation.toLowerCase() === prefs.preferred_accommodation.toLowerCase()) {
    score += 8
    reasons.push(`Ideal for ${prefs.preferred_accommodation} stays`)
  }

  // 4. Region match (+6 max)
  if (prefs.favorite_regions.some((r) => r.toLowerCase() === dest.region.toLowerCase())) {
    score += 6
    reasons.push(`Top pick in your favorite region (${dest.region})`)
  }

  // 5. Collaborative affinity based on past trips in Supabase (+8 max)
  const visitedLower = pastTripDestinations.map((d) => d.toLowerCase())
  if (visitedLower.some((v) => v.includes('kyoto') || v.includes('japan')) && (dest.name === 'Lisbon & Sintra' || dest.name === 'Copenhagen')) {
    score += 8
    reasons.push('Popular next journey for travelers who enjoyed Japan')
  } else if (visitedLower.some((v) => v.includes('amalfi') || v.includes('greek')) && (dest.name === 'Bali' || dest.name === 'Phuket & Phi Phi')) {
    score += 8
    reasons.push('High satisfaction score among coastal island explorers')
  }

  // 6. Saved item boost
  if (savedFavorites.includes(dest.name)) {
    score += 5
    reasons.push('Saved in your GlobeTrotter bookmarks')
  }

  // Cap between 65 and 99
  const finalScore = Math.min(99, Math.max(68, Math.round(score)))
  if (reasons.length === 0) {
    reasons.push(`Curated for your ${prefs.traveler_type} journey profile`)
  }

  return { score: finalScore, reasons }
}

/**
 * Returns sorted recommendations for the user.
 */
export function getRecommendedDestinations(
  prefs: UserPreferences = DEFAULT_USER_PREFERENCES,
  pastTripDestinations: string[] = [],
  savedFavorites: string[] = []
): DestinationRecommendation[] {
  return DESTINATIONS_CATALOG.map((dest) => {
    const { score, reasons } = calculateDestinationScore(dest, prefs, pastTripDestinations, savedFavorites)
    return {
      ...dest,
      matchScore: score,
      matchReasons: reasons,
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Returns personalized activities scored for user preferences.
 */
export function getRecommendedActivities(
  prefs: UserPreferences = DEFAULT_USER_PREFERENCES,
  targetCity?: string
): ActivityRecommendation[] {
  return ACTIVITIES_CATALOG.filter((act) => !targetCity || act.city.toLowerCase() === targetCity.toLowerCase()).map((act) => {
    let score = 65
    let reason = 'Curated experience'

    const matchesStyle = prefs.travel_styles.some((s) => s.toLowerCase().includes(act.category.toLowerCase()) || act.category.toLowerCase().includes(s.toLowerCase()))
    if (matchesStyle) {
      score += 20
      reason = `Perfect for ${act.category} lovers`
    }

    if (prefs.budget_tier === 'Budget' && act.price <= 50) {
      score += 12
      reason = 'High-value budget friendly choice'
    } else if (prefs.budget_tier === 'Luxury' && act.price >= 90) {
      score += 12
      reason = 'Premium private experience'
    }

    return {
      ...act,
      matchScore: Math.min(99, Math.max(65, score)),
      matchReason: reason,
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}
