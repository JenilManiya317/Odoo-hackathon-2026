'use client'

import { ChatbotInline } from '@/components/chatbot'
import {
  Bot,
  BrainCircuit,
  Globe,
  Lightbulb,
  Map,
  Plane,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

const FEATURE_CARDS = [
  {
    icon: Globe,
    title: 'Destination Intel',
    desc: 'Detailed info on 50+ destinations worldwide.',
  },
  {
    icon: Map,
    title: 'Itinerary Planning',
    desc: 'Day-by-day travel plans tailored to your style.',
  },
  {
    icon: Lightbulb,
    title: 'Budget Tips',
    desc: 'Save money without sacrificing the experience.',
  },
  {
    icon: TrendingUp,
    title: 'Travel Trends',
    desc: 'Best seasons, safety info, and insider tips.',
  },
]

export default function ChatbotPage() {
  return (
    <main className="chatbot-page">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="chatbot-page-header">
        <div className="chatbot-page-hero">
          {/* Animated globe orb */}
          <div className="chatbot-orb" aria-hidden="true">
            <div className="chatbot-orb-ring chatbot-orb-ring--1" />
            <div className="chatbot-orb-ring chatbot-orb-ring--2" />
            <div className="chatbot-orb-ring chatbot-orb-ring--3" />
            <div className="chatbot-orb-core">
              <Bot size={28} strokeWidth={1.5} />
            </div>
          </div>

          <div className="chatbot-page-title-group">
            <div className="chatbot-page-badge">
              <Sparkles size={12} />
              NLP · Deep Learning · Travel AI
            </div>
            <h1 className="chatbot-page-title">
              Trotter <span className="chatbot-page-title-accent">AI</span>
            </h1>
            <p className="chatbot-page-subtitle">
              Your intelligent travel companion, powered by a TF-IDF natural language
              processing model. Ask anything about destinations, visas, budgets,
              packing, and more.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="chatbot-feature-cards">
          {FEATURE_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="chatbot-feature-card">
              <div className="chatbot-feature-icon">
                <Icon size={16} />
              </div>
              <div>
                <p className="chatbot-feature-title">{title}</p>
                <p className="chatbot-feature-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Chat Window ─────────────────────────────────────────────────────── */}
      <section className="chatbot-page-chat-section" aria-label="Chat with Trotter AI">
        <div className="chatbot-page-chat-container">
          {/* Chat header bar */}
          <div className="chatbot-page-chat-header">
            <div className="chatbot-page-chat-avatar">
              <Globe size={18} className="chatbot-page-globe-spin" />
            </div>
            <div>
              <p className="chatbot-page-chat-name">
                Trotter AI
                <span className="chatbot-page-online-dot" />
              </p>
              <p className="chatbot-page-chat-sub">
                <BrainCircuit size={10} />
                TF-IDF NLP Model · Ready to explore
              </p>
            </div>
            <Plane
              size={16}
              className="chatbot-page-chat-plane"
              strokeWidth={1.5}
            />
          </div>

          {/* Inline chat */}
          <ChatbotInline />
        </div>
      </section>

      {/* ── Model Info Banner ───────────────────────────────────────────────── */}
      <section className="chatbot-model-info">
        <div className="chatbot-model-info-inner">
          <BrainCircuit size={18} className="chatbot-model-info-icon" />
          <div>
            <p className="chatbot-model-info-title">How Trotter AI works</p>
            <p className="chatbot-model-info-desc">
              Built on a <strong>TF-IDF vectorizer</strong> with <strong>cosine similarity</strong> retrieval —
              the same NLP architecture used in the project notebook. The model is trained on{' '}
              <strong>150+ curated travel Q&A pairs</strong> across 20+ intent categories
              including destinations, planning, budgeting, visas, safety, and culture.
              Text preprocessing uses <strong>NLTK lemmatization</strong> + stopword removal
              for robust matching.
            </p>
          </div>
        </div>
      </section>

      {/* ── Page Styles ─────────────────────────────────────────────────────── */}
      <style>{`
        .chatbot-page {
          min-height: 100dvh;
          padding: 1.5rem 1rem 6rem;
          max-width: 56rem;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .chatbot-page { padding: 2.5rem 2rem 3rem; gap: 2.5rem; }
        }

        /* Hero */
        .chatbot-page-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .chatbot-page-hero { flex-direction: row; text-align: left; }
        }

        /* Orb */
        .chatbot-orb {
          position: relative;
          width: 5.5rem; height: 5.5rem;
          flex-shrink: 0;
        }
        .chatbot-orb-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid oklch(0.76 0.145 55 / 30%);
          animation: chatbot-orb-spin linear infinite;
        }
        .chatbot-orb-ring--1 {
          inset: 0;
          animation-duration: 8s;
        }
        .chatbot-orb-ring--2 {
          inset: 0.625rem;
          animation-duration: 12s;
          animation-direction: reverse;
          border-color: oklch(0.65 0.18 200 / 25%);
        }
        .chatbot-orb-ring--3 {
          inset: 1.25rem;
          animation-duration: 6s;
          border-color: oklch(0.76 0.145 55 / 20%);
        }
        @keyframes chatbot-orb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .chatbot-orb-core {
          position: absolute;
          inset: 1.75rem;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: oklch(0.1 0.01 215);
          box-shadow: 0 0 30px oklch(0.76 0.145 55 / 50%);
          animation: chatbot-orb-pulse 3s ease-in-out infinite;
        }
        @keyframes chatbot-orb-pulse {
          0%, 100% { box-shadow: 0 0 20px oklch(0.76 0.145 55 / 40%); }
          50% { box-shadow: 0 0 40px oklch(0.76 0.145 55 / 70%); }
        }

        /* Title group */
        .chatbot-page-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: oklch(0.76 0.145 55);
          background: oklch(0.76 0.145 55 / 12%);
          border: 1px solid oklch(0.76 0.145 55 / 25%);
          border-radius: 9999px;
          padding: 0.3rem 0.75rem;
          margin-bottom: 0.375rem;
        }
        .chatbot-page-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: oklch(0.94 0.014 85);
          line-height: 1.1;
          margin: 0;
        }
        .chatbot-page-title-accent {
          background: linear-gradient(90deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .chatbot-page-subtitle {
          font-size: 0.875rem;
          color: oklch(0.65 0.018 210);
          line-height: 1.6;
          margin: 0.5rem 0 0;
          max-width: 38rem;
        }

        /* Feature cards */
        .chatbot-feature-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .chatbot-feature-cards { grid-template-columns: repeat(4, 1fr); }
        }
        .chatbot-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          padding: 0.875rem;
          border-radius: 1rem;
          background: oklch(0.18 0.022 215);
          border: 1px solid oklch(0.8 0.015 210 / 15%);
          transition: border-color 0.2s, transform 0.2s;
        }
        .chatbot-feature-card:hover {
          border-color: oklch(0.76 0.145 55 / 35%);
          transform: translateY(-2px);
        }
        .chatbot-feature-icon {
          width: 2rem; height: 2rem;
          border-radius: 0.625rem;
          background: linear-gradient(135deg, oklch(0.76 0.145 55 / 15%) 0%, oklch(0.65 0.18 40 / 15%) 100%);
          border: 1px solid oklch(0.76 0.145 55 / 25%);
          color: oklch(0.76 0.145 55);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chatbot-feature-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: oklch(0.9 0.012 85);
          margin: 0 0 0.2rem;
        }
        .chatbot-feature-desc {
          font-size: 0.65rem;
          color: oklch(0.6 0.018 210);
          margin: 0;
          line-height: 1.4;
        }

        /* Chat window */
        .chatbot-page-chat-section { flex: 1; }
        .chatbot-page-chat-container {
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid oklch(0.8 0.015 210 / 20%);
          background: oklch(0.16 0.02 215 / 95%);
          backdrop-filter: blur(24px);
          box-shadow: 0 24px 64px oklch(0 0 0 / 40%), inset 0 1px 0 oklch(1 0 0 / 6%);
          display: flex;
          flex-direction: column;
          height: min(70vh, 42rem);
        }
        .chatbot-page-chat-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, oklch(0.2 0.03 215) 0%, oklch(0.18 0.025 210) 100%);
          border-bottom: 1px solid oklch(0.8 0.015 210 / 15%);
          flex-shrink: 0;
        }
        .chatbot-page-chat-avatar {
          width: 2.5rem; height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.76 0.145 55) 0%, oklch(0.65 0.18 40) 100%);
          display: flex; align-items: center; justify-content: center;
          color: oklch(0.1 0.01 215);
          flex-shrink: 0;
          box-shadow: 0 2px 16px oklch(0.76 0.145 55 / 45%);
        }
        .chatbot-page-globe-spin { animation: chatbot-orb-spin 8s linear infinite; }
        .chatbot-page-chat-name {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.9375rem; font-weight: 700;
          color: oklch(0.94 0.014 85);
          margin: 0;
        }
        .chatbot-page-online-dot {
          width: 0.45rem; height: 0.45rem;
          border-radius: 50%;
          background: oklch(0.65 0.18 145);
          box-shadow: 0 0 8px oklch(0.65 0.18 145 / 70%);
          animation: chatbot-online-pulse 2s ease-in-out infinite;
        }
        @keyframes chatbot-online-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .chatbot-page-chat-sub {
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.7rem; color: oklch(0.6 0.018 210);
          margin: 0.1rem 0 0;
        }
        .chatbot-page-chat-plane {
          margin-left: auto;
          color: oklch(0.76 0.145 55 / 40%);
          animation: chatbot-plane-float 3s ease-in-out infinite;
        }
        @keyframes chatbot-plane-float {
          0%, 100% { transform: translateX(0) translateY(0) rotate(-15deg); }
          50% { transform: translateX(4px) translateY(-3px) rotate(-10deg); }
        }

        /* Model info */
        .chatbot-model-info {
          border-radius: 1.25rem;
          border: 1px solid oklch(0.65 0.18 200 / 20%);
          background: oklch(0.65 0.18 200 / 6%);
          padding: 1.25rem;
        }
        .chatbot-model-info-inner {
          display: flex;
          gap: 0.875rem;
          align-items: flex-start;
        }
        .chatbot-model-info-icon {
          flex-shrink: 0;
          margin-top: 0.1rem;
          color: oklch(0.65 0.18 200);
        }
        .chatbot-model-info-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: oklch(0.9 0.012 85);
          margin: 0 0 0.375rem;
        }
        .chatbot-model-info-desc {
          font-size: 0.75rem;
          color: oklch(0.62 0.018 210);
          line-height: 1.65;
          margin: 0;
        }
        .chatbot-model-info-desc strong {
          color: oklch(0.78 0.02 85);
          font-weight: 600;
        }
      `}</style>
    </main>
  )
}
