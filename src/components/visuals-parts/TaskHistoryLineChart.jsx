import './TaskHistoryLineChart.css'

const TONE_COLORS = {
  green: {
    fillStops: [
      { offset: '0%', color: 'rgba(176,211,28,0.34)' },
      { offset: '62%', color: 'rgba(176,211,28,0.11)' },
      { offset: '100%', color: 'rgba(255,255,255,0)' },
    ],
    lineStops: null,
    line: '#9fbe18',
    lineGlow: 'rgba(160,200,20,0.18)',
    badge: '#b5d42d',
  },
  red: {
    fillStops: [
      { offset: '0%', color: 'rgba(238,100,98,0.30)' },
      { offset: '62%', color: 'rgba(238,100,98,0.10)' },
      { offset: '100%', color: 'rgba(255,255,255,0)' },
    ],
    lineStops: null,
    line: '#ef6a66',
    lineGlow: 'rgba(238,100,98,0.20)',
    badge: '#ef6a66',
  },
  blue: {
    fillStops: [
      { offset: '0%', color: 'rgba(24,119,242,0.42)' },
      { offset: '60%', color: 'rgba(24,119,242,0.18)' },
      { offset: '100%', color: 'rgba(24,119,242,0.07)' },
    ],
    lineStops: [
      { offset: '3.59%', color: '#1877F2' },
      { offset: '94.78%', color: '#6DA3FF' },
    ],
    line: '#1877F2',
    lineGlow: 'rgba(24,119,242,0.18)',
    badge: '#1877F2',
  },
}

export function TaskHistoryLineChart({ data, tone = 'green', className = '' }) {
  const safeData = Array.isArray(data)
    ? data.map(Number).filter(Number.isFinite)
    : []

  if (safeData.length < 2) return null

  const palette = TONE_COLORS[tone] ?? TONE_COLORS.green
  const width = 520
  const height = 170
  const paddingTop = 8
  const paddingBottom = 10
  const min = Math.min(...safeData)
  const max = Math.max(...safeData)
  const usableHeight = height - paddingTop - paddingBottom
  const step = width / (safeData.length - 1)
  const normalizeY = (value) => (
    max === min
      ? paddingTop + usableHeight / 2
      : paddingTop + usableHeight - ((value - min) / (max - min)) * usableHeight
  )

  const points = safeData.map((value, index) => ({
    x: index * step,
    y: normalizeY(value),
    value,
  }))

  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = points[index - 1]
    const tension = 0.3
    const dx = point.x - previous.x
    const cp1x = previous.x + dx * tension
    const cp2x = point.x - dx * tension
    return `${path} C ${cp1x} ${previous.y} ${cp2x} ${point.y} ${point.x} ${point.y}`
  }, '')

  const areaPath = `${linePath} L ${points.at(-1).x} ${height} L ${points[0].x} ${height} Z`
  const badgeIndex = Math.max(safeData.length - 7, 1)
  const badgePoint = points[badgeIndex]
  const endPoint = points.at(-1)
  const lineStroke = palette.lineStops ? 'url(#taskHistoryLine)' : palette.line

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`task-history-line-chart ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="taskHistoryFill" x1="0" y1="0" x2="0" y2="1">
          {palette.fillStops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        {palette.lineStops && (
          <linearGradient id="taskHistoryLine" x1="0" y1="0" x2="1" y2="0">
            {palette.lineStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        )}
        <filter id="taskHistoryGlow" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={areaPath} fill="url(#taskHistoryFill)" className="task-history-line-chart__area" />
      <path d={linePath} fill="none" stroke={palette.lineGlow} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="url(#taskHistoryGlow)" />
      <path d={linePath} pathLength="100" fill="none" stroke={lineStroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="task-history-line-chart__line" />

      <g transform={`translate(${badgePoint.x},${badgePoint.y})`} className="task-history-line-chart__badge">
        <circle r="17" fill={palette.badge} />
        <text y="5" textAnchor="middle">{badgePoint.value}</text>
      </g>

      <circle cx={endPoint.x} cy={endPoint.y} r="9" fill="#fff" className="task-history-line-chart__end-ring" />
      <circle cx={endPoint.x} cy={endPoint.y} r="4" fill={palette.line} />

      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="14"
          fill="transparent"
          className="task-history-line-chart__hit"
        >
          <title>Point {index + 1}: {point.value}</title>
        </circle>
      ))}
    </svg>
  )
}

export default TaskHistoryLineChart
