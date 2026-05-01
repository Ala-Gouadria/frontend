import './ProgressBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value) {
  return Math.max(0, Math.min(value, 100))
}

export function ProgressBars({
  value = 55,
  label,
  endLabel,
  tone = 'green',
  cap = true,
  className = '',
}) {
  const safeValue = clamp(value)

  return (
    <div className={classNames('progress-bars', `progress-bars--${tone}`, className)}>
      {label || endLabel ? (
        <div className="progress-bars__head">
          <span>{label}</span>
          <strong>{endLabel ?? `${safeValue}%`}</strong>
        </div>
      ) : null}
      <div className="progress-bars__track" title={`${label ?? 'Progress'}: ${endLabel ?? `${safeValue}%`}`}>
        <span className="progress-bars__fill" style={{ width: `${safeValue}%` }} />
        {cap ? <span className="progress-bars__cap" style={{ left: `${safeValue}%` }} /> : null}
      </div>
    </div>
  )
}

export default ProgressBars
