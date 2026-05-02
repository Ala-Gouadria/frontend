import './DottedDataBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
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
  const normalizedColumns = columns.map((column, index) =>
    typeof column === 'number' ? { label: `Point ${index + 1}`, count: column } : column,
  )
  const maxCount = Math.max(...normalizedColumns.map((column) => column.count), 1)
  const columnGap = normalizedColumns.length > 8 ? 8 : 12
  const dotGap = maxCount > 6 ? 4 : 5
  const width = Math.max(72, 8 + (normalizedColumns.length - 1) * columnGap + 8)
  const height = Math.max(36, 7 + maxCount * dotGap)

  return (
    <svg className={classNames('dotted-data-bars', `dotted-data-bars--${tone}`, className)} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {normalizedColumns.map((column, columnIndex) => (
        <g key={column.label}>
          {Array.from({ length: maxCount }).map((_, rowIndex) => {
            const visible = rowIndex < column.count
            const x = 4 + columnIndex * columnGap
            const y = height - 6 - rowIndex * dotGap

            return (
              <circle
                key={`${column.label}-${rowIndex}`}
                cx={x}
                cy={y}
                r="1.35"
                className={classNames('dotted-data-bars__dot', visible && 'dotted-data-bars__dot--visible')}
                style={{ '--dot-index': rowIndex }}
              >
                <title>{`${column.label}: ${column.value ?? column.count}`}</title>
              </circle>
            )
          })}
        </g>
      ))}
    </svg>
  )
}

export default DottedDataBars
