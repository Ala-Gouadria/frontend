import { useId } from 'react'
import './ReportVisuals.css'

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

function cssSafeId(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '')
}

function pointsFromSeries(series = []) {
  return series.map((point) => `${point.x},${point.y}`).join(' ')
}

function areaFromSeries(upperSeries = [], lowerSeries = []) {
  return [...upperSeries, ...[...lowerSeries].reverse()].map((point) => `${point.x},${point.y}`).join(' ')
}

export function ReportMiniBars({ bars = [], tone = 'ink', className = '' }) {
  return (
    <svg className={joinClassNames('report-visual report-mini-bars', `report-mini-bars--${tone}`, className)} viewBox="0 0 120 52" aria-hidden="true">
      {bars.map((bar, index) => (
        <rect
          key={`${bar}-${index}`}
          x={index * 8.4}
          y={50 - bar / 1.55}
          width="2.4"
          height={bar / 1.55}
          rx="1.2"
          className="report-mini-bars__bar"
          style={{ '--bar-index': index }}
        />
      ))}
    </svg>
  )
}

export function ReportDottedBars({ columns = [], tone = 'ink', className = '' }) {
  const maxCount = Math.max(...columns.map((column) => column.count), 1)

  return (
    <svg className={joinClassNames('report-visual report-dotted-bars', `report-dotted-bars--${tone}`, className)} viewBox="0 0 108 34" aria-hidden="true">
      {columns.map((column, columnIndex) => (
        <g key={column.label}>
          {Array.from({ length: maxCount }).map((_, rowIndex) => {
            const visible = rowIndex < column.count
            const x = 10 + columnIndex * 14
            const y = 25 - rowIndex * 4

            return (
              <circle
                key={`${column.label}-${rowIndex}`}
                cx={x}
                cy={y}
                r="1.3"
                className={joinClassNames('report-dotted-bars__dot', visible && 'report-dotted-bars__dot--visible')}
                style={{ '--dot-index': rowIndex }}
              />
            )
          })}
        </g>
      ))}
    </svg>
  )
}

export function ReportMiniLine({ chart, points, fillPoints, tone = 'green', className = '' }) {
  const linePoints = points ?? chart?.points
  const areaPoints = fillPoints ?? chart?.fillPoints

  return (
    <svg className={joinClassNames('report-visual report-mini-line', `report-mini-line--${tone}`, className)} viewBox="0 0 194 58" aria-hidden="true">
      {areaPoints ? <polygon points={areaPoints} className="report-mini-line__fill" /> : null}
      <polyline points={linePoints} className="report-mini-line__stroke" />
    </svg>
  )
}

export function ReportAreaBandChart({
  upperSeries = [],
  lowerSeries = [],
  activeIndex = 0,
  badge,
  tone = 'green',
  className = '',
}) {
  const rawId = useId()
  const fillId = `report-area-fill-${cssSafeId(rawId)}`
  const glowId = `report-area-glow-${cssSafeId(rawId)}`
  const activePoint = upperSeries[activeIndex] ?? upperSeries[0]
  const upperPoints = pointsFromSeries(upperSeries)
  const lowerPoints = pointsFromSeries(lowerSeries)
  const areaPoints = areaFromSeries(upperSeries, lowerSeries)
  const badgeText = badge ?? activePoint?.tooltip

  return (
    <svg className={joinClassNames('report-visual report-area-band', `report-area-band--${tone}`, className)} viewBox="0 0 372 140" aria-hidden="true">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--report-area-top)" />
          <stop offset="100%" stopColor="var(--report-area-bottom)" />
        </linearGradient>
        <filter id={glowId} x="-12%" y="-25%" width="124%" height="150%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon points={areaPoints} className="report-area-band__glow" style={{ fill: `url(#${fillId})`, filter: `url(#${glowId})` }} />
      <polygon points={areaPoints} className="report-area-band__area" style={{ fill: `url(#${fillId})` }} />
      <polyline points={upperPoints} className="report-area-band__line" />
      <polyline points={lowerPoints} className="report-area-band__line report-area-band__line--soft" />
      {activePoint ? <line x1={activePoint.x} x2={activePoint.x} y1="22" y2="135" className="report-area-band__focus" /> : null}
      {upperSeries.map((point, index) => (
        <g key={`${point.x}-${point.y}`}>
          <circle cx={point.x} cy={point.y} r="3" className="report-area-band__dot" />
          {lowerSeries[index] ? <circle cx={point.x} cy={lowerSeries[index].y} r="2.8" className="report-area-band__dot" /> : null}
        </g>
      ))}
      {activePoint && badgeText ? (
        <g transform={`translate(${activePoint.x}, ${activePoint.y + 36})`}>
          <rect x="-22" y="-12" width="44" height="24" rx="12" className="report-area-band__badge" />
          <text textAnchor="middle" dy="4" className="report-area-band__badge-text">
            {badgeText}
          </text>
        </g>
      ) : null}
    </svg>
  )
}

function getArcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

export function ReportSemiGauge({
  current,
  target,
  progress = target ? current / target : 0,
  valueLabel,
  tone = 'green',
  className = '',
}) {
  const safeProgress = Math.max(0, Math.min(progress, 1))
  const capPosition = getArcPoint(180, 160, 148, safeProgress)
  const label = valueLabel ?? `${current}/${target}`

  return (
    <div className={joinClassNames('report-semi-gauge', `report-semi-gauge--${tone}`, className)}>
      <svg className="report-semi-gauge__svg" viewBox="0 0 360 186" aria-hidden="true">
        <path d="M 32 160 A 148 148 0 0 1 328 160" className="report-semi-gauge__glow" />
        <path d="M 32 160 A 148 148 0 0 1 328 160" className="report-semi-gauge__track" />
        <path
          d="M 32 160 A 148 148 0 0 1 328 160"
          className="report-semi-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />
        <circle cx={capPosition.x} cy={capPosition.y} r="16" className="report-semi-gauge__cap" />
      </svg>
      <strong className="report-semi-gauge__value">{label}</strong>
    </div>
  )
}

export function ReportMetric({ label, value, children, className = '' }) {
  return (
    <div className={joinClassNames('report-metric', className)}>
      <span className="report-metric__label">{label}</span>
      <strong className="report-metric__value">{value}</strong>
      {children}
    </div>
  )
}

export function ReportMetricGrid({ children, columns = 5, className = '' }) {
  return (
    <div className={joinClassNames('report-metric-grid', className)} style={{ '--metric-columns': columns }}>
      {children}
    </div>
  )
}

export function ReportProgressBar({ value = 0, tone = 'green', cap = true, className = '' }) {
  const safeValue = Math.max(0, Math.min(value, 100))

  return (
    <div className={joinClassNames('report-progress-bar', `report-progress-bar--${tone}`, className)}>
      <span className="report-progress-bar__fill" style={{ width: `${safeValue}%` }} />
      {cap ? <span className="report-progress-bar__cap" style={{ left: `${safeValue}%` }} /> : null}
    </div>
  )
}

export function ReportStripBar({ value = 0, tone = 'green', className = '' }) {
  const safeValue = Math.max(0, Math.min(value, 100))

  return (
    <div className={joinClassNames('report-strip-bar', `report-strip-bar--${tone}`, className)}>
      <span className="report-strip-bar__fill" style={{ width: `${safeValue}%` }} />
    </div>
  )
}

export function ReportStackedBar({ segments = [], className = '' }) {
  return (
    <div className={joinClassNames('report-stacked-bar', className)}>
      {segments.map((segment) => (
        <span
          key={`${segment.label}-${segment.value}-${segment.tone}`}
          className={joinClassNames('report-stacked-bar__segment', `report-stacked-bar__segment--${segment.tone ?? 'green'}`)}
          style={{ width: `${segment.value}%` }}
          title={segment.label}
        />
      ))}
    </div>
  )
}

export function ReportQualityBlocks({ blocks = [], className = '' }) {
  return (
    <div className={joinClassNames('report-quality-blocks', className)}>
      {blocks.flatMap((group) =>
        Array.from({ length: group.count }).map((_, index) => (
          <span key={`${group.tone}-${index}`} className={joinClassNames('report-quality-block', `report-quality-block--${group.tone ?? 'green'}`)} />
        )),
      )}
    </div>
  )
}

export function ReportActivityRings({ rings = [], className = '' }) {
  return (
    <div className={joinClassNames('report-activity-rings', className)}>
      {rings.map((ring, index) => (
        <span
          key={ring.id ?? `ring-${index}`}
          className={joinClassNames('report-activity-ring', `report-activity-ring--${ring.tone ?? 'green'}`)}
          style={{ '--ring-progress': `${Math.max(0, Math.min(ring.progress ?? 0.75, 1)) * 360}deg` }}
        />
      ))}
    </div>
  )
}

export function ReportStageFlow({ stages = [], activeIndex, className = '' }) {
  return (
    <div className={joinClassNames('report-stage-flow', className)}>
      {stages.map((stage, index) => (
        <div key={stage} className="report-stage-flow__step">
          <span className={joinClassNames('report-stage-flow__pill', index === activeIndex && 'report-stage-flow__pill--active')}>
            {stage}
          </span>
          {index < stages.length - 1 ? <span className="report-stage-flow__arrow">&gt;</span> : null}
        </div>
      ))}
    </div>
  )
}
