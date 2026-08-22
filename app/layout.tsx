import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GlobeTrotter — Go somewhere wonderful',
  description: 'Discover thoughtful destinations and plan your next unforgettable trip with GlobeTrotter.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1d2930',
  width: 'device-width',
  initialScale: 1,
}

import { MobileNavbar } from '@/components/mobile-navbar'
import { ChatbotWidget } from '@/components/chatbot'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased pb-16 md:pb-0">
        {children}
        <MobileNavbar />
        <ChatbotWidget />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
