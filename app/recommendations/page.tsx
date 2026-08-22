import { RecommendationsView } from '@/components/recommendations-view'

export const metadata = {
  title: 'AI Travel Recommendations | GlobeTrotter',
  description: 'Personalized destination and activity recommendations powered by your Supabase travel preferences and history.',
}

export default function RecommendationsPage() {
  return <RecommendationsView />
}
