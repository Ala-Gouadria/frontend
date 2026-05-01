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
  const maxCount = Math.max(...columns.map((column) => column.count), 1)

  return (
    <svg className={classNames('dotted-data-bars', `dotted-data-bars--${tone}`, className)} viewBox="0 0 108 34" aria-hidden="true">
      {columns.map((column, columnIndex) => (
        <g key={column.label}>
          {Array.from({ length: maxCount }).map((_, rowIndex) => {
            const visible = rowIndex < column.count
            const x = 10 + columnIndex * 14
            const y = 25 - rowIndex * 4

            return (
              <circle
                key={`${column.label}-${rowIndex}`}
                cx={x}
                cy={y}
                r="1.3"
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
