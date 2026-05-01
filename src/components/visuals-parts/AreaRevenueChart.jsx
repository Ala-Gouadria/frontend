import { useId } from 'react'
import './AreaRevenueChart.css'

const defaultUpperSeries = [
  { x: 0, y: 78, tooltip: '+19%' },
  { x: 62, y: 58, tooltip: '+31%' },
  { x: 122, y: 28, tooltip: '+48%' },
  { x: 186, y: 64, tooltip: '+22%' },
  { x: 244, y: 42, tooltip: '+36%' },
  { x: 312, y: 68, tooltip: '+17%' },
  { x: 372, y: 28, tooltip: '+52%' },
]

const defaultLowerSeries = [
  { x: 0, y: 116 },
  { x: 62, y: 116 },
  { x: 122, y: 100 },
  { x: 186, y: 130 },
  { x: 244, y: 122 },
  { x: 312, y: 126 },
  { x: 372, y: 80 },
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

export function AreaRevenueChart({
  upperSeries = defaultUpperSeries,
  lowerSeries = defaultLowerSeries,
  activeIndex = 2,
  badge,
  title,
  tone = 'green',
  className = '',
}) {
  const gradientId = `area-revenue-gradient-${safeId(useId())}`
  const glowId = `area-revenue-glow-${safeId(useId())}`
  const activePoint = upperSeries[activeIndex] ?? upperSeries[0]
  const badgeText = badge ?? activePoint?.tooltip

  return (
    <div className={classNames('area-revenue-chart', `area-revenue-chart--${tone}`, className)}>
      {title ? <div className="area-revenue-chart__title">{title}</div> : null}
      <svg className="area-revenue-chart__svg" viewBox="0 0 372 140" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--area-revenue-top)" />
            <stop offset="100%" stopColor="var(--area-revenue-bottom)" />
          </linearGradient>
          <filter id={glowId} x="-12%" y="-28%" width="124%" height="156%">
            <feGaussianBlur stdDeviation="8" result="blur" />
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
        <polyline points={pointsToString(upperSeries)} className="area-revenue-chart__line" />
        <polyline points={pointsToString(lowerSeries)} className="area-revenue-chart__line area-revenue-chart__line--soft" />

        {activePoint ? <line x1={activePoint.x} x2={activePoint.x} y1="22" y2="135" className="area-revenue-chart__focus" /> : null}

        {upperSeries.map((point, index) => (
          <g key={`${point.x}-${point.y}`}>
            <circle cx={point.x} cy={point.y} r="3" className="area-revenue-chart__dot" />
            {lowerSeries[index] ? <circle cx={point.x} cy={lowerSeries[index].y} r="2.8" className="area-revenue-chart__dot" /> : null}
            <circle cx={point.x} cy={point.y} r="13" className="area-revenue-chart__hit">
              <title>{point.tooltip ?? `Point ${index + 1}: ${Math.round(140 - point.y)}`}</title>
            </circle>
          </g>
        ))}

        {activePoint && badgeText ? (
          <g transform={`translate(${activePoint.x}, ${activePoint.y + 36})`}>
            <rect x="-22" y="-12" width="44" height="24" rx="12" className="area-revenue-chart__badge" />
            <text textAnchor="middle" dy="4" className="area-revenue-chart__badge-text">
              {badgeText}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  )
}

export default AreaRevenueChart
