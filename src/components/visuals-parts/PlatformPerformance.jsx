import './PlatformPerformance.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

/**
 * Platform Performance — a row of per-platform pill badges.
 * Each platform renders its real brand logo on a tinted pill with a
 * brand-colored delta (e.g. Facebook +34%). Figma spec:
 *   Facebook  → bg #1877F2·20%, delta #1877F2
 *   LinkedIn  → bg #BFEBFF,     delta #007EBB
 *   Instagram → bg #FFC4DE,     delta #E54F6F
 *
 * platforms: Array<{
 *   id, delta, deltaColor,
 *   bgColor,                         // pill background
 *   iconSrc?, iconAlt?,              // real brand logo (preferred)
 *   label?, color?,                  // glyph fallback when no iconSrc
 * }>
 */
export function PlatformPerformance({ platforms = [], className = '' }) {
  return (
    <div className={classNames('platform-performance', className)}>
      {platforms.map((p) => (
        <span
          key={p.id}
          className="platform-performance__badge"
          style={{ '--pp-bg': p.bgColor }}
        >
          {p.iconSrc ? (
            <img
              className="platform-performance__icon"
              src={p.iconSrc}
              alt={p.iconAlt || ''}
            />
          ) : (
            <span
              className="platform-performance__icon platform-performance__icon--glyph"
              style={{ background: p.color }}
            >
              {p.label}
            </span>
          )}
          <span className="platform-performance__delta" style={{ color: p.deltaColor }}>
            {p.delta}
          </span>
        </span>
      ))}
    </div>
  )
}

export default PlatformPerformance
