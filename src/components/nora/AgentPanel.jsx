import { useEffect, useRef, useState } from 'react'
import { DEMO_AGENTS } from './agentPanelConfig'
import './AgentPanel.css'

function ChevronIcon({ open }) {
  return (
    <svg
      className={`agent-panel__chevron ${open ? 'is-open' : ''}`}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function AgentSection({ agent, index, open, onToggle }) {
  const provider = agent.provider.toLowerCase()
  return (
    <section
      className={`agent-panel__section ${open ? 'is-open' : 'is-collapsed'}`}
      style={{ '--agent-index': index }}
      data-provider={provider}
    >
      <button
        type="button"
        className="agent-panel__section-head"
        onClick={onToggle}
        aria-expanded={open}
        data-provider={provider}
      >
        <span className="agent-panel__dot" data-provider={provider} />
        <div className="agent-panel__section-titles">
          <h3 className="agent-panel__section-title">{agent.label}</h3>
          <p className="agent-panel__section-tagline">{agent.tagline}</p>
        </div>
        <span className="agent-panel__provider" data-provider={provider}>
          {agent.provider}
        </span>
        <ChevronIcon open={open} />
      </button>

      <div className="agent-panel__body" aria-hidden={!open}>
        <div className="agent-panel__cards">
          {agent.cards.map((Card, cardIndex) => (
            <div className="agent-panel__card" key={cardIndex} style={{ '--card-index': cardIndex }}>
              <Card />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Right-side panel that reveals the agents Nora is orchestrating. Each agent
 * appears as a compact header as it is mentioned; the most-recently-revealed
 * agent auto-expands and the previous one collapses (so the open card tracks
 * what Nora is currently talking about). The user can click any header to
 * override. After the last agent is named it stays expanded.
 */
export default function AgentPanel({ revealed }) {
  const [openKey, setOpenKey] = useState(null)
  const [userOverride, setUserOverride] = useState(false)
  const prevRevealedRef = useRef(new Set())

  // Auto-expand the newest agent as it's revealed (unless the user has taken
  // manual control by clicking).
  useEffect(() => {
    const prev = prevRevealedRef.current
    // Find agents revealed since last render, in canonical order.
    const newlyRevealed = DEMO_AGENTS.filter((a) => revealed?.has(a.key) && !prev.has(a.key))
    if (newlyRevealed.length > 0 && !userOverride) {
      // Open the last newly-revealed agent (the one Nora just named).
      setOpenKey(newlyRevealed[newlyRevealed.length - 1].key)
    }
    prevRevealedRef.current = new Set(revealed ? [...revealed] : [])
  }, [revealed, userOverride])

  const active = DEMO_AGENTS.filter((agent) => revealed?.has(agent.key))
  if (active.length === 0) {
    return null
  }

  const toggle = (key) => {
    setUserOverride(true) // user is now driving
    setOpenKey((current) => (current === key ? null : key))
  }

  return (
    <aside className="agent-panel" aria-label="Agents Nora is orchestrating">
      <div className="agent-panel__header">
        <span className="agent-panel__eyebrow">Orchestrating</span>
        <h2 className="agent-panel__title">Nora&rsquo;s agents</h2>
      </div>

      <div className="agent-panel__scroll">
        {active.map((agent, index) => (
          <AgentSection
            key={agent.key}
            agent={agent}
            index={index}
            open={openKey === agent.key}
            onToggle={() => toggle(agent.key)}
          />
        ))}
      </div>
    </aside>
  )
}
