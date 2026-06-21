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

/* Tall, well-curved elliptical arc. Coordinates live in a 720 x 320 viewBox. */
const ARC = {
  cx: 360,
  cy: 330,
  rx: 332,
  ry: 255,
  startAngle: 164 * (Math.PI / 180),
  endAngle: 16 * (Math.PI / 180),
}

const BAND_WIDTH = 40

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

// A short line perpendicular to the arc at the given progress — used for ticks.
function getTickLine(progress, length) {
  const angle = getArcAngle(progress)
  const point = getArcPoint(progress)
  const tangent = { x: -ARC.rx * Math.sin(angle), y: -ARC.ry * Math.cos(angle) }
  const norm = Math.hypot(tangent.x, tangent.y) || 1
  const normal = { x: -tangent.y / norm, y: tangent.x / norm }
  return {
    x1: point.x - (normal.x * length) / 2,
    y1: point.y - (normal.y * length) / 2,
    x2: point.x + (normal.x * length) / 2,
    y2: point.y + (normal.y * length) / 2,
  }
}

function getPathData() {
  const start = getArcPoint(0)
  const end = getArcPoint(1)
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

// Evenly spaced tick positions along the whole arc.
const TICK_COUNT = 26
const TICK_PROGRESS = Array.from({ length: TICK_COUNT - 1 }, (_, i) => (i + 1) / TICK_COUNT)

export function SemiCircleGauge({
  current = 578,
  target = 700,
  progress,
  label,
  title,
  tone = 'blue',
  bandWidth = 40,
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

  const pathData = getPathData()
  const knob = getArcPoint(safeProgress)
  const dash = `${safeProgress * 100} 100`

  const capRingR = Math.round(bandWidth * 0.54)
  const capR    = Math.round(bandWidth * 0.39)

  // Ticks only along the filled (progress) portion of the arc.
  const progressTicks = TICK_PROGRESS.filter((tp) => tp <= safeProgress + 0.01)

  const valueLabel = label ?? `${current}/${target}`
  const [currentLabel, targetLabel] = valueLabel.split('/')

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}

      <div className="semi-circle-gauge__chart">
        <svg className="semi-circle-gauge__svg" viewBox="0 0 720 320" aria-hidden="true">
          <defs>
            {/* Horizontal fade — gentle dissolve at both ends */}
            <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="5%"   stopColor="white" stopOpacity="0.5" />
              <stop offset="12%"  stopColor="white" stopOpacity="1" />
              <stop offset="88%"  stopColor="white" stopOpacity="1" />
              <stop offset="95%"  stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Progress band gradient — pale blue → vivid blue */}
            <linearGradient id={progGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%" stopColor="var(--gauge-progress-0)" />
              <stop offset="22%" stopColor="var(--gauge-progress-1)" />
              <stop offset="48%" stopColor="var(--gauge-progress-2)" />
              <stop offset="74%" stopColor="var(--gauge-progress-3)" />
              <stop offset="100%" stopColor="var(--gauge-progress-4)" />
            </linearGradient>

            {/* Knob — flat blue, only a faint top-to-bottom shade */}
            <linearGradient id={knobGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gauge-knob-1)" />
              <stop offset="100%" stopColor="var(--gauge-knob-2)" />
            </linearGradient>

            <mask id={maskId} maskUnits="userSpaceOnUse" x="-80" y="-80" width="880" height="460">
              <rect x="-80" y="-80" width="880" height="460" fill={'url(#' + fadeId + ')'} />
            </mask>
          </defs>

          {/* Blue glow layer — follows the arc band only */}
          <path
            d={pathData}
            fill="none"
            stroke="rgba(24, 119, 242, 0.20)"
            strokeWidth={bandWidth + 40}
            strokeLinecap="round"
            style={{ filter: 'blur(8px)' }}
          />

          <g mask={'url(#' + maskId + ')'}>
            {/* Background track — full arc in light blue, defines the gauge path */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--gauge-track)"
              strokeWidth={bandWidth + 10}
              strokeLinecap="round"
              style={{ filter: 'blur(5px)' }}
            />
            <path
              d={pathData}
              fill="none"
              stroke="var(--gauge-track)"
              strokeWidth={bandWidth}
              strokeLinecap="butt"
            />

            {/* Progress subtle glow */}
            <path
              d={pathData}
              fill="none"
              stroke={'url(#' + progGradId + ')'}
              strokeWidth={bandWidth + 10}
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={dash}
              style={{ filter: 'blur(7px)', opacity: 0.28 }}
            />
            {/* Progress main band */}
            <path
              d={pathData}
              fill="none"
              stroke={'url(#' + progGradId + ')'}
              strokeWidth={bandWidth}
              strokeLinecap="butt"
              pathLength="100"
              strokeDasharray={dash}
              className="semi-circle-gauge__progress"
            />

            {/* Tick dividers */}
            <g>
              {progressTicks.map((tp) => {
                const tick = getTickLine(tp, bandWidth - 4)
                return (
                  <line
                    key={tp}
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke="rgba(255, 255, 255, 0.10)"
                    strokeWidth="2.345"
                    strokeLinecap="butt"
                  />
                )
              })}
            </g>
          </g>

          {/* Knob — outside the mask, always fully visible */}
          <circle cx={knob.x} cy={knob.y} r={capRingR} className="semi-circle-gauge__cap-ring" />
          <circle
            cx={knob.x}
            cy={knob.y}
            r={capR}
            fill={'url(#' + knobGradId + ')'}
            className="semi-circle-gauge__cap"
          />
        </svg>

        <div className="semi-circle-gauge__value">
          <span className="semi-circle-gauge__current">{currentLabel}</span>
          {targetLabel ? <span className="semi-circle-gauge__target">/{targetLabel}</span> : null}
        </div>
      </div>
    </div>
  )
}

export default SemiCircleGauge
