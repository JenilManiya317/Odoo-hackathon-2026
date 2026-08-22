'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Map, User } from 'lucide-react'

export function MobileNavbar() {
  const pathname = usePathname()
  
  // Hide the navbar on the auth page to avoid distractions during login/signup
  if (pathname === '/auth') return null

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-card/80 px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      <ul className="flex items-center justify-between">
        <li>
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 p-2 ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Compass size={24} />
            <span className="text-[10px] font-medium">Discover</span>
          </Link>
        </li>
        <li>
          <Link
            href="/trips"
            className={`flex flex-col items-center gap-1 p-2 ${
              pathname?.startsWith('/trips') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map size={24} />
            <span className="text-[10px] font-medium">My Trips</span>
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 p-2 ${
              pathname?.startsWith('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User size={24} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
