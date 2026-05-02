import './StripedBars.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value) {
  return Math.max(0, Math.min(value, 100))
}

export function StripedBars({
  value = 70,
  label,
  endLabel,
  tone = 'green',
  className = '',
}) {
  const safeValue = clamp(value)

  return (
    <div className={classNames('striped-bars', `striped-bars--${tone}`, className)}>
      {label || endLabel ? (
        <div className="striped-bars__head">
          <span>{label}</span>
          <strong>{endLabel}</strong>
        </div>
      ) : null}
      <div
        className="striped-bars__track"
        title={`${label ?? 'Value'}: ${endLabel ?? `${safeValue}%`}`}
      >
        <span className="striped-bars__fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  )
}

export default StripedBars