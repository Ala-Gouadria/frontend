import { useId } from 'react'
import './MiniLineChart.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function parsePoints(points) {
  return String(points)
    .trim()
    .split(/\s+/)
    .map((pair, index) => {
      const [x, y] = pair.split(',').map(Number)
      return { x, y, index }
    })
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
}

function safeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '')
}

function buildSmoothPath(points) {
  if (points.length === 0) {
    return ''
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const current = points[index]
    const next = points[index + 1]
    const afterNext = points[index + 2] ?? next
    const tension = 0.38

    const cp1x = current.x + (next.x - previous.x) * tension
    const cp1y = current.y + (next.y - previous.y) * tension
    const cp2x = next.x - (afterNext.x - current.x) * tension
    const cp2y = next.y - (afterNext.y - current.y) * tension

    path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`
  }

  return path
}

export function MiniLineChart({
  points = '0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40',
  fillPoints = '0,64 0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40 172,64',
  tooltips,
  tone = 'green',
  className = '',
}) {
  const uid = safeId(useId())
  const gradientId = `mini-line-gradient-${uid}`
  const strokeGradientId = `mini-line-stroke-${uid}`
  const innerShadowId = `mini-line-inner-shadow-${uid}`
  const parsedPoints = parsePoints(points)
  const linePath = buildSmoothPath(parsedPoints)
  const baseline = 58
  const fillPath = parsedPoints.length
    ? `${linePath} L ${parsedPoints[parsedPoints.length - 1].x} ${baseline} L ${parsedPoints[0].x} ${baseline} Z`
    : ''

  return (
    <svg
      className={classNames('mini-line-chart', `mini-line-chart--${tone}`, className)}
      viewBox="0 0 172 58"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="8.39%" stopColor="var(--mini-line-fill-top)" />
          <stop offset="70.23%" stopColor="var(--mini-line-fill-bottom)" />
        </linearGradient>
        <linearGradient id={strokeGradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--mini-line-stroke-start)" />
          <stop offset="100%" stopColor="var(--mini-line-stroke-end)" />
        </linearGradient>
        <filter id={innerShadowId} x="-5%" y="-5%" width="110%" height="110%">
          <feFlood result="flood" floodColor="#FFFFFF" floodOpacity="1" />
          <feComposite in="flood" in2="SourceAlpha" operator="in" result="masked" />
          <feOffset dx="0" dy="4" result="offset" />
          <feGaussianBlur stdDeviation="4.4" in="offset" result="blurred" />
          <feComposite in="blurred" in2="SourceAlpha" operator="in" result="clipped" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="clipped" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={fillPath || fillPoints}
        className="mini-line-chart__fill"
        style={{ fill: `url(#${gradientId})`, filter: `url(#${innerShadowId})` }}
        vectorEffect="non-scaling-stroke"
      />
      <path d={linePath} className="mini-line-chart__line" style={{ stroke: `url(#${strokeGradientId})` }} vectorEffect="non-scaling-stroke" />
      {parsedPoints.map((point) => (
        <circle
          key={`${point.x}-${point.y}-${point.index}`}
          cx={point.x}
          cy={point.y}
          r="6"
          className="mini-line-chart__hit"
        >
          <title>{tooltips?.[point.index] ?? `Point ${point.index + 1}: ${Math.round(58 - point.y)}`}</title>
        </circle>
      ))}
    </svg>
  )
}

export default MiniLineChart
