import { useId } from 'react'
import './SemiCircleGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value, min, max, fallback = min) {
  const number = Number(value)
  const safeValue = Number.isFinite(number) ? number : fallback
  return Math.max(min, Math.min(safeValue, max))
}

const ARC = {
  cx: 255,
  cy: 262,
  rx: 242,
  ry: 242,
  startAngle: 155 * (Math.PI / 180),
  endAngle: 25 * (Math.PI / 180),
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
  const length = Math.hypot(tangent.x, tangent.y) || 1
  const normal = { x: -tangent.y / length, y: tangent.x / length }
const tickLength = 28
  return {
    x1: point.x - normal.x * tickLength / 2,
    y1: point.y - normal.y * tickLength / 2,
    x2: point.x + normal.x * tickLength / 2,
    y2: point.y + normal.y * tickLength / 2,
  }
}

function getPathData() {
  const start = getArcPoint(0)
  const end = getArcPoint(1)
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const TICK_PROGRESS = Array.from({ length: 32 }, (_, i) => (i + 1) / 34)

export function SemiCircleGauge({
  current = 578,
  target = 700,
  progress,
  label,
  title,
  tone = 'green',
  className = '',
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const clipId = 'c' + id
  const maskId = 'm' + id
  const gradId = 'g' + id

  const safeTarget = Number(target)
  const derivedProgress = Number.isFinite(safeTarget) && safeTarget !== 0 ? Number(current) / safeTarget : 0
  const safeProgress = clamp(progress ?? derivedProgress, 0, 1)
  const capPosition = getArcPoint(safeProgress)
  const pathData = getPathData()
  const progressTicks = TICK_PROGRESS.filter(tp => tp <= safeProgress + 0.014)
  const valueLabel = label ?? `${current}/${target}`
  const [currentLabel, targetLabel] = valueLabel.split('/')

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}
      <svg
        className="semi-circle-gauge__svg"
        viewBox="0 0 510 256"
        aria-hidden="true"
      >
        <defs>
          {/* Clip path spans full track width so ticks cover entire filled band */}
         <g clipPath={'url(#' + clipId + ')'}>
  {TICK_PROGRESS.filter(tp => tp <= safeProgress + 0.014).map(tp => {
    const tick = getTickLine(tp)
    return (
      <line
        key={tp}
        x1={tick.x1} y1={tick.y1}
        x2={tick.x2} y2={tick.y2}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeLinecap="butt"
      />
    )
  })}
</g>

          {/* Horizontal fade gradient — transparent at both ends */}
          <linearGradient
  id={gradId}
  gradientUnits="userSpaceOnUse"
  x1="0"
  y1="0"
  x2="510"
  y2="0"
>
  <stop offset="0%" stopColor="white" stopOpacity="0" />
  <stop offset="8%" stopColor="white" stopOpacity="0.08" />
  <stop offset="16%" stopColor="white" stopOpacity="0.35" />
  <stop offset="24%" stopColor="white" stopOpacity="0.75" />
  <stop offset="32%" stopColor="white" stopOpacity="1" />

  <stop offset="72%" stopColor="white" stopOpacity="1" />

  <stop offset="84%" stopColor="white" stopOpacity="0.75" />
  <stop offset="92%" stopColor="white" stopOpacity="0.35" />
  <stop offset="97%" stopColor="white" stopOpacity="0.08" />
  <stop offset="100%" stopColor="white" stopOpacity="0" />
</linearGradient>

          {/* Mask covers viewBox + overflow to catch glow bleed */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-60" y="-60" width="630" height="380">
            <rect x="-60" y="-60" width="630" height="380" fill={'url(#' + gradId + ')'} />
          </mask>
        </defs>

        <g mask={'url(#' + maskId + ')'}>

          {/* Soft outer glow */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-glow)"
            strokeWidth="70"
            strokeLinecap="butt"
           style={{
  filter: 'blur(38px)',
  opacity: 0.18
}}
          />

          {/* Pale background track */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth="54"
            strokeLinecap="butt"
          />

          {/* Green progress fill */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-progress)"
            strokeWidth="28"
            strokeLinecap="butt"
            pathLength="100"
            strokeDasharray={safeProgress * 100 + ' 100'}
            className="semi-circle-gauge__progress"
          />

          {/* Perpendicular tick dividers clipped to progress + full track width */}
          <g clipPath={'url(#' + clipId + ')'}>
            {progressTicks.map(tp => {
              const tick = getTickLine(tp)
              return (
                <line
                  key={tp}
                  x1={tick.x1} y1={tick.y1}
                  x2={tick.x2} y2={tick.y2}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeLinecap="butt"
                />
              )
            })}
          </g>

        </g>

        {/* Knob — outside mask, always fully visible */}
        <circle cx={capPosition.x} cy={capPosition.y} r="22" className="semi-circle-gauge__cap-ring" />
        <circle cx={capPosition.x} cy={capPosition.y} r="15" className="semi-circle-gauge__cap" />

        {/* Value label */}
        <text x="255" y="148" textAnchor="middle" className="semi-circle-gauge__value">
          <tspan className="semi-circle-gauge__current">{currentLabel}</tspan>
          {targetLabel ? <tspan className="semi-circle-gauge__target">/{targetLabel}</tspan> : null}
        </text>
      </svg>
    </div>
  )
}

export default SemiCircleGauge
