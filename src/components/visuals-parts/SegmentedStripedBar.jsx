import './SegmentedStripedBar.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value) {
  return Math.max(0, Math.min(value, 100))
}

export function SegmentedStripedBar({
  value = 60,
  segments = 5,
  activeSegments,
  label,
  tone = 'blue',
  className = '',
}) {
  const safeValue = clamp(value)
  const activeCount = activeSegments ?? Math.round((safeValue / 100) * segments)

  return (
    <div
      className={classNames('segmented-striped-bar', `segmented-striped-bar--${tone}`, className)}
      data-tooltip={label ?? `${safeValue}%`}
      style={{ '--bar-segments': segments }}
      title={label ?? `${safeValue}%`}
    >
      {Array.from({ length: segments }).map((_, index) => (
        <span
          key={`segment-${index}`}
          className={classNames(
            'segmented-striped-bar__segment',
            index < activeCount && 'segmented-striped-bar__segment--active',
          )}
          style={{ '--segment-index': index }}
        />
      ))}
    </div>
  )
}

export default SegmentedStripedBar
