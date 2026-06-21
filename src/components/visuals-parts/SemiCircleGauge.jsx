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

/*
  Arc geometry — elliptical bow, viewBox 720 × 320.
  Center is well below the viewBox so only the upper arc is visible.
  Angles are standard math (CCW from +x). SVG sweep-flag=1 draws CW,
  which with a flipped y-axis gives us left-to-right visual progress.
*/
const ARC = {
  cx: 360,
  cy: 330,
  rx: 332,
  ry: 255,
  startAngle: 164 * (Math.PI / 180),
  endAngle:    16 * (Math.PI / 180),
}

// The visible band is thick — 68px in SVG units (~9.4% of viewBox width)
const BAND_WIDTH = 68

// 20 ticks across the full arc interior
const TICK_COUNT    = 20
const TICK_PROGRESS = Array.from({ length: TICK_COUNT - 1 }, (_, i) => (i + 1) / TICK_COUNT)

function getArcAngle(p) {
  return ARC.startAngle + (ARC.endAngle - ARC.startAngle) * p
}

function getArcPoint(p) {
  const a = getArcAngle(p)
  return { x: ARC.cx + ARC.rx * Math.cos(a), y: ARC.cy - ARC.ry * Math.sin(a) }
}

// Short line perpendicular to the arc — used for tick stripes
function getTickLine(p, length) {
  const a     = getArcAngle(p)
  const pt    = getArcPoint(p)
  const tan   = { x: -ARC.rx * Math.sin(a), y: -ARC.ry * Math.cos(a) }
  const norm  = Math.hypot(tan.x, tan.y) || 1
  const perp  = { x: -tan.y / norm, y: tan.x / norm }
  return {
    x1: pt.x - (perp.x * length) / 2,
    y1: pt.y - (perp.y * length) / 2,
    x2: pt.x + (perp.x * length) / 2,
    y2: pt.y + (perp.y * length) / 2,
  }
}

function getPathData() {
  const s = getArcPoint(0)
  const e = getArcPoint(1)
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${ARC.rx} ${ARC.ry} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

export function SemiCircleGauge({
  current   = 578,
  target    = 700,
  progress,
  label,
  title,
  tone      = 'blue',
  className = '',
}) {
  const raw        = useId().replace(/[^a-zA-Z0-9]/g, '')
  const maskId     = 'm'  + raw
  const fadeId     = 'f'  + raw
  const progGradId = 'pg' + raw
  const glowGradId = 'gg' + raw
  const knobGradId = 'kg' + raw

  const safeTarget = Number(target)
  const derived    = Number.isFinite(safeTarget) && safeTarget !== 0
    ? Number(current) / safeTarget : 0
  const pct        = clamp(progress ?? derived, 0, 1)

  const pathData = getPathData()
  const knob     = getArcPoint(pct)
  const dash     = `${pct * 100} 100`

  // Knob: large ring + inner dot, proportional to the thick band
  const ringR = Math.round(BAND_WIDTH * 0.52)   // white outer ring
  const dotR  = Math.round(BAND_WIDTH * 0.37)   // solid blue dot

  // Ticks only inside the filled region
  const filledTicks = TICK_PROGRESS.filter(tp => tp <= pct + 0.008)

  const valueLabel   = label ?? `${current}/${target}`
  const [cur, tgt]   = valueLabel.split('/')

  return (
    <div className={classNames('semi-circle-gauge', `semi-circle-gauge--${tone}`, className)}>
      {title ? <div className="semi-circle-gauge__title">{title}</div> : null}

      <div className="semi-circle-gauge__chart">
        <svg className="semi-circle-gauge__svg" viewBox="0 0 720 320" aria-hidden="true">
          <defs>

            {/* ── Horizontal edge-fade mask ─────────────────────────────────── */}
            <linearGradient id={fadeId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0"   />
              <stop offset="6%"   stopColor="white" stopOpacity="0.4" />
              <stop offset="14%"  stopColor="white" stopOpacity="1"   />
              <stop offset="86%"  stopColor="white" stopOpacity="1"   />
              <stop offset="94%"  stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0"   />
            </linearGradient>

            {/* ── Progress band: pale → vivid (left → right) ───────────────── */}
            <linearGradient id={progGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="var(--gauge-progress-0)" />
              <stop offset="25%"  stopColor="var(--gauge-progress-1)" />
              <stop offset="55%"  stopColor="var(--gauge-progress-2)" />
              <stop offset="80%"  stopColor="var(--gauge-progress-3)" />
              <stop offset="100%" stopColor="var(--gauge-progress-4)" />
            </linearGradient>

            {/* ── Wide outer glow gradient — same hue, very transparent ─────── */}
            <linearGradient id={glowGradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="720" y2="0">
              <stop offset="0%"   stopColor="var(--gauge-glow-0)" />
              <stop offset="50%"  stopColor="var(--gauge-glow-1)" />
              <stop offset="100%" stopColor="var(--gauge-glow-2)" />
            </linearGradient>

            {/* ── Knob gradient: light-blue top → vivid-blue bottom ─────────── */}
            <linearGradient id={knobGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--gauge-knob-1)" />
              <stop offset="100%" stopColor="var(--gauge-knob-2)" />
            </linearGradient>

            {/* ── Fade mask applied to the whole track group ───────────────── */}
            <mask id={maskId} maskUnits="userSpaceOnUse" x="-80" y="-80" width="880" height="480">
              <rect x="-80" y="-80" width="880" height="480" fill={`url(#${fadeId})`} />
            </mask>

          </defs>

          <g mask={`url(#${maskId})`}>

            {/* ── 1. Wide outer glow — very blurred, extends far beyond band ── */}
            <path d={pathData} fill="none"
              stroke={`url(#${glowGradId})`}
              strokeWidth={BAND_WIDTH + 80}
              strokeLinecap="round"
              style={{ filter: 'blur(18px)', opacity: 0.55 }}
            />

            {/* ── 2. Mid glow — moderate blur ─────────────────────────────── */}
            <path d={pathData} fill="none"
              stroke={`url(#${glowGradId})`}
              strokeWidth={BAND_WIDTH + 40}
              strokeLinecap="round"
              style={{ filter: 'blur(10px)', opacity: 0.35 }}
            />

            {/* ── 3. Background track — full-arc pale fill ─────────────────── */}
            <path d={pathData} fill="none"
              stroke="var(--gauge-track)"
              strokeWidth={BAND_WIDTH}
              strokeLinecap="butt"
            />

            {/* ── 4. Progress glow — blurred behind the filled band ────────── */}
            <path d={pathData} fill="none"
              stroke={`url(#${progGradId})`}
              strokeWidth={BAND_WIDTH + 14}
              strokeLinecap="butt"
              pathLength="100"
              strokeDasharray={dash}
              style={{ filter: 'blur(8px)', opacity: 0.4 }}
            />

            {/* ── 5. Progress band — main crisp fill ───────────────────────── */}
            <path d={pathData} fill="none"
              stroke={`url(#${progGradId})`}
              strokeWidth={BAND_WIDTH}
              strokeLinecap="butt"
              pathLength="100"
              strokeDasharray={dash}
              className="semi-circle-gauge__progress"
            />

            {/* ── 6. Inner-edge highlight stripe ───────────────────────────── */}
            <path d={pathData} fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="8"
              strokeLinecap="butt"
              pathLength="100"
              strokeDasharray={dash}
              style={{ filter: 'blur(2px)' }}
            />

            {/* ── 7. Tick dividers — wide semi-transparent stripes ──────────── */}
            <g>
              {filledTicks.map(tp => {
                const t = getTickLine(tp, BAND_WIDTH + 4)
                return (
                  <line key={tp}
                    x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                    stroke="rgba(255,255,255,0.38)"
                    strokeWidth="9"
                    strokeLinecap="butt"
                  />
                )
              })}
            </g>

          </g>

          {/* ── Knob — outside the mask, always fully visible ─────────────── */}
          <circle cx={knob.x} cy={knob.y} r={ringR}
            className="semi-circle-gauge__cap-ring"
          />
          <circle cx={knob.x} cy={knob.y} r={dotR}
            fill={`url(#${knobGradId})`}
            className="semi-circle-gauge__cap"
          />

        </svg>

        <div className="semi-circle-gauge__value">
          <span className="semi-circle-gauge__current">{cur}</span>
          {tgt ? <span className="semi-circle-gauge__target">/{tgt}</span> : null}
        </div>
      </div>
    </div>
  )
}

export default SemiCircleGauge