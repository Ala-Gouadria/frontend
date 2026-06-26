import { useState, useRef, useEffect } from 'react'
import { orchestrationsApi } from '../../api/orchestrationsApi'
import { getAgentInfo, AVAILABLE_AGENTS } from './AgentIndicator'
import './AgentCorrection.css'

/**
 * Small icon component for agent display
 */
function AgentIcon({ path, size = 18 }) {
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
 * Component for correcting agent selection when the classifier picks wrong.
 * Shows a dropdown of all available agents and submits feedback to improve
 * future classifications.
 *
 * @param {Object} props
 * @param {string} props.query - The original query that was classified
 * @param {string} props.currentAgent - The currently selected agent
 * @param {Function} props.onCorrected - Callback when correction is submitted
 * @param {boolean} props.inline - Show inline (smaller) vs popup style
 */
export default function AgentCorrection({
  query,
  currentAgent,
  onCorrected,
  inline = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const containerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelectAgent = async (newAgent) => {
    if (newAgent === currentAgent) {
      setIsOpen(false)
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await orchestrationsApi.voiceRoutingFeedback({
        query,
        predictedAgent: currentAgent,
        correctAgent: newAgent,
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Thanks for the feedback!' })
        onCorrected?.(newAgent)
        setTimeout(() => {
          setIsOpen(false)
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to save' })
      }
    } catch (err) {
      console.error('Failed to submit routing feedback:', err)
      setMessage({ type: 'error', text: 'Failed to save feedback' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentInfo = getAgentInfo(currentAgent)

  return (
    <div
      ref={containerRef}
      className={`agent-correction ${inline ? 'agent-correction--inline' : ''}`}
    >
      <button
        type="button"
        className="agent-correction__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Wrong agent? Click to correct"
        disabled={isSubmitting}
      >
        <span className="agent-correction__trigger-text">Wrong agent?</span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`agent-correction__chevron ${isOpen ? 'is-open' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="agent-correction__dropdown">
          <div className="agent-correction__header">
            Select the correct agent:
          </div>

          {message && (
            <div className={`agent-correction__message agent-correction__message--${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="agent-correction__list">
            {AVAILABLE_AGENTS.map((agentKey) => {
              const info = getAgentInfo(agentKey)
              const isCurrent = agentKey === currentAgent

              return (
                <button
                  key={agentKey}
                  type="button"
                  className={`agent-correction__option ${isCurrent ? 'is-current' : ''}`}
                  style={{ '--agent-color': info.color }}
                  onClick={() => handleSelectAgent(agentKey)}
                  disabled={isSubmitting}
                >
                  <span className="agent-correction__option-icon">
                    <AgentIcon path={info.icon} />
                  </span>
                  <span className="agent-correction__option-info">
                    <span className="agent-correction__option-label">{info.label}</span>
                    <span className="agent-correction__option-desc">{info.description}</span>
                  </span>
                  {isCurrent && (
                    <span className="agent-correction__current-badge">Current</span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="agent-correction__footer">
            <span>Your feedback helps improve routing</span>
          </div>
        </div>
      )}
    </div>
  )
}
