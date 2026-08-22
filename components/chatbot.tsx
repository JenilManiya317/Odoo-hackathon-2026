'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
  Globe,
  Plane,
  Map,
  Compass
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  confidence?: number
}

const QUICK_SUGGESTIONS = [
  { label: '🏖️ Beach destinations', text: 'Best beach destinations to visit?' },
  { label: '💰 Budget travel tips', text: 'How do I travel on a budget?' },
  { label: '🎒 Packing essentials', text: 'What should I pack for travel?' },
  { label: '🗺️ Plan a trip', text: 'How do I plan a trip from scratch?' },
  { label: '🍜 Food & culture', text: 'Tips for experiencing local food' },
  { label: '🛂 Visa help', text: 'How do visa requirements work?' },
]

const GREETING_MESSAGES = [
  "Hi! I'm **Trotter AI** 🌍 — your personal travel assistant powered by NLP. Ask me about destinations, itineraries, budgets, visas, packing, and more!",
  "Welcome! I'm **Trotter AI** ✈️ — ready to help you explore the world. Where are you dreaming of going?",
  "Hey there, explorer! I'm **Trotter AI** 🗺️ — your AI guide to the world. Ask me anything about travel!",
]

// ── Floating Chat Widget ─────────────────────────────────────────────────────
export function ChatbotWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize with greeting
  useEffect(() => {
    const greeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)]
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      },
    ])
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setUnreadCount(0)
    }
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setInput('')
    setShowSuggestions(false)

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I couldn't process that. Please try again!",
        timestamp: new Date(),
        confidence: data.confidence,
      }
      setMessages(prev => [...prev, botMsg])

      if (!open) setUnreadCount(prev => prev + 1)
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Connection issue. Make sure the chatbot backend is running!',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [loading, open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    const greeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)]
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      },
    ])
    setShowSuggestions(true)
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Render bold markdown **text**
  const renderContent = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    )
  }

  if (pathname === '/auth') return null

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────────────────────── */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setOpen(prev => !prev)}
        className="chatbot-fab"
        aria-label="Toggle travel assistant"
      >
        <span className="chatbot-fab-glow" />
        {open ? (
          <ChevronDown size={22} strokeWidth={2.5} />
        ) : (
          <MessageCircle size={22} strokeWidth={2} fill="currentColor" />
        )}
        {!open && unreadCount > 0 && (
          <span className="chatbot-badge">{unreadCount}</span>
        )}
      </button>

      {/* ── Chat Panel ───────────────────────────────────────────────────────── */}
      <div className={`chatbot-panel ${open ? 'chatbot-panel--open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <Globe size={18} className="chatbot-globe-icon" />
          </div>
          <div className="chatbot-header-info">
            <div className="chatbot-header-name">
              Trotter AI
              <span className="chatbot-online-dot" />
            </div>
            <div className="chatbot-header-sub">
              <Sparkles size={10} />
              NLP Travel Assistant
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button
              onClick={clearChat}
              title="New conversation"
              className="chatbot-icon-btn"
              id="chatbot-clear-btn"
            >
              <Plane size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="chatbot-icon-btn"
              id="chatbot-close-btn"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`chatbot-message chatbot-message--${msg.role}`}
            >
              {msg.role === 'assistant' && (
                <div className="chatbot-avatar">
                  <Bot size={13} />
                </div>
              )}
              <div className="chatbot-bubble">
                <p className="chatbot-bubble-text">{renderContent(msg.content)}</p>
                <span className="chatbot-bubble-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chatbot-message chatbot-message--assistant">
              <div className="chatbot-avatar">
                <Bot size={13} />
              </div>
              <div className="chatbot-bubble chatbot-bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          {showSuggestions && messages.length <= 1 && !loading && (
            <div className="chatbot-suggestions">
              <p className="chatbot-suggestions-label">
                <Compass size={12} /> Quick questions
              </p>
              <div className="chatbot-suggestions-grid">
                {QUICK_SUGGESTIONS.map(s => (
                  <button
                    key={s.text}
                    className="chatbot-suggestion-chip"
                    onClick={() => sendMessage(s.text)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            id="chatbot-input"
            className="chatbot-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any destination..."
            disabled={loading}
            maxLength={500}
          />
          <button
            id="chatbot-send-btn"
            className="chatbot-send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <Loader2 size={16} className="chatbot-spin" />
            ) : (
              <Send size={16} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Powered-by footer */}
        <div className="chatbot-footer">
          <Map size={10} />
          <span>Powered by TF-IDF NLP Model</span>
        </div>
      </div>

      {/* ── Styles ──────────────────────────────────────────────────────────── */}
      <style>{`
        /* FAB Button */
        .chatbot-fab {
          position: fixed;
          bottom: 5.5rem;
          left: 1.25rem;
          z-index: 9999;
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          color: oklch(0.1 0.01 215);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px oklch(0.76 0.145 55 / 45%), 0 2px 8px oklch(0 0 0 / 30%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .chatbot-fab:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 8px 32px oklch(0.76 0.145 55 / 55%), 0 4px 12px oklch(0 0 0 / 35%);
        }
        .chatbot-fab:active { transform: scale(0.97); }
        @media (min-width: 768px) {
          .chatbot-fab { bottom: 1.5rem; }
        }
        .chatbot-fab-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: inherit;
          animation: chatbot-pulse 2.5s ease-in-out infinite;
          opacity: 0.5;
        }
        @keyframes chatbot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        .chatbot-badge {
          position: absolute;
          top: -3px; right: -3px;
          background: oklch(0.55 0.2 25);
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          width: 1.1rem; height: 1.1rem;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid oklch(0.14 0.018 215);
        }

        /* Panel */
        .chatbot-panel {
          position: fixed;
          bottom: 10rem;
          left: 1.25rem;
          z-index: 9998;
          width: min(22rem, calc(100vw - 2rem));
          height: min(36rem, calc(100vh - 12rem));
          display: flex;
          flex-direction: column;
          border-radius: 1.5rem;
          overflow: hidden;
          background: oklch(0.16 0.02 215 / 97%);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid oklch(0.8 0.015 210 / 20%);
          box-shadow:
            0 32px 80px oklch(0 0 0 / 55%),
            0 0 0 1px oklch(0.8 0.015 210 / 8%),
            inset 0 1px 0 oklch(1 0 0 / 8%);
          transform-origin: bottom left;
          transform: scale(0.85) translateY(16px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
        }
        .chatbot-panel--open {
          transform: scale(1) translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        @media (min-width: 768px) {
          .chatbot-panel { bottom: 6.5rem; }
        }

        /* Header */
        .chatbot-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.875rem 1rem;
          background: linear-gradient(135deg, oklch(0.2 0.03 215) 0%, oklch(0.18 0.025 210) 100%);
          border-bottom: 1px solid oklch(0.8 0.015 210 / 15%);
          flex-shrink: 0;
        }
        .chatbot-header-avatar {
          width: 2.25rem; height: 2.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          display: flex; align-items: center; justify-content: center;
          color: oklch(0.1 0.01 215);
          flex-shrink: 0;
          box-shadow: 0 2px 12px oklch(0.76 0.145 55 / 40%);
        }
        .chatbot-globe-icon { animation: chatbot-globe-spin 8s linear infinite; }
        @keyframes chatbot-globe-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .chatbot-header-info { flex: 1; min-width: 0; }
        .chatbot-header-name {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.875rem; font-weight: 700;
          color: oklch(0.94 0.014 85);
          letter-spacing: -0.01em;
        }
        .chatbot-online-dot {
          width: 0.4rem; height: 0.4rem;
          border-radius: 50%;
          background: oklch(0.65 0.18 145);
          box-shadow: 0 0 6px oklch(0.65 0.18 145 / 70%);
          animation: chatbot-online-pulse 2s ease-in-out infinite;
        }
        @keyframes chatbot-online-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
        }
        .chatbot-header-sub {
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.65rem; color: oklch(0.65 0.018 210);
          margin-top: 0.1rem;
        }
        .chatbot-header-actions { display: flex; gap: 0.25rem; }
        .chatbot-icon-btn {
          width: 1.75rem; height: 1.75rem;
          border-radius: 0.5rem;
          background: oklch(0.8 0.015 210 / 10%);
          border: 1px solid oklch(0.8 0.015 210 / 15%);
          color: oklch(0.68 0.018 210);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .chatbot-icon-btn:hover {
          background: oklch(0.8 0.015 210 / 20%);
          color: oklch(0.94 0.014 85);
        }

        /* Messages */
        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          scrollbar-width: thin;
          scrollbar-color: oklch(0.8 0.015 210 / 20%) transparent;
        }
        .chatbot-message {
          display: flex;
          align-items: flex-end;
          gap: 0.4rem;
          animation: chatbot-msg-in 0.3s ease-out both;
        }
        @keyframes chatbot-msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chatbot-message--user { flex-direction: row-reverse; }
        .chatbot-avatar {
          width: 1.625rem; height: 1.625rem;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.76 0.145 55 / 20%) 0%, oklch(0.65 0.18 40 / 20%) 100%);
          border: 1px solid oklch(0.76 0.145 55 / 30%);
          display: flex; align-items: center; justify-content: center;
          color: oklch(0.76 0.145 55);
          flex-shrink: 0;
        }
        .chatbot-bubble {
          max-width: 80%;
          padding: 0.6rem 0.8rem;
          border-radius: 1.125rem;
          position: relative;
        }
        .chatbot-message--assistant .chatbot-bubble {
          background: oklch(0.22 0.024 215);
          border: 1px solid oklch(0.8 0.015 210 / 15%);
          border-bottom-left-radius: 0.375rem;
        }
        .chatbot-message--user .chatbot-bubble {
          background: linear-gradient(135deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          color: oklch(0.1 0.01 215);
          border-bottom-right-radius: 0.375rem;
        }
        .chatbot-bubble-text {
          font-size: 0.8125rem;
          line-height: 1.55;
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .chatbot-message--user .chatbot-bubble-text { color: oklch(0.12 0.015 215); }
        .chatbot-message--assistant .chatbot-bubble-text { color: oklch(0.9 0.012 85); }
        .chatbot-bubble-time {
          display: block;
          font-size: 0.6rem;
          margin-top: 0.25rem;
          opacity: 0.5;
          text-align: right;
        }

        /* Typing indicator */
        .chatbot-bubble--typing {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.75rem 1rem;
          background: oklch(0.22 0.024 215);
          border: 1px solid oklch(0.8 0.015 210 / 15%);
          border-bottom-left-radius: 0.375rem;
        }
        .chatbot-bubble--typing span {
          width: 0.45rem; height: 0.45rem;
          border-radius: 50%;
          background: oklch(0.76 0.145 55);
          animation: chatbot-typing 1.3s ease-in-out infinite;
        }
        .chatbot-bubble--typing span:nth-child(2) { animation-delay: 0.2s; }
        .chatbot-bubble--typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes chatbot-typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* Suggestions */
        .chatbot-suggestions { animation: chatbot-msg-in 0.4s 0.2s ease-out both; }
        .chatbot-suggestions-label {
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.65rem;
          color: oklch(0.6 0.018 210);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .chatbot-suggestions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .chatbot-suggestion-chip {
          font-size: 0.7rem;
          padding: 0.35rem 0.7rem;
          border-radius: 9999px;
          background: oklch(0.22 0.024 215);
          border: 1px solid oklch(0.76 0.145 55 / 35%);
          color: oklch(0.82 0.03 85);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .chatbot-suggestion-chip:hover {
          background: oklch(0.76 0.145 55 / 15%);
          border-color: oklch(0.76 0.145 55 / 60%);
          transform: translateY(-1px);
        }

        /* Input area */
        .chatbot-input-area {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid oklch(0.8 0.015 210 / 15%);
          background: oklch(0.18 0.022 215);
          flex-shrink: 0;
        }
        .chatbot-input {
          flex: 1;
          padding: 0.6rem 0.875rem;
          border-radius: 9999px;
          border: 1px solid oklch(0.8 0.015 210 / 20%);
          background: oklch(0.22 0.024 215);
          color: oklch(0.94 0.014 85);
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-width: 0;
        }
        .chatbot-input::placeholder { color: oklch(0.55 0.018 210); }
        .chatbot-input:focus {
          border-color: oklch(0.76 0.145 55 / 60%);
          box-shadow: 0 0 0 3px oklch(0.76 0.145 55 / 12%);
        }
        .chatbot-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .chatbot-send-btn {
          width: 2.25rem; height: 2.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          color: oklch(0.1 0.01 215);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 2px 12px oklch(0.76 0.145 55 / 40%);
        }
        .chatbot-send-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 16px oklch(0.76 0.145 55 / 55%);
        }
        .chatbot-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .chatbot-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Footer */
        .chatbot-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.4rem;
          font-size: 0.6rem;
          color: oklch(0.45 0.015 210);
          background: oklch(0.15 0.018 215);
          border-top: 1px solid oklch(0.8 0.015 210 / 10%);
          flex-shrink: 0;
        }
      `}</style>
    </>
  )
}

// ── Inline Chat Interface (for /chatbot page) ────────────────────────────────
export function ChatbotInline() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const greeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)]
    setMessages([{ id: 'greeting', role: 'assistant', content: greeting, timestamp: new Date() }])
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    setShowSuggestions(false)
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: trimmed, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: 'assistant', content: data.reply || 'Sorry, try again!', timestamp: new Date(), confidence: data.confidence }])
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'assistant', content: '⚠️ Connection issue. Please ensure the backend is running.', timestamp: new Date() }])
    } finally {
      setLoading(false)
    }
  }, [loading])

  const renderContent = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (pathname === '/auth') return null

  return (
    <div className="chatbot-inline">
      <div className="chatbot-inline-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chatbot-message chatbot-message--${msg.role}`}>
            {msg.role === 'assistant' && <div className="chatbot-avatar"><Bot size={14} /></div>}
            <div className="chatbot-bubble">
              <p className="chatbot-bubble-text">{renderContent(msg.content)}</p>
              <span className="chatbot-bubble-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chatbot-message chatbot-message--assistant">
            <div className="chatbot-avatar"><Bot size={14} /></div>
            <div className="chatbot-bubble chatbot-bubble--typing"><span /><span /><span /></div>
          </div>
        )}
        {showSuggestions && messages.length <= 1 && !loading && (
          <div className="chatbot-suggestions">
            <p className="chatbot-suggestions-label"><Compass size={12} /> Try asking</p>
            <div className="chatbot-suggestions-grid">
              {QUICK_SUGGESTIONS.map(s => (
                <button key={s.text} className="chatbot-suggestion-chip" onClick={() => sendMessage(s.text)}>{s.label}</button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input-area chatbot-input-area--inline">
        <input
          ref={inputRef}
          id="chatbot-inline-input"
          className="chatbot-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder="Ask me about any travel destination or tip..."
          disabled={loading}
          maxLength={500}
        />
        <button
          id="chatbot-inline-send-btn"
          className="chatbot-send-btn"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
        >
          {loading ? <Loader2 size={18} className="chatbot-spin" /> : <Send size={18} strokeWidth={2.5} />}
        </button>
      </div>
      <style>{`
        .chatbot-inline {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }
        .chatbot-inline-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          scrollbar-width: thin;
          scrollbar-color: oklch(0.8 0.015 210 / 20%) transparent;
        }
        .chatbot-input-area--inline {
          padding: 1rem 1.25rem;
          border-top: 1px solid oklch(0.8 0.015 210 / 15%);
          background: oklch(0.16 0.02 215);
        }
        .chatbot-input-area--inline .chatbot-input { font-size: 0.9rem; padding: 0.75rem 1rem; }
        .chatbot-input-area--inline .chatbot-send-btn { width: 2.75rem; height: 2.75rem; }
      `}</style>
    </div>
  )
}
