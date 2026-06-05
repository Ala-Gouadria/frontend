import './TaskStatusMarks.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function TaskDashedRing({
  size = 22,
  strokeWidth = 2,
  className = '',
  title = 'Pending task',
}) {
  const radius = 10 - strokeWidth / 2

  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className={classNames('task-dashed-ring', className)}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray="3.2 4.2"
        strokeLinecap="round"
        className="task-dashed-ring__stroke"
      />
    </svg>
  )
}

export function TaskProgressRing({
  progress = 62,
  size = 26,
  strokeWidth = 4,
  className = '',
  title = 'Task progress',
}) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0))
  const radius = 18 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (safeProgress / 100) * circumference

  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      className={classNames('task-progress-ring', className)}
      role={title ? 'img' : undefined}
      aria-label={title ? `${title}: ${Math.round(safeProgress)}%` : undefined}
      aria-hidden={title ? undefined : true}
      style={{
        '--task-progress-ring-circumference': circumference,
        '--task-progress-ring-offset': dashOffset,
      }}
    >
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="task-progress-ring__track"
      />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        className="task-progress-ring__value"
      />
    </svg>
  )
}
