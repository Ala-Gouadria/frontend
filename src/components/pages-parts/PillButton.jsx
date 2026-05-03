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
}) {
  const isCompact =
    compact !== undefined
      ? compact
      : typeof width === 'string' && parseInt(width, 10) < 300
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
        type="button"
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
