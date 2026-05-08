import './MiniBarChart.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function MiniBarChart({
  bars = [22, 66, 34, 80, 26, 54, 72, 38, 58, 46, 24, 28, 64, 18],
  tone = 'ink',
  className = '',
}) {
  const maxBar = Math.max(...bars, 1)
  const rowCount = 9
  const columnGap = 8.45
  const dotGap = 5.35

  return (
    <svg className={classNames('mini-bar-chart', `mini-bar-chart--${tone}`, className)} viewBox="0 0 118 58" aria-hidden="true">
      {bars.slice(0, 14).map((bar, columnIndex) => {
        const visibleCount = Math.max(1, Math.round((bar / maxBar) * rowCount))

        return (
          <g key={`${bar}-${columnIndex}`}>
            {Array.from({ length: visibleCount }).map((_, rowIndex) => (
              <circle
                key={`${bar}-${columnIndex}-${rowIndex}`}
                cx={4 + columnIndex * columnGap}
                cy={53 - rowIndex * dotGap}
                r="1.28"
                className="mini-bar-chart__dot mini-bar-chart__dot--visible"
                style={{ '--bar-index': columnIndex }}
              >
                <title>{`Bar ${columnIndex + 1}: ${bar}`}</title>
              </circle>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default MiniBarChart
