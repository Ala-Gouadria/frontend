import { useRef, useState, useLayoutEffect, useId } from 'react'
import './ActivityProgressPill.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clampPercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(number, 100))
}

function buildPillPath(w, h, sw) {
  const inset = sw / 2
  const r = (h - sw) / 2
  const x1 = inset + r
  const x2 = w - inset - r
  return `M ${x1} ${inset} L ${x2} ${inset} A ${r} ${r} 0 1 1 ${x2} ${h - inset} L ${x1} ${h - inset} A ${r} ${r} 0 1 1 ${x1} ${inset}`
}

function getPointOnPill(w, h, sw, distance) {
  const inset = sw / 2
  const r = (h - sw) / 2
  const x1 = inset + r
  const x2 = w - inset - r
  const topLen = x2 - x1
  const rightArc = Math.PI * r
  const bottomLen = x2 - x1
  const leftArc = Math.PI * r

  let d = distance

  if (d <= topLen) {
    return { x: x1 + d, y: inset }
  }
  d -= topLen

  if (d <= rightArc) {
    const angle = (d / r) - Math.PI / 2
    const cx = x2
    const cy = h / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }
  d -= rightArc

  if (d <= bottomLen) {
    return { x: x2 - d, y: h - inset }
  }
  d -= bottomLen

  if (d <= leftArc) {
    const angle = (d / r) + Math.PI / 2
    const cx = x1
    const cy = h / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  return { x: x1, y: inset }
}

export function ActivityProgressPill({
  label,
  progress = 0,
  value = `${progress}%`,
  className = '',
}) {
  const safeProgress = clampPercent(progress)
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const update = () => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const sw = 3.5
  const { w, h } = dims
  const pillPath = w > 0 && h > 0 ? buildPillPath(w, h, sw) : ''
  const r = (h - sw) / 2
  const perimeter = w > 0 && h > 0
    ? 2 * (w - sw - 2 * r) + 2 * Math.PI * r
    : 0
  const filledLen = (safeProgress / 100) * perimeter
  const unfilledLen = perimeter - filledLen

  const dotPos = w > 0 && h > 0
    ? getPointOnPill(w, h, sw, filledLen)
    : null

  const gradId = `progress-grad-${uid}`

  return (
    <div
      ref={containerRef}
      className={classNames('activity-progress-pill', className)}
      role="progressbar"
      aria-valuenow={safeProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${safeProgress}%`}
    >
      {w > 0 && h > 0 && (
        <svg
          className="activity-progress-pill__border-svg"
          viewBox={`0 0 ${w} ${h}`}
          fill="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cce43e" />
              <stop offset="100%" stopColor="#4f8d00" />
            </linearGradient>
          </defs>
          <path
            d={pillPath}
            stroke="#eff8bb"
            strokeWidth={sw}
            fill="none"
          />
          <path
            d={pillPath}
            stroke={`url(#${gradId})`}
            strokeWidth={sw}
            fill="none"
            strokeDasharray={`${filledLen} ${unfilledLen}`}
            strokeLinecap="round"
          />
          {dotPos && (
            <circle
              cx={dotPos.x}
              cy={dotPos.y}
              r={5.5}
              fill="#cce43e"
              className="activity-progress-pill__dot-svg"
            />
          )}
        </svg>
      )}
      <span className="activity-progress-pill__label">{label}</span>
      <span className="activity-progress-pill__value">{value}</span>
    </div>
  )
}

export default ActivityProgressPill
