'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, Home, UserRound } from 'lucide-react'

export function MobileNavbar() {
  const pathname = usePathname()

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/recommendations', icon: Compass },
    { name: 'Trips', href: '/trips', icon: Heart },
    { name: 'Profile', href: '/profile', icon: UserRound },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border/50 bg-background/50 backdrop-blur-2xl md:hidden">
      <div className="flex h-16 items-center justify-around px-2 pb-safe">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
