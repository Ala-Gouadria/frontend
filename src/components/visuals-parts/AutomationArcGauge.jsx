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

export function AutomationArcGauge({ progress = 0.7, label = '70% In Progress', detail, className = '' }) {
  const safeProgress = clamp(progress)
  const cap = arcPoint(180, 154, 154, safeProgress)
  const tooltip = detail ?? `${label} • ${Math.round(safeProgress * 100)}%`

  return (
    <div className={classNames('automation-arc-gauge', className)} data-tooltip={tooltip} title={tooltip}>
      <svg className="automation-arc-gauge__svg" viewBox="0 0 360 196" aria-hidden="true">
        {Array.from({ length: 19 }).map((_, index) => {
          const tickProgress = index / 18
          const outer = arcPoint(180, 154, 130, tickProgress)
          const inner = arcPoint(180, 154, 121, tickProgress)

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
        <path d="M 26 154 A 154 154 0 0 1 334 154" className="automation-arc-gauge__track" />
        <path
          d="M 26 154 A 154 154 0 0 1 334 154"
          className="automation-arc-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />
        <circle cx={cap.x} cy={cap.y} r="9.5" className="automation-arc-gauge__cap" />
      </svg>
      <strong className="automation-arc-gauge__label">{label}</strong>
    </div>
  )
}

export default AutomationArcGauge
