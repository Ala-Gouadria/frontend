import './WebsiteArcGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clampProgress(value, fallback = 0) {
  const number = Number(value)
  const safeValue = Number.isFinite(number) ? number : fallback
  return Math.max(0, Math.min(safeValue, 1))
}

function arcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

export function WebsiteArcGauge({
  value = '71',
  label = 'Quality Score',
  progress = 0.78,
  compact = false,
  className = '',
}) {
  const safeProgress = clampProgress(progress)
  const cx = compact ? 100 : 180
  const cy = compact ? 94 : 156
  const radius = compact ? 82 : 154
  const cap = arcPoint(cx, cy, radius, safeProgress)
  const viewBox = compact ? '0 0 200 118' : '0 0 360 192'
  const path = compact
    ? 'M 18 94 A 82 82 0 0 1 182 94'
    : 'M 26 156 A 154 154 0 0 1 334 156'

  return (
    <div
      className={classNames('website-arc-gauge', compact && 'website-arc-gauge--compact', className)}
      data-tooltip={`${label}: ${value} (${Math.round(safeProgress * 100)}%)`}
      title={`${label}: ${value}`}
    >
      <svg className="website-arc-gauge__svg" viewBox={viewBox} aria-hidden="true">
        {Array.from({ length: compact ? 17 : 0 }).map((_, index) => {
          const tickProgress = index / 16
          const outer = arcPoint(cx, cy, radius - 16, tickProgress)
          const inner = arcPoint(cx, cy, radius - 23, tickProgress)

          return (
            <line
              key={`tick-${index}`}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              className="website-arc-gauge__tick"
              style={{ '--tick-index': index }}
            />
          )
        })}
        <path d={path} className="website-arc-gauge__track" />
        <path
          d={path}
          className="website-arc-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />
        <circle cx={cap.x} cy={cap.y} r={compact ? 5 : 15} className="website-arc-gauge__cap" />
      </svg>
      <div className="website-arc-gauge__text">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

export default WebsiteArcGauge
