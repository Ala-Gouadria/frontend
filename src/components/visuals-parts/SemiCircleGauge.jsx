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
  cy: 260,
  rx: 230,
  ry: 210,
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
  const tickLength = 14
  return {
    x1: point.x - (normal.x * tickLength) / 2,
    y1: point.y - (normal.y * tickLength) / 2,
    x2: point.x + (normal.x * tickLength) / 2,
    y2: point.y + (normal.y * tickLength) / 2,
  }
}

function getPathData() {
  const start = getArcPoint(0)
  const end = getArcPoint(1)
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const TICK_PROGRESS = Array.from({ length: 18 }, (_, i) => (i + 1) / 20)

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
  const maskId = 'm' + id
  const fadeId = 'f' + id
  const progGradId = 'p' + id
  const knobGradId = 'k' + id

  const safeTarget = Number(target)
  const derivedProgress =
    Number.isFinite(safeTarget) && safeTarget !== 0 ? Number(current) / safeTarget : 0
  const safeProgress = clamp(progress ?? derivedProgress, 0, 1)
  const capPosition = getArcPoint(safeProgress)
  const pathData = getPathData()
  const progressTicks = TICK_PROGRESS.filter((tp) => tp <= safeProgress + 0.014)
  const valueLabel = label ?? `${current}/${target}`
  const [currentLabel, targetLabel] = valueLabel.split('/')
  const dash = `${safeProgress * 100} 100`

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}
      <svg className="semi-circle-gauge__svg" viewBox="0 0 510 310" aria-hidden="true">
        <defs>
          {/* Horizontal fade — band dissolves to nothing at both ends */}
          <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="510" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor="white" stopOpacity="0.08" />
            <stop offset="12%" stopColor="white" stopOpacity="0.4" />
            <stop offset="22%" stopColor="white" stopOpacity="0.85" />
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="75%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="0.6" />
            <stop offset="93%" stopColor="white" stopOpacity="0.2" />
            <stop offset="98%" stopColor="white" stopOpacity="0.04" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Progress band gradient — pale lime → vivid lime → deep lime */}
          <linearGradient id={progGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="510" y2="0">
            <stop offset="0%" stopColor="var(--gauge-progress-0)" />
            <stop offset="16%" stopColor="var(--gauge-progress-1)" />
            <stop offset="42%" stopColor="var(--gauge-progress-2)" />
            <stop offset="70%" stopColor="var(--gauge-progress-3)" />
            <stop offset="100%" stopColor="var(--gauge-progress-4)" />
          </linearGradient>

          {/* Knob fill — soft translucent radial */}
          <radialGradient id={knobGradId} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="var(--gauge-knob-0)" />
            <stop offset="55%" stopColor="var(--gauge-knob-1)" />
            <stop offset="100%" stopColor="var(--gauge-knob-2)" />
          </radialGradient>

          {/* Mask spans viewBox + overflow so glow bleed is caught and faded */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-60" y="-60" width="630" height="430">
            <rect x="-60" y="-60" width="630" height="430" fill={'url(#' + fadeId + ')'} />
          </mask>
        </defs>

        <g mask={'url(#' + maskId + ')'}>
          {/* Soft blurred track — pale band behind everything */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth="46"
            strokeLinecap="round"
            style={{ filter: 'blur(10px)' }}
          />
          {/* Crisp track */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth="32"
            strokeLinecap="butt"
          />

          {/* Progress soft glow */}
          <path
            d={pathData}
            fill="none"
            stroke={'url(#' + progGradId + ')'}
            strokeWidth="46"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={dash}
            style={{ filter: 'blur(10px)', opacity: 0.3 }}
          />
          {/* Progress fill — main band */}
          <path
            d={pathData}
            fill="none"
            stroke={'url(#' + progGradId + ')'}
            strokeWidth="32"
            strokeLinecap="butt"
            pathLength="100"
            strokeDasharray={dash}
            className="semi-circle-gauge__progress"
          />
          {/* Inner-edge highlight — soft lighter band on the inside of the arc */}
          <path
            d={pathData}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="12"
            strokeLinecap="butt"
            pathLength="100"
            strokeDasharray={dash}
            style={{ filter: 'blur(3px)' }}
          />

          {/* Tick dividers */}
          <g>
            {progressTicks.map((tp) => {
              const tick = getTickLine(tp)
              return (
                <line
                  key={tp}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.8"
                  strokeLinecap="butt"
                />
              )
            })}
          </g>
        </g>

        {/* Knob — outside the mask, always fully visible */}
        <circle
          cx={capPosition.x}
          cy={capPosition.y}
          r="26"
          className="semi-circle-gauge__cap-ring"
        />
        <circle
          cx={capPosition.x}
          cy={capPosition.y}
          r="17"
          fill={'url(#' + knobGradId + ')'}
          className="semi-circle-gauge__cap"
        />

        {/* Value label */}
        <text x="255" y="265" textAnchor="middle" className="semi-circle-gauge__value">
          <tspan className="semi-circle-gauge__current">{currentLabel}</tspan>
          {targetLabel ? <tspan className="semi-circle-gauge__target">/{targetLabel}</tspan> : null}
        </text>
      </svg>
    </div>
  )
}

export default SemiCircleGauge
