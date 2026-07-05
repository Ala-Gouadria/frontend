import './PillButton.css'

const DOT_PATTERN = [
  [1, 1, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 0, 0],
]

function inferVariant(children, variant) {
  if (variant) return variant

  const label = String(children ?? '').trim().toLowerCase()
  if (label.includes('decline')) return 'decline'
  if (label.includes('accept')) return 'accepted'
  return 'primary'
}

export default function PillButton({
  onClick,
  children,
  width = '520px',
  height = '92px',
  compact,
  disabled = false,
  className = '',
  style = {},
  variant,
  type = 'button',
}) {
  const isCompact = (() => {
    if (compact !== undefined) return compact
    // Auto-compact when the pill is small in either dimension.
    // Height is the reliable signal (a "100%" width can still be a compact pill).
    const px = (value) =>
      typeof value === 'string' && value.endsWith('px') ? parseInt(value, 10) : NaN
    const heightPx = px(height)
    const widthPx = px(width)
    if (!Number.isNaN(heightPx) && heightPx < 64) return true
    if (!Number.isNaN(widthPx) && widthPx < 300) return true
    return false
  })()
  const resolvedVariant = inferVariant(children, variant)

  return (
    <div
      className={`pill-wrap pill-wrap--${resolvedVariant}${isCompact ? ' pill-wrap--compact' : ''} ${className}`}
      style={{ '--pill-width': width, '--pill-height': height, ...style }}
    >
      <button
        className={`pill-btn pill-btn--${resolvedVariant}${isCompact ? ' pill-btn--compact' : ''}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children ? <span className="pill-btn__label">{children}</span> : null}
        <span className="pill-btn__dots" aria-hidden="true">
          {DOT_PATTERN.map((row, rowIndex) =>
            row.map((visible, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className="pill-btn__dot"
                data-visible={visible ? 'true' : 'false'}
              />
            )),
          )}
        </span>
      </button>
    </div>
  )
}
