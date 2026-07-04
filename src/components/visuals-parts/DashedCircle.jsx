import './DashedCircle.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

/**
 * DashedCircle — a small dashed ring that spins in a loop.
 * Used as the "pending" marker in upcoming/queued lists.
 * Figma spec: 12.5px, 1px stroke, #000000, ~8 evenly-spaced dashes.
 *
 * The dash pattern is computed from the circumference so exactly
 * `dashCount` dashes fit evenly (no clipped/uneven final dash).
 *
 * Props: size, color, strokeWidth, dashCount, dashRatio (0-1 dash vs gap),
 *        duration (seconds), className
 */
export function DashedCircle({
  size = 12.5,
  color = '#000000',
  strokeWidth = 1,
  dashCount = 8,
  dashRatio = 0.5,
  duration = 3,
  className = '',
}) {
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const segment = circumference / dashCount
  const dashLen = segment * dashRatio
  const gapLen = segment - dashLen

  return (
    <svg
      className={classNames('dashed-circle', className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      style={{ '--dashed-circle-duration': `${duration}s` }}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLen} ${gapLen}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default DashedCircle
