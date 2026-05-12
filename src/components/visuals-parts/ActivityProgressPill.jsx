import './ActivityProgressPill.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clampPercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(number, 100))
}

export function ActivityProgressPill({
  label,
  progress = 0,
  value = `${progress}%`,
  className = '',
}) {
  const safeProgress = clampPercent(progress)

  return (
    <div
      className={classNames('activity-progress-pill', className)}
      role="progressbar"
      aria-valuenow={safeProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${safeProgress}%`}
      style={{ '--activity-progress-start': `${100 - safeProgress}%` }}
    >
      <span className="activity-progress-pill__dot" />
      <span className="activity-progress-pill__label">{label}</span>
      <span className="activity-progress-pill__value">{value}</span>
    </div>
  )
}

export default ActivityProgressPill
