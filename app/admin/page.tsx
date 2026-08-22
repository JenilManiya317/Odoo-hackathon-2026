import { AdminPanel } from '@/components/admin-panel'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Admin Panel — GlobeTrotter',
  description: 'GlobeTrotter platform insights and traveler management.',
}

export default function AdminPage() {
  return <AdminGate />
}

async function AdminGate() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <main className="grid min-h-screen place-items-center bg-background text-foreground"><p>Please log in to access the admin dashboard.</p></main>
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) return <main className="grid min-h-screen place-items-center bg-background text-foreground"><p>You do not have permission to access this dashboard.</p></main>
  return <AdminPanel />
}
