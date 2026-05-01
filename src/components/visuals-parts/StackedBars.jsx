import './StackedBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function StackedBars({
  segments = [
    { label: 'Strong Hook', value: 25, tone: 'blue' },
    { label: 'Content', value: 35, tone: 'green' },
    { label: 'Add Resource', value: 40, tone: 'orange' },
  ],
  className = '',
}) {
  return (
    <div className={classNames('stacked-bars', className)}>
      {segments.map((segment, index) => (
        <span
          key={`${segment.label}-${index}`}
          className={classNames('stacked-bars__segment', `stacked-bars__segment--${segment.tone ?? 'green'}`)}
          style={{ width: `${segment.value}%`, '--segment-index': index }}
          title={segment.label}
        />
      ))}
    </div>
  )
}

export default StackedBars
