import { useId } from 'react'
import './SemiCircleGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

const ARC = {
  cx: 255,
  cy: 262,
  rx: 242,
  ry: 242,
  startAngle: 155 * (Math.PI / 180),
  endAngle:    25 * (Math.PI / 180),
}

function getArcAngle(progress) {
  return ARC.startAngle + (ARC.endAngle - ARC.startAngle) * progress
}

function getArcPoint(progress) {
  const angle = getArcAngle(progress)
  return {
    x: ARC.cx + ARC.rx * Math.cos(angle),
    y: ARC.cy - ARC.ry * Math.sin(angle),
  }
}

function getTickLine(progress) {
  const angle = getArcAngle(progress)
  const point = getArcPoint(progress)
  const tangent = { x: -ARC.rx * Math.sin(angle), y: -ARC.ry * Math.cos(angle) }
  const length  = Math.hypot(tangent.x, tangent.y) || 1
  const normal  = { x: -tangent.y / length, y: tangent.x / length }
  const tickLength = 22
  return {
    x1: point.x - normal.x * tickLength / 2,
    y1: point.y - normal.y * tickLength / 2,
    x2: point.x + normal.x * tickLength / 2,
    y2: point.y + normal.y * tickLength / 2,
  }
}

function getPathData() {
  const start = getArcPoint(0)
  const end   = getArcPoint(1)
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const TICK_PROGRESS = Array.from({ length: 44 }, (_, i) => (i + 1) / 46)

export function SemiCircleGauge({
  current = 578,
  target  = 700,
  progress,
  label,
  title,
  tone      = 'green',
  className = '',
}) {
  const reactId      = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const clipId       = `semi-gauge-progress-${reactId}`
  const stripeId     = `semi-gauge-stripe-${reactId}`
  const safeProgress = clamp(progress ?? (target ? current / target : 0), 0, 1)
  const capPosition  = getArcPoint(safeProgress)
  const pathData     = getPathData()
  const progressTicks = TICK_PROGRESS.filter(tp => tp <= safeProgress + 0.014)
  const valueLabel   = label ?? `${current}/${target}`
  const [currentLabel, targetLabel] = valueLabel.split('/')

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}
      <svg className="semi-circle-gauge__svg" viewBox="0 0 510 256" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <path d={pathData} className="semi-circle-gauge__clip-path" />
          </clipPath>
          {/* Vertical/radial segment pattern matching reference */}
          <pattern
            id={stripeId}
            patternUnits="userSpaceOnUse"
            width="9" height="9"
            patternTransform="rotate(72)"
          >
            <rect width="2"  height="9" fill="rgba(255,255,255,0.07)" />
            <rect x="2" width="2" height="9" fill="rgba(255,255,255,0.20)" />
          </pattern>
        </defs>

        {/* Diffuse outer glow on full arc */}
        <path d={pathData} className="semi-circle-gauge__glow" />

        {/* Pale background track — wider than progress = creates inset groove */}
        <path d={pathData} className="semi-circle-gauge__track" />

        {/* Progress fill — narrower, centered inside track */}
        <path
          d={pathData}
          className="semi-circle-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />

        {/* Stripe texture over progress only */}
        <path
          d={pathData}
          fill="none"
          stroke={`url(#${stripeId})`}
          strokeWidth="26"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />

        {/* Tick lines, clipped to progress region */}
        <g clipPath={`url(#${clipId})`}>
          {progressTicks.map(tp => {
            const tick = getTickLine(tp)
            return <line key={tp} {...tick} className="semi-circle-gauge__tick" />
          })}
        </g>

        {/* Knob — thin white ring + drop shadow */}
        <circle cx={capPosition.x} cy={capPosition.y} r="20" className="semi-circle-gauge__cap-ring" />
        <circle cx={capPosition.x} cy={capPosition.y} r="13" className="semi-circle-gauge__cap" />

        <text x="255" y="148" textAnchor="middle" className="semi-circle-gauge__value">
          <tspan className="semi-circle-gauge__current">{currentLabel}</tspan>
          {targetLabel ? <tspan className="semi-circle-gauge__target">/{targetLabel}</tspan> : null}
        </text>
      </svg>
    </div>
  )
}

export default SemiCircleGauge