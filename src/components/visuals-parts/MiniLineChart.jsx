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

export function MiniLineChart({
  points = '0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40',
  fillPoints = '0,64 0,44 12,54 24,52 36,28 48,24 60,36 72,34 84,38 96,36 108,40 120,38 132,40 146,24 160,16 172,40 172,64',
  tooltips,
  tone = 'green',
  className = '',
}) {
  const parsedPoints = parsePoints(points)

  return (
    <svg className={classNames('mini-line-chart', `mini-line-chart--${tone}`, className)} viewBox="0 0 194 58" aria-hidden="true">
      <polygon points={fillPoints} className="mini-line-chart__fill" />
      <polyline points={points} className="mini-line-chart__line" />
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
