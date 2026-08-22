import { NextRequest, NextResponse } from 'next/server'

const CHATBOT_BACKEND_URL = process.env.CHATBOT_BACKEND_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, session_id } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string.' },
        { status: 400 }
      )
    }

    const backendRes = await fetch(`${CHATBOT_BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim(), session_id }),
      // 10 second timeout
      signal: AbortSignal.timeout(10_000),
    })

    if (!backendRes.ok) {
      const errorText = await backendRes.text()
      console.error('[chatbot/route] Backend error:', backendRes.status, errorText)
      return NextResponse.json(
        { error: 'Chatbot backend returned an error. Please try again.' },
        { status: 502 }
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const isTimeout =
      err instanceof Error &&
      (err.name === 'TimeoutError' || err.name === 'AbortError')

    if (isTimeout) {
      return NextResponse.json(
        {
          reply:
            "I'm taking a bit longer to think... 🤔 Please try again in a moment!",
          confidence: 0,
          model: 'fallback',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    console.error('[chatbot/route] Could not reach backend:', err)
    return NextResponse.json(
      {
        reply: 'I am having trouble connecting right now. Please try your travel question again in a moment.',
        confidence: 0,
        model: 'connection-fallback',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

export async function GET() {
  try {
    const res = await fetch(`${CHATBOT_BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(3_000),
    })
    const data = await res.json()
    return NextResponse.json({ status: 'online', backend: data })
  } catch {
    return NextResponse.json({ status: 'offline' }, { status: 503 })
  }
}
