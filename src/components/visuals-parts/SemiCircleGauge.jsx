import { useId } from 'react'
import './SemiCircleGauge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function clamp(value, min, max, fallback = min) {
  const number = Number(value)
  const safe = Number.isFinite(number) ? number : fallback
  return Math.max(min, Math.min(safe, max))
}

/* The arc lives in a 720 x 360 viewBox as the top of a wide ellipse. */
const ARC = {
  cx: 360,
  cy: 348,
  rx: 332,
  ry: 250,
  startAngle: 162 * (Math.PI / 180),
  endAngle: 18 * (Math.PI / 180),
}

function angleAt(progress) {
  return ARC.startAngle + (ARC.endAngle - ARC.startAngle) * progress
}

function pointAt(progress) {
  const a = angleAt(progress)
  return {
    x: ARC.cx + ARC.rx * Math.cos(a),
    y: ARC.cy - ARC.ry * Math.sin(a),
  }
}

function tickAt(progress, length) {
  const a = angleAt(progress)
  const p = pointAt(progress)
  const tx = -ARC.rx * Math.sin(a)
  const ty = -ARC.ry * Math.cos(a)
  const norm = Math.hypot(tx, ty) || 1
  const nx = -ty / norm
  const ny = tx / norm
  return {
    x1: p.x - (nx * length) / 2,
    y1: p.y - (ny * length) / 2,
    x2: p.x + (nx * length) / 2,
    y2: p.y + (ny * length) / 2,
  }
}

function arcPath() {
  const start = pointAt(0)
  const end = pointAt(1)
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const TICK_COUNT = 30

export function SemiCircleGauge({
  current = 578,
  target = 700,
  progress,
  label,
  caption,
  title,
  tone = 'blue',
  bandWidth = 44,
  className = '',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const trackGradId  = 't'  + uid
  const bandGradId   = 'b'  + uid
  const knobGradId   = 'k'  + uid
  const fadeMaskId   = 'm'  + uid
  const fadeGradId   = 'f'  + uid
  const tickBlurId   = 'tb' + uid

  const safeTarget = Number(target)
  const derived =
    Number.isFinite(safeTarget) && safeTarget !== 0 ? Number(current) / safeTarget : 0
  const value = clamp(progress ?? derived, 0, 1)

  const path  = arcPath()
  const knob  = pointAt(value)
  const dash  = `${value * 100} 100`

  const ringR = Math.round(bandWidth * 0.8)
  const capR  = Math.round(bandWidth * 0.62)

  const ticks = Array.from({ length: TICK_COUNT - 1 }, (_, i) => (i + 1) / TICK_COUNT)

  const valueLabel = label ?? `${current}/${target}`
  const [currentLabel, targetLabel] = valueLabel.split('/')

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}

      <div className="semi-circle-gauge__chart">
        <svg className="semi-circle-gauge__svg" viewBox="0 0 720 360" aria-hidden="true">
          <defs>
            {/* fade the very ends of the arc into the background */}
            <linearGradient id={fadeGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="8%"   stopColor="white" stopOpacity="1" />
              <stop offset="92%"  stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={fadeMaskId} maskUnits="userSpaceOnUse" x="-80" y="-80" width="880" height="520">
              <rect x="-80" y="-80" width="880" height="520" fill={`url(#${fadeGradId})`} />
            </mask>

            {/* unfilled track — light blue tail with a green hint at the very end */}
            <linearGradient id={trackGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="var(--gauge-track-0)" />
              <stop offset="85%"  stopColor="var(--gauge-track-1)" />
              <stop offset="100%" stopColor="var(--gauge-track-2)" />
            </linearGradient>

            {/* filled band: translucent → #3787F7 → #A2B8F7 → green hint at tip */}
            <linearGradient id={bandGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="var(--gauge-band-0)" />
              <stop offset="40%"  stopColor="var(--gauge-band-1)" />
              <stop offset="75%"  stopColor="var(--gauge-band-2)" />
              <stop offset="92%"  stopColor="var(--gauge-band-3)" />
              <stop offset="100%" stopColor="var(--gauge-band-tip, rgba(9, 169, 81, 0.15))" />
            </linearGradient>

            {/* knob fill — flat linear gradient, light top-left to primary blue */}
            <linearGradient id={knobGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="var(--gauge-knob-0)" />
              <stop offset="100%" stopColor="var(--gauge-knob-2)" />
            </linearGradient>

            {/* soft blur for the segment separators */}
            <filter id={tickBlurId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>

          <g mask={`url(#${fadeMaskId})`}>
            {/* wide flat track — the pale band the filled arc sits inside (Figma: #1877F2 · 20%) */}
            <path
              d={path}
              fill="none"
              stroke={`url(#${trackGradId})`}
              strokeWidth={bandWidth + 30}
              strokeLinecap="round"
            />

            {/* single very soft glow hugging the filled band */}
            <path
              d={path}
              fill="none"
              stroke="var(--gauge-band-glow)"
              strokeWidth={bandWidth + 10}
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={dash}
              style={{ filter: 'blur(8px)', opacity: 0.3 }}
            />

            {/* filled band — slightly blurred so the edges stay diffuse like the Figma */}
            <path
              d={path}
              fill="none"
              stroke={`url(#${bandGradId})`}
              strokeWidth={bandWidth}
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={dash}
              style={{ filter: 'blur(var(--gauge-band-blur, 3px))' }}
              className="semi-circle-gauge__progress"
            />

            {/* segment separators — Figma: #FFFFFF · 10%, only visible on the filled band */}
            <g filter={`url(#${tickBlurId})`}>
              {ticks.map((tp) => {
                const t = tickAt(tp, bandWidth - 2)
                const filled = tp <= value + 0.005
                return (
                  <line
                    key={tp}
                    x1={t.x1} y1={t.y1}
                    x2={t.x2} y2={t.y2}
                    stroke="rgba(255,255,255,1)"
                    strokeWidth="6"
                    strokeLinecap="butt"
                    opacity={filled ? 0.32 : 0}
                  />
                )
              })}
            </g>
          </g>

          {/* knob — sits above the mask */}
          <circle cx={knob.x} cy={knob.y} r={ringR} className="semi-circle-gauge__ring" />
          <circle
            cx={knob.x}
            cy={knob.y}
            r={capR}
            fill={`url(#${knobGradId})`}
            className="semi-circle-gauge__cap"
          />
        </svg>

        <div className="semi-circle-gauge__value">
          <span className="semi-circle-gauge__number">
            <span className="semi-circle-gauge__current">{currentLabel}</span>
            {targetLabel ? <span className="semi-circle-gauge__target">/{targetLabel}</span> : null}
          </span>
          {caption ? <span className="semi-circle-gauge__caption">{caption}</span> : null}
        </div>
      </div>
    </div>
  )
}

export default SemiCircleGauge
