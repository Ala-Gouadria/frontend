import './DottedDataBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function densifyColumns(columns, targetLength = 14) {
  if (columns.length >= targetLength || columns.length === 0) {
    return columns
  }

  return Array.from({ length: targetLength }, (_, index) => {
    const position = (index / Math.max(targetLength - 1, 1)) * (columns.length - 1)
    const leftIndex = Math.floor(position)
    const rightIndex = Math.min(columns.length - 1, leftIndex + 1)
    const ratio = position - leftIndex
    const left = columns[leftIndex]
    const right = columns[rightIndex]
    const count = Math.round(left.count + (right.count - left.count) * ratio)

    return {
      ...left,
      label: `${left.label}-${index + 1}`,
      count: Math.max(1, count),
    }
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
  const normalizedColumns = densifyColumns(columns.map((column, index) =>
    typeof column === 'number' ? { label: `Point ${index + 1}`, count: column } : column,
  ))
  const maxCount = Math.max(...normalizedColumns.map((column) => column.count), 1)
  const rowCount = 9
  const columnGap = 8.45
  const dotGap = 5.35
  const width = 118
  const height = 58

  return (
    <svg className={classNames('dotted-data-bars', `dotted-data-bars--${tone}`, className)} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {normalizedColumns.map((column, columnIndex) => (
        <g key={column.label}>
          {Array.from({ length: rowCount }).map((_, rowIndex) => {
            const visibleCount = clamp(Math.round((column.count / maxCount) * rowCount), 1, rowCount)
            const visible = rowIndex < visibleCount
            const x = 4 + columnIndex * columnGap
            const y = height - 5 - rowIndex * dotGap

            return visible ? (
              <circle
                key={`${column.label}-${rowIndex}`}
                cx={x}
                cy={y}
                r="1.28"
                className="dotted-data-bars__dot dotted-data-bars__dot--visible"
                style={{ '--dot-index': rowIndex }}
              >
                <title>{`${column.label}: ${column.value ?? column.count}`}</title>
              </circle>
            ) : null
          })}
        </g>
      ))}
    </svg>
  )
}

export default DottedDataBars
