import { TripListing } from '@/components/trip-listing'

export const metadata = {
  title: 'My Trips | GlobeTrotter',
  description: 'Browse your ongoing, upcoming, and completed GlobeTrotter trips.',
}

export default function TripsPage() {
  return <TripListing />
}
