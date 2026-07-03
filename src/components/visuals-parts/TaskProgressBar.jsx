import './TaskProgressBar.css'

function clamp(value) {
  return Math.max(0, Math.min(value, 100))
}

export function TaskProgressBar({
  value = 60,
  segments = 5,
  activeSegments,
  className = '',
}) {
  const safeValue = clamp(value)
  const activeCount = activeSegments ?? Math.round((safeValue / 100) * segments)

  return (
    <div className={`task-progress-bar ${className}`}>
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={`task-progress-bar__segment${i < activeCount ? ' task-progress-bar__segment--active' : ''}`}
        />
      ))}
    </div>
  )
}

export default TaskProgressBar
