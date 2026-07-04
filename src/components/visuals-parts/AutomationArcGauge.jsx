import './AutomationArcGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clampProgress(value, fallback = 0) {
  const n = Number(value)
  const v = Number.isFinite(n) ? n : fallback
  return Math.max(0, Math.min(v, 1))
}

function parseLabelParts(label) {
  const match = label.match(/^(\d+%)\s*(.*)$/)
  if (match) return { percent: match[1], rest: match[2] }
  return { percent: null, rest: label }
}

// ── Geometry: wide arched slice of an ellipse (matches Figma) ───────────────
const CX = 360
const CY = 245
const RX = 330
const RY = 215
const START_ANGLE = 158 * (Math.PI / 180)
const END_ANGLE   = 22  * (Math.PI / 180)

function arcPoint(progress, offset = 0) {
  const angle = START_ANGLE + (END_ANGLE - START_ANGLE) * progress
  return {
    x: CX + (RX + offset) * Math.cos(angle),
    y: CY - (RY + offset) * Math.sin(angle),
  }
}

// True outward normal at a point on the ellipse, so ticks sit perpendicular to
// the arc (evenly radial) instead of skewing/colliding near the ends.
function tickSegment(t, gap, len) {
  const a  = START_ANGLE + (END_ANGLE - START_ANGLE) * t
  const px = CX + RX * Math.cos(a)
  const py = CY - RY * Math.sin(a)
  let nx = RY * Math.cos(a)
  let ny = -RX * Math.sin(a)
  const m = Math.hypot(nx, ny) || 1
  nx /= m
  ny /= m
  const startD = HALF_STROKE + gap
  return {
    x1: px + nx * startD,
    y1: py + ny * startD,
    x2: px + nx * (startD + len),
    y2: py + ny * (startD + len),
  }
}

const ARC_START = arcPoint(0)
const ARC_END   = arcPoint(1)
const FULL_PATH = `M ${ARC_START.x.toFixed(2)} ${ARC_START.y.toFixed(2)} A ${RX} ${RY} 0 0 1 ${ARC_END.x.toFixed(2)} ${ARC_END.y.toFixed(2)}`

const HALF_STROKE = 8   // half of the 16px arc stroke
const TICK_COUNT  = 17
const TICK_GAP    = 14  // clear distance between the arc edge and tick start
const MAJOR_LEN   = 12  // progress-side tick length (short)
const MINOR_LEN   = 9   // unfilled-side tick length (short)

const LABEL_Y = 152  // text sits inside the bowl, just above the arc ends

const VIEW_BOX = '0 -8 720 196'

export function AutomationArcGauge({ progress = 0.7, label = '70% In Progress', detail, className = '' }) {
  const safeProgress = clampProgress(progress)
  const cap     = arcPoint(safeProgress)
  const tooltip = detail ?? `${label} • ${Math.round(safeProgress * 100)}%`
  const { percent, rest } = parseLabelParts(label)

  // Progress gradient runs from arc start (left) to the cap
  const gradStart = arcPoint(0)
  const gradEnd   = arcPoint(safeProgress)

  const dashFilled = `${safeProgress * 100} 100`

  return (
    <div className={classNames('automation-arc-gauge', className)} data-tooltip={tooltip} title={tooltip}>
      <svg
        className="automation-arc-gauge__svg"
        viewBox={VIEW_BOX}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* #2D7CFF at arc start → #64A6FF at cap position */}
          <linearGradient
            id="aaProgressGrad"
            x1={gradStart.x} y1={gradStart.y}
            x2={gradEnd.x}   y2={gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#2D7CFF" />
            <stop offset="100%" stopColor="#64A6FF" />
          </linearGradient>

        </defs>

        {/* ── Tick marks ─────────────────────────────────────────────────── */}
        {Array.from({ length: TICK_COUNT }).map((_, i) => {
          const t       = i / (TICK_COUNT - 1)
          const isMuted = t > safeProgress + 0.025
          const len     = isMuted ? MINOR_LEN : MAJOR_LEN
          const seg     = tickSegment(t, TICK_GAP, len)
          return (
            <line
              key={i}
              x1={seg.x1} y1={seg.y1}
              x2={seg.x2} y2={seg.y2}
              className={classNames(
                'automation-arc-gauge__tick',
                isMuted && 'automation-arc-gauge__tick--muted',
              )}
              style={{ '--tick-index': i }}
            />
          )
        })}

        {/* ── Background track (full arc, no glow) ─────────────────────── */}
        <path d={FULL_PATH} className="automation-arc-gauge__track" />

        {/* ── Progress arc (gradient + subtle glow) ────────────────────── */}
        <path
          d={FULL_PATH}
          className="automation-arc-gauge__progress"
          pathLength="100"
          strokeDasharray={dashFilled}
        />

        {/* ── Cap / knob ────────────────────────────────────────────────── */}
        <circle cx={cap.x} cy={cap.y} r="18" className="automation-arc-gauge__cap" />

        {/* ── Label ─────────────────────────────────────────────────────── */}
        <text x={CX} y={LABEL_Y} textAnchor="middle" className="automation-arc-gauge__label-svg">
          {percent && <tspan className="automation-arc-gauge__label-percent">{percent}</tspan>}
          {rest    && <tspan className="automation-arc-gauge__label-rest"> {rest}</tspan>}
        </text>
      </svg>
    </div>
  )
}

export default AutomationArcGauge
