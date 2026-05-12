import { useEffect, useRef } from 'react'
import './BatchBar.css'

/**
 * BatchBar
 * @param {string}  label     - batch name, e.g. "Instagram Live Hack posts"
 * @param {number}  progress  - posts done, e.g. 7
 * @param {number}  total     - posts total, e.g. 12
 * @param {string}  title     - section heading, default "Current Batch"
 */
export function BatchBar({
  label    = 'Instagram Live Hack posts',
  progress = 7,
  total    = 12,
  title    = 'Current Batch',
}) {
  const fillRef = useRef(null)
  const pct     = Math.min(100, Math.round((progress / total) * 100))

  /* animate the fill on mount / whenever pct changes */
  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    el.style.width = '0%'
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.width = `${pct}%`
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [pct])

  return (
    <div className="batch-bar-wrapper">
      <p className="batch-bar__title">{title}</p>

      <div
        className="batch-bar__track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${label}: ${progress} of ${total}`}
      >
        {/* animated green fill */}
        <div className="batch-bar__fill" ref={fillRef} />

        {/* content row sits above the fill */}
        <div className="batch-bar__content">
          <span className="batch-bar__dot" />
          <span className="batch-bar__label">{label}</span>
          <span className="batch-bar__count">
            <strong>{progress}</strong>/{total}
          </span>
        </div>
      </div>
    </div>
  )
}

export default BatchBar