import './TaskHistoryLineChart.css'

const TONE_COLORS = {
  green: {
    fillTop: 'rgba(176,211,28,0.34)',
    fillMid: 'rgba(176,211,28,0.11)',
    lineGlow: 'rgba(160,200,20,0.18)',
    line: '#9fbe18',
    badge: '#b5d42d',
  },
  red: {
    fillTop: 'rgba(238,100,98,0.30)',
    fillMid: 'rgba(238,100,98,0.10)',
    lineGlow: 'rgba(238,100,98,0.20)',
    line: '#ef6a66',
    badge: '#ef6a66',
  },
  blue: {
    fillTop: 'rgba(91,152,255,0.30)',
    fillMid: 'rgba(91,152,255,0.10)',
    lineGlow: 'rgba(91,152,255,0.18)',
    line: '#5b98ff',
    badge: '#5b98ff',
  },
}

export function TaskHistoryLineChart({ data, tone = 'green', className = '' }) {
  if (!data || data.length < 2) return null

  const palette = TONE_COLORS[tone] ?? TONE_COLORS.green
  const width = 520
  const height = 170
  const paddingTop = 14
  const paddingBottom = 26
  const min = Math.min(...data)
  const max = Math.max(...data)
  const usableHeight = height - paddingTop - paddingBottom
  const step = width / (data.length - 1)
  const normalizeY = (value) => (
    max === min
      ? paddingTop + usableHeight / 2
      : paddingTop + usableHeight - ((value - min) / (max - min)) * usableHeight
  )

  const points = data.map((value, index) => ({
    x: index * step,
    y: normalizeY(value),
    value,
  }))

  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = points[index - 1]
    const controlX = (previous.x + point.x) / 2
    return `${path} C ${controlX} ${previous.y} ${controlX} ${point.y} ${point.x} ${point.y}`
  }, '')

  const areaPath = `${linePath} L ${points.at(-1).x} ${height} L ${points[0].x} ${height} Z`
  const badgeIndex = Math.max(data.length - 7, 1)
  const badgePoint = points[badgeIndex]
  const endPoint = points.at(-1)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`task-history-line-chart ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="taskHistoryFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.fillTop} />
          <stop offset="62%" stopColor={palette.fillMid} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
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
      <path d={linePath} pathLength="100" fill="none" stroke={palette.line} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="task-history-line-chart__line" />

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