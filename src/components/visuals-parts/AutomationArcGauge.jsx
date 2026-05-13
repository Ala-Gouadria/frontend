import './AutomationArcGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value) {
  return Math.max(0, Math.min(value, 1))
}

function arcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)
  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

function parseLabelParts(label) {
  const match = label.match(/^(\d+%)\s*(.*)$/)
  if (match) return { percent: match[1], rest: match[2] }
  return { percent: null, rest: label }
}

export function AutomationArcGauge({ progress = 0.7, label = '70% In Progress', detail, className = '' }) {
  const safeProgress = clamp(progress)
  const cap = arcPoint(180, 154, 154, safeProgress)
  const tooltip = detail ?? `${label} • ${Math.round(safeProgress * 100)}%`
  const { percent, rest } = parseLabelParts(label)

  return (
    <div className={classNames('automation-arc-gauge', className)} data-tooltip={tooltip} title={tooltip}>
      <svg className="automation-arc-gauge__svg" viewBox="0 0 360 210" aria-hidden="true">
        <defs>
          {/* Progress: light yellow-green at left → dark olive at cap end */}
          <linearGradient id="progressGradient" x1="26" y1="154" x2="300" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d6f06e" />
            <stop offset="100%" stopColor="#5c7a00" />
          </linearGradient>
          {/* Track: visible grey-green near cap → fully transparent toward right bottom */}
          <linearGradient id="trackGradient" x1="334" y1="154" x2="180" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(190,215,145,0.55)" />
            <stop offset="100%" stopColor="rgba(190,215,145,0)" />
          </linearGradient>
        </defs>

        {/* Ticks — fully outside the arc (arc outer edge ≈ 164, ticks start at 172) */}
        {Array.from({ length: 17 }).map((_, index) => {
          const tickProgress = index / 16
          const outer = arcPoint(180, 154, 178, tickProgress)
          const inner = arcPoint(180, 154, 168, tickProgress)
          return (
            <line
              key={`tick-${index}`}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              className="automation-arc-gauge__tick"
              style={{ '--tick-index': index }}
            />
          )
        })}

        {/* Track (remaining arc) */}
        <path d="M 26 154 A 154 154 0 0 1 334 154" className="automation-arc-gauge__track" />

        {/* Progress arc */}
        <path
          d="M 26 154 A 154 154 0 0 1 334 154"
          className="automation-arc-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />

        {/* Cap dot */}
        <circle cx={cap.x} cy={cap.y} r="12" className="automation-arc-gauge__cap" />
      </svg>

      <strong className="automation-arc-gauge__label">
        {percent && <span className="automation-arc-gauge__label-percent">{percent}</span>}
        {rest && <span className="automation-arc-gauge__label-rest"> {rest}</span>}
      </strong>
    </div>
  )
}

export default AutomationArcGauge