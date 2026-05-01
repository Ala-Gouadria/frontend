import './SemiCircleGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function getArcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

export function SemiCircleGauge({
  current = 578,
  target = 700,
  progress,
  label,
  title,
  tone = 'green',
  className = '',
}) {
  const safeProgress = clamp(progress ?? (target ? current / target : 0), 0, 1)
  const capPosition = getArcPoint(180, 160, 148, safeProgress)
  const valueLabel = label ?? `${current}/${target}`

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}
      <svg className="semi-circle-gauge__svg" viewBox="0 0 360 186" aria-hidden="true">
        <path d="M 32 160 A 148 148 0 0 1 328 160" className="semi-circle-gauge__glow" />
        <path d="M 32 160 A 148 148 0 0 1 328 160" className="semi-circle-gauge__track" />
        <path
          d="M 32 160 A 148 148 0 0 1 328 160"
          className="semi-circle-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />
        <circle cx={capPosition.x} cy={capPosition.y} r="16" className="semi-circle-gauge__cap" />
      </svg>
      <strong className="semi-circle-gauge__value">{valueLabel}</strong>
    </div>
  )
}

export default SemiCircleGauge
