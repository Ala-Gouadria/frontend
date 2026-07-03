import './ActivityRings.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value) {
  return Math.max(0, Math.min(value, 1))
}

export function ActivityRings({
  rings = [
    { id: 'ring-1', progress: 0.78 },
    { id: 'ring-2', progress: 0.68 },
    { id: 'ring-3', progress: 0.22, tone: 'soft' },
    { id: 'ring-4', progress: 0.72 },
    { id: 'ring-5', progress: 0.18, tone: 'soft' },
  ],
  className = '',
}) {
  return (
    <div className={classNames('activity-rings', className)}>
      {rings.map((ring, index) => (
        <span
          key={ring.id ?? `ring-${index}`}
          className={classNames('activity-rings__ring', ring.tone && `activity-rings__ring--${ring.tone}`)}
          style={{ '--ring-progress': `${clamp(ring.progress ?? 0.75) * 360}deg`, '--ring-index': index }}
          title={`${ring.id ?? `Campaign ${index + 1}`}: ${Math.round(clamp(ring.progress ?? 0.75) * 100)}%`}
        />
      ))}
    </div>
  )
}

export default ActivityRings
