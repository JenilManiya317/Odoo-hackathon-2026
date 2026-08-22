import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')?.trim()
  const country = request.nextUrl.searchParams.get('country')?.trim()

  if (!name) return new NextResponse('Destination name is required', { status: 400 })

  const searchTerm = [name, country].filter(Boolean).join(' ')
  const apiUrl = new URL('https://commons.wikimedia.org/w/api.php')
  apiUrl.searchParams.set('action', 'query')
  apiUrl.searchParams.set('generator', 'search')
  apiUrl.searchParams.set('gsrsearch', searchTerm)
  apiUrl.searchParams.set('gsrnamespace', '6')
  apiUrl.searchParams.set('gsrlimit', '1')
  apiUrl.searchParams.set('prop', 'imageinfo')
  apiUrl.searchParams.set('iiprop', 'url')
  apiUrl.searchParams.set('iiurlwidth', '900')
  apiUrl.searchParams.set('format', 'json')

  try {
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'GlobeTrotter/1.0 destination image lookup' },
      next: { revalidate: 86400 },
    })
    if (!response.ok) return new NextResponse('Image lookup failed', { status: 502 })

    const data = await response.json()
    const page = Object.values(data.query?.pages ?? {})[0] as {
      imageinfo?: Array<{ thumburl?: string; url?: string }>
    } | undefined
    const imageUrl = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url

    if (!imageUrl) return new NextResponse('No destination image found', { status: 404 })
    return NextResponse.redirect(imageUrl, 307)
  } catch {
    return new NextResponse('Image lookup failed', { status: 502 })
  }
}
