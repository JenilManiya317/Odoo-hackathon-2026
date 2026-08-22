import { Suspense } from 'react'
import ItineraryView from '@/components/itinerary-view'

export default function ItineraryPage() {
  return <Suspense fallback={<main className="min-h-screen bg-background" />}><ItineraryView /></Suspense>
}
