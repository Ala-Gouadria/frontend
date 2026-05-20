import './AutomationArcGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clampProgress(value, fallback = 0) {
  const number = Number(value)
  const safeValue = Number.isFinite(number) ? number : fallback
  return Math.max(0, Math.min(safeValue, 1))
}

function parseLabelParts(label) {
  const match = label.match(/^(\d+%)\s*(.*)$/)
  if (match) return { percent: match[1], rest: match[2] }
  return { percent: null, rest: label }
}

const CX = 180
const CY = 220
const R  = 210
const START_RAD = (205 * Math.PI) / 180
const END_RAD   = (335 * Math.PI) / 180
const SWEEP     = END_RAD - START_RAD

function arcPoint(progress, radius = R) {
  const a = START_RAD + progress * SWEEP
  return {
    x: CX + radius * Math.cos(a),
    y: CY + radius * Math.sin(a),
  }
}

const startPt    = arcPoint(0)
const endPt      = arcPoint(1)
const FULL_ARC   = `M ${startPt.x.toFixed(2)} ${startPt.y.toFixed(2)} A ${R} ${R} 0 0 1 ${endPt.x.toFixed(2)} ${endPt.y.toFixed(2)}`
const GRAD_START = arcPoint(0)
const GRAD_END   = arcPoint(0.7)
const TRACK_END  = arcPoint(1)
const TRACK_MID  = arcPoint(0.5)

const TICK_COUNT = 17
const OUTER_R    = R + 36
const INNER_R    = R + 18

export function AutomationArcGauge({ progress = 0.7, label = '70% In Progress', detail, className = '' }) {
  const safeProgress = clampProgress(progress, 0.7)
  const cap          = arcPoint(safeProgress)
  const tooltip      = detail ?? `${label} • ${Math.round(safeProgress * 100)}%`
  const { percent, rest } = parseLabelParts(label)

  return (
    <div className={classNames('automation-arc-gauge', className)} data-tooltip={tooltip} title={tooltip}>
      <svg className="automation-arc-gauge__svg" viewBox="0 0 360 240" aria-hidden="true">
        <defs>
          <linearGradient
            id="progressGradient"
            x1={GRAD_START.x} y1={GRAD_START.y}
            x2={GRAD_END.x}   y2={GRAD_END.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(214,245,112,.08)" />
<stop offset="18%" stopColor="#d7ef63" />
<stop offset="55%" stopColor="#a8d11c" />
<stop offset="100%" stopColor="#7fb000" />
          </linearGradient>
          <linearGradient
            id="trackGradient"
            x1={TRACK_END.x} y1={TRACK_END.y}
            x2={TRACK_MID.x} y2={TRACK_MID.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(226,226,226,.92)" />
<stop offset="100%" stopColor="rgba(242,242,242,.18)" />
          </linearGradient>
        </defs>

        {Array.from({ length: TICK_COUNT }).map((_, i) => {
          const t     = i / (TICK_COUNT - 1)
          const outer = arcPoint(t, OUTER_R)
          const inner = arcPoint(t, INNER_R)
          return (
            <line
              key={i}
              x1={outer.x} y1={outer.y}
              x2={inner.x} y2={inner.y}
              className="automation-arc-gauge__tick"
              style={{ '--tick-index': i }}
            />
          )
        })}

        <path d={FULL_ARC} className="automation-arc-gauge__track" />
        <path
          d={FULL_ARC}
          className="automation-arc-gauge__progress"
          pathLength="100"
          strokeDasharray={`${safeProgress * 100} 100`}
        />
        <circle cx={cap.x} cy={cap.y} r="11" className="automation-arc-gauge__cap" />
      </svg>

      <strong className="automation-arc-gauge__label">
        {percent && <span className="automation-arc-gauge__label-percent">{percent}</span>}
        {rest    && <span className="automation-arc-gauge__label-rest"> {rest}</span>}
      </strong>
    </div>
  )
}

export default AutomationArcGauge
