import './SocialPlatformBadge.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function SocialPlatformBadge({
  iconSrc,
  iconAlt = '',
  state = 'done',
  tone = 'blue',
  className = '',
}) {
  return (
    <span className={classNames('social-platform-badge', `social-platform-badge--${tone}`, className)}>
      <img src={iconSrc} alt={iconAlt} className="social-platform-badge__icon" />
      {state === 'loading' ? (
        <span className="social-platform-badge__spinner" aria-label="Loading" />
      ) : (
        <span className="social-platform-badge__check" aria-hidden="true" />
      )}
    </span>
  )
}

export default SocialPlatformBadge
