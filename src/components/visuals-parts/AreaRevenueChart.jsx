import { useId } from 'react'
import './AreaRevenueChart.css'

const defaultUpperSeries = [
  { x: 0, y: 76, tooltip: '+19%' },
  { x: 70, y: 56, tooltip: '+31%' },
  { x: 140, y: 24, tooltip: '+48%' },
  { x: 210, y: 63, tooltip: '+22%' },
  { x: 280, y: 43, tooltip: '+36%' },
  { x: 350, y: 67, tooltip: '+17%' },
  { x: 420, y: 24, tooltip: '+52%' },
]

const defaultLowerSeries = [
  { x: 0, y: 112 },
  { x: 70, y: 112 },
  { x: 140, y: 92 },
  { x: 210, y: 127 },
  { x: 280, y: 119 },
  { x: 350, y: 122 },
  { x: 420, y: 78 },
]

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function safeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '')
}

function pointsToString(points) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

function buildAreaPoints(upperSeries, lowerSeries) {
  return [...upperSeries, ...[...lowerSeries].reverse()].map((point) => `${point.x},${point.y}`).join(' ')
}

function offsetSeries(series, offset) {
  return series.map((point) => ({ ...point, y: point.y + offset }))
}

export function AreaRevenueChart({
  upperSeries = defaultUpperSeries,
  lowerSeries = defaultLowerSeries,
  activeIndex = 2,
  badge,
  title,
  tone = 'green',
  className = '',
  railOffset = 18,
}) {
  const gradientId = `area-revenue-gradient-${safeId(useId())}`
  const glowId = `area-revenue-glow-${safeId(useId())}`
  const activePoint = upperSeries[activeIndex] ?? upperSeries[0]
  const activeLowerPoint = lowerSeries[activeIndex] ?? lowerSeries[0]
  const topRailSeries = offsetSeries(upperSeries, -railOffset)
  const bottomRailSeries = offsetSeries(lowerSeries, railOffset)
  const badgeText = badge ?? activePoint?.tooltip

  return (
    <div className={classNames('area-revenue-chart', `area-revenue-chart--${tone}`, className)}>
      {title ? <div className="area-revenue-chart__title">{title}</div> : null}
      <svg className="area-revenue-chart__svg" viewBox="0 0 420 140" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--area-revenue-top)" />
            <stop offset="48%" stopColor="var(--area-revenue-mid)" />
            <stop offset="100%" stopColor="var(--area-revenue-bottom)" />
          </linearGradient>
          <filter id={glowId} x="-16%" y="-34%" width="132%" height="168%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points={buildAreaPoints(upperSeries, lowerSeries)}
          className="area-revenue-chart__glow"
          style={{ fill: `url(#${gradientId})`, filter: `url(#${glowId})` }}
        />
        <polygon points={buildAreaPoints(upperSeries, lowerSeries)} className="area-revenue-chart__area" style={{ fill: `url(#${gradientId})` }} />
        <polyline points={pointsToString(topRailSeries)} className="area-revenue-chart__rail area-revenue-chart__rail--top" />
        <polyline points={pointsToString(bottomRailSeries)} className="area-revenue-chart__rail area-revenue-chart__rail--bottom" />

        {activePoint ? (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={Math.max(8, activePoint.y - railOffset - 7)}
            y2={Math.min(138, (activeLowerPoint?.y ?? activePoint.y + 68) + railOffset + 15)}
            className="area-revenue-chart__focus"
          />
        ) : null}

        {upperSeries.map((point, index) => (
          <g key={`${point.x}-${point.y}`}>
            <circle cx={point.x} cy={topRailSeries[index].y} r="4.2" className="area-revenue-chart__dot area-revenue-chart__dot--rail" />
            {lowerSeries[index] ? (
              <circle cx={point.x} cy={bottomRailSeries[index].y} r="4.2" className="area-revenue-chart__dot area-revenue-chart__dot--rail" />
            ) : null}
            <circle cx={point.x} cy={point.y} r="13" className="area-revenue-chart__hit">
              <title>{point.tooltip ?? `Point ${index + 1}: ${Math.round(140 - point.y)}`}</title>
            </circle>
          </g>
        ))}

        {activePoint && badgeText ? (
          <g transform={`translate(${activePoint.x}, ${activePoint.y + 37})`}>
            <rect x="-32" y="-16" width="64" height="32" rx="16" className="area-revenue-chart__badge" />
            <text textAnchor="middle" dy="5" className="area-revenue-chart__badge-text">
              {badgeText}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  )
}

export default AreaRevenueChart
