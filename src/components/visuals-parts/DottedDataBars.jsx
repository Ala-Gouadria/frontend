import './DottedDataBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function densifyColumns(columns, targetLength = 10) {
  // Resample to a fixed column count — both up-sampling sparse series and
  // down-sampling dense ones (e.g. the 14-point revenue series) so every chart
  // renders the same compact set of clearly separated columns.
  if (columns.length === targetLength || columns.length === 0) return columns

  return Array.from({ length: targetLength }, (_, index) => {
    const position   = (index / Math.max(targetLength - 1, 1)) * (columns.length - 1)
    const leftIndex  = Math.floor(position)
    const rightIndex = Math.min(columns.length - 1, leftIndex + 1)
    const ratio      = position - leftIndex
    const left       = columns[leftIndex]
    const right      = columns[rightIndex]
    const count      = Math.round(left.count + (right.count - left.count) * ratio)

    return { ...left, label: `${left.label}-${index + 1}`, count: Math.max(1, count) }
  })
}

export function DottedDataBars({
  columns = [
    { label: 'Mon', count: 3 },
    { label: 'Tue', count: 6 },
    { label: 'Wed', count: 4 },
    { label: 'Thu', count: 3 },
    { label: 'Fri', count: 5 },
    { label: 'Sat', count: 4 },
  ],
  tone = 'ink',
  className = '',
}) {
  const normalizedColumns = densifyColumns(
    columns.map((col, i) =>
      typeof col === 'number' ? { label: `Point ${i + 1}`, count: col } : col
    )
  )

  const maxCount    = Math.max(...normalizedColumns.map(c => c.count), 1)
  const DOT_RADIUS  = 0.7     // dot radius (viewBox units)
  const ROW_COUNT   = 7
  const COL_GAP     = 4.6     // horizontal distance between column centres
  const DOT_GAP     = 4.0     // vertical distance between dot centres
  const PAD_X       = DOT_RADIUS + 1
  const PAD_Y       = DOT_RADIUS + 1
  const WIDTH       = COL_GAP * (normalizedColumns.length - 1) + PAD_X * 2 + DOT_RADIUS * 2
  const HEIGHT      = DOT_GAP * (ROW_COUNT - 1) + PAD_Y * 2 + DOT_RADIUS * 2

  return (
    <svg
      className={classNames('dotted-data-bars', `dotted-data-bars--${tone}`, className)}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {normalizedColumns.map((column, colIdx) => {
        const visibleCount = clamp(
          Math.round((column.count / maxCount) * ROW_COUNT),
          1,
          ROW_COUNT
        )
        const cx = PAD_X + DOT_RADIUS + colIdx * COL_GAP

        return (
          <g key={column.label}>
            {Array.from({ length: visibleCount }).map((_, rowIdx) => {
              const cy = HEIGHT - PAD_Y - DOT_RADIUS - rowIdx * DOT_GAP

              return (
                <circle
                  key={`${column.label}-${rowIdx}`}
                  cx={cx}
                  cy={cy}
                  r={DOT_RADIUS}
                  className="dotted-data-bars__dot dotted-data-bars__dot--visible"
                  style={{ '--dot-index': rowIdx }}
                >
                  <title>{`${column.label}: ${column.value ?? column.count}`}</title>
                </circle>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

export default DottedDataBars
