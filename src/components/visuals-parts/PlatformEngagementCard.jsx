import { MiniLineChart } from './MiniLineChart'
import './PlatformEngagementCard.css'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function PlatformEngagementCard({
  iconSrc,
  iconAlt = '',
  delta,
  points,
  tone = 'blue',
  className = '',
}) {
  return (
    <div className={classNames('platform-engagement-card', `platform-engagement-card--${tone}`, className)}>
      <div className="platform-engagement-card__top">
        {iconSrc ? (
          <img src={iconSrc} alt={iconAlt} className="platform-engagement-card__icon" />
        ) : (
          <span className="platform-engagement-card__icon" aria-hidden="true" />
        )}
        <span className="platform-engagement-card__delta">{delta}</span>
      </div>
      <MiniLineChart points={points} tone={tone} className="platform-engagement-card__chart" />
    </div>
  )
}

export default PlatformEngagementCard
