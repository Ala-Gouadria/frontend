import './AutomationArcGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clampProgress(value, fallback = 0) {
  const number = Number(value)
  const safeValue = Number.isFinite(number) ? number : fallback
  return Math.max(0, Math.min(safeValue, 1))
}

function parseLabelParts(label) {
  const match = label.match(/^(\d+%)\s*(.*)$/)
  if (match) return { percent: match[1], rest: match[2] }
  return { percent: null, rest: label }
}

const CX = 180
const CY = 220
const R = 210
const START_RAD = (205 * Math.PI) / 180
const END_RAD = (335 * Math.PI) / 180
const SWEEP = END_RAD - START_RAD

function arcPoint(progress, radius = R) {
  const a = START_RAD + progress * SWEEP
  return {
    x: CX + radius * Math.cos(a),
    y: CY + radius * Math.sin(a),
  }
}

const startPt = arcPoint(0)
const endPt = arcPoint(1)
const FULL_ARC = `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)} A ${R} ${R} 0 0 1 ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)}`

const STROKE = 16
const TICK_COUNT = 17
const OUTER_R = R + 34
const INNER_R = R + 20

// Compute a real bounding box from the geometry so the arc, ticks and cap
// always fit inside the viewBox (the old version relied on overflow:visible,
// which blew the arc past the frame and clipped the ticks).
const VIEW_BOX = (() => {
  const PAD = 10
  const xs = []
  const ys = []
  for (let i = 0; i <= 64; i++) {
    const t = i / 64
    const a = arcPoint(t)
    const o = arcPoint(t, OUTER_R)
    xs.push(a.x, o.x)
    ys.push(a.y, o.y)
  }
  const minX = Math.min(...xs) - STROKE / 2 - PAD
  const maxX = Math.max(...xs) + STROKE / 2 + PAD
  const minY = Math.min(...ys) - PAD
  const maxY = Math.max(...ys) + STROKE / 2 + PAD + 4
  return `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`
})()

export function AutomationArcGauge({ progress = 0.7, label = '70% In Progress', detail, className = '' }) {
  const safeProgress = clampProgress(progress, 0.7)
  const cap = arcPoint(safeProgress)
  const tooltip = detail ?? `${label} • ${Math.round(safeProgress * 100)}%`
  const { percent, rest } = parseLabelParts(label)

  // Progress gradient runs along the filled portion (start -> cap).
  const gradStart = arcPoint(0)
  const gradEnd = arcPoint(safeProgress)
  // Track gradient: solid where the progress ends (the cap) and fading out
  // toward the end of the arc — matching the design.
  const trackStart = arcPoint(Math.min(safeProgress, 0.98))
  const trackEnd = arcPoint(1)

  return (
    <div className={classNames('automation-arc-gauge', className)} data-tooltip={tooltip} title={tooltip}>
      <svg className="automation-arc-gauge__svg" viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient
            id="progressGradient"
            x1={gradStart.x} y1={gradStart.y}
            x2={gradEnd.x} y2={gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(214,245,112,.10)" />
            <stop offset="16%" stopColor="#d3ed5f" />
            <stop offset="52%" stopColor="#a9d121" />
            <stop offset="100%" stopColor="#8cbf1b" />
          </linearGradient>
          <linearGradient
            id="trackGradient"
            x1={trackStart.x} y1={trackStart.y}
            x2={trackEnd.x} y2={trackEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(205,221,176,.85)" />
            <stop offset="55%" stopColor="rgba(214,224,196,.45)" />
            <stop offset="100%" stopColor="rgba(220,228,205,0)" />
          </linearGradient>
        </defs>

        {Array.from({ length: TICK_COUNT }).map((_, i) => {
          const t = i / (TICK_COUNT - 1)
          const outer = arcPoint(t, OUTER_R)
          const inner = arcPoint(t, INNER_R)
          return (
            <line
              key={i}
              x1={outer.x} y1={outer.y}
              x2={inner.x} y2={inner.y}
              className={classNames(
                'automation-arc-gauge__tick',
                t > safeProgress + 0.005 && 'automation-arc-gauge__tick--muted'
              )}
              style={{ '--tick-index': i }}
            />
          )
        })}

        <path d={FULL_ARC} className="automation-arc-gauge__track" />
        <path
          d={FULL_ARC}
          className="automation-arc-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />
        <circle cx={cap.x} cy={cap.y} r="11" className="automation-arc-gauge__cap" />
      </svg>

      <strong className="automation-arc-gauge__label">
        {percent && <span className="automation-arc-gauge__label-percent">{percent}</span>}
        {rest && <span className="automation-arc-gauge__label-rest"> {rest}</span>}
      </strong>
    </div>
  )
}

export default AutomationArcGauge
