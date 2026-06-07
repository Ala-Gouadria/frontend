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
  cy: 230,
  rx: 242,
  ry: 168,
  startAngle: 160 * (Math.PI / 180),
  endAngle: 20 * (Math.PI / 180),
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
  const tickLength = 20
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
      <svg className="semi-circle-gauge__svg" viewBox="0 0 510 260" aria-hidden="true">
        <defs>
          {/* Horizontal fade — band dissolves to nothing at both ends */}
          <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="510" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="7%" stopColor="white" stopOpacity="0.12" />
            <stop offset="15%" stopColor="white" stopOpacity="0.5" />
            <stop offset="26%" stopColor="white" stopOpacity="0.92" />
            <stop offset="34%" stopColor="white" stopOpacity="1" />
            <stop offset="72%" stopColor="white" stopOpacity="1" />
            <stop offset="83%" stopColor="white" stopOpacity="0.7" />
            <stop offset="92%" stopColor="white" stopOpacity="0.3" />
            <stop offset="98%" stopColor="white" stopOpacity="0.06" />
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
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-80" y="-80" width="670" height="400">
            <rect x="-80" y="-80" width="670" height="400" fill={'url(#' + fadeId + ')'} />
          </mask>
        </defs>

        <g mask={'url(#' + maskId + ')'}>
          {/* Soft track — full arc, pale ghost behind the progress */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth="40"
            strokeLinecap="round"
            style={{ filter: 'blur(6px)' }}
          />
          {/* Crisp track line */}
          <path
            d={pathData}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth="36"
            strokeLinecap="butt"
          />

          {/* Progress soft glow — subtle spread behind the band */}
          <path
            d={pathData}
            fill="none"
            stroke={'url(#' + progGradId + ')'}
            strokeWidth="52"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={dash}
            style={{ filter: 'blur(12px)', opacity: 0.4 }}
          />
          {/* Progress fill — main band */}
          <path
            d={pathData}
            fill="none"
            stroke={'url(#' + progGradId + ')'}
            strokeWidth="36"
            strokeLinecap="butt"
            pathLength="100"
            strokeDasharray={dash}
            className="semi-circle-gauge__progress"
          />
          {/* Inner highlight — thin bright line along the inside edge */}
          <path
            d={pathData}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.4"
            strokeLinecap="butt"
            pathLength="100"
            strokeDasharray={dash}
          />

          {/* Perpendicular tick dividers across the filled band */}
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
                  stroke="rgba(255,255,255,0.56)"
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
          r="30"
          className="semi-circle-gauge__cap-ring"
        />
        <circle
          cx={capPosition.x}
          cy={capPosition.y}
          r="20"
          fill={'url(#' + knobGradId + ')'}
          className="semi-circle-gauge__cap"
        />

        {/* Value label */}
        <text x="255" y="210" textAnchor="middle" className="semi-circle-gauge__value">
          <tspan className="semi-circle-gauge__current">{currentLabel}</tspan>
          {targetLabel ? <tspan className="semi-circle-gauge__target">/{targetLabel}</tspan> : null}
        </text>
      </svg>
    </div>
  )
}

export default SemiCircleGauge