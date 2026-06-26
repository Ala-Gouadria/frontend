import { useEffect, useState } from 'react'
import './AgentIndicator.css'

/**
 * Agent metadata for display - maps agent keys to user-friendly info.
 * These are the 9 specialized agents in the Nora system.
 */
const AGENT_INFO = {
  analyst: {
    label: 'Analyst',
    description: 'Data & metrics analysis',
    color: '#6366f1', // indigo
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  marketing: {
    label: 'Marketing',
    description: 'Campaigns & content',
    color: '#ec4899', // pink
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  community: {
    label: 'Community',
    description: 'Engagement & moderation',
    color: '#14b8a6', // teal
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  executive: {
    label: 'Executive',
    description: 'Strategy & leadership',
    color: '#f59e0b', // amber
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  sales: {
    label: 'Sales',
    description: 'Pipeline & leads',
    color: '#22c55e', // green
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  product: {
    label: 'Product',
    description: 'Features & roadmap',
    color: '#8b5cf6', // violet
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  finance: {
    label: 'Finance',
    description: 'Budget & runway',
    color: '#06b6d4', // cyan
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  operations: {
    label: 'Operations',
    description: 'Process optimization',
    color: '#f97316', // orange
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  hr: {
    label: 'HR',
    description: 'Hiring & talent',
    color: '#ef4444', // red
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
}

// Fallback for unknown agents
const DEFAULT_AGENT = {
  label: 'Assistant',
  description: 'General assistance',
  color: '#2f80ff',
  icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
}

function AgentIcon({ path, size = 20 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

/**
 * Compact indicator showing which agent is handling the current request.
 * Animates in when an agent is selected and shows confidence level.
 *
 * @param {Object} props
 * @param {string} props.agent - The agent key (e.g., 'marketing', 'sales')
 * @param {number} props.confidence - Confidence score 0-1
 * @param {string} props.reasoning - Brief explanation of why this agent was chosen
 * @param {Array} props.secondaryAgents - Optional secondary agents for multi-agent queries
 * @param {boolean} props.isLoading - Show loading state
 * @param {boolean} props.compact - Use compact mode (just icon + label)
 */
export default function AgentIndicator({
  agent,
  confidence = 0,
  reasoning = '',
  secondaryAgents = [],
  isLoading = false,
  compact = false,
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (agent || isLoading) {
      // Small delay for entrance animation
      const timer = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [agent, isLoading])

  if (!agent && !isLoading) {
    return null
  }

  const info = AGENT_INFO[agent] || DEFAULT_AGENT
  const confidencePercent = Math.round(confidence * 100)

  if (compact) {
    return (
      <div
        className={`agent-indicator agent-indicator--compact ${visible ? 'is-visible' : ''}`}
        style={{ '--agent-color': info.color }}
      >
        {isLoading ? (
          <div className="agent-indicator__loading" />
        ) : (
          <>
            <span className="agent-indicator__icon">
              <AgentIcon path={info.icon} size={16} />
            </span>
            <span className="agent-indicator__label">{info.label}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={`agent-indicator ${visible ? 'is-visible' : ''}`}
      style={{ '--agent-color': info.color }}
    >
      {isLoading ? (
        <div className="agent-indicator__loading-state">
          <div className="agent-indicator__loading" />
          <span>Routing to agent...</span>
        </div>
      ) : (
        <>
          <div className="agent-indicator__primary">
            <span className="agent-indicator__icon">
              <AgentIcon path={info.icon} />
            </span>
            <div className="agent-indicator__info">
              <span className="agent-indicator__label">{info.label}</span>
              <span className="agent-indicator__desc">{info.description}</span>
            </div>
            {confidence > 0 && (
              <span className="agent-indicator__confidence" title={`${confidencePercent}% confidence`}>
                {confidencePercent}%
              </span>
            )}
          </div>

          {reasoning && (
            <p className="agent-indicator__reasoning">{reasoning}</p>
          )}

          {secondaryAgents.length > 0 && (
            <div className="agent-indicator__secondary">
              <span className="agent-indicator__secondary-label">Also involving:</span>
              <div className="agent-indicator__secondary-list">
                {secondaryAgents.map((sec) => {
                  const secInfo = AGENT_INFO[sec.agent] || DEFAULT_AGENT
                  return (
                    <span
                      key={sec.agent}
                      className="agent-indicator__secondary-chip"
                      style={{ '--agent-color': secInfo.color }}
                      title={sec.reasoning}
                    >
                      <AgentIcon path={secInfo.icon} size={14} />
                      {secInfo.label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Get agent info by key (useful for external components)
 */
export function getAgentInfo(agentKey) {
  return AGENT_INFO[agentKey] || DEFAULT_AGENT
}

/**
 * List of all available agents
 */
export const AVAILABLE_AGENTS = Object.keys(AGENT_INFO)
