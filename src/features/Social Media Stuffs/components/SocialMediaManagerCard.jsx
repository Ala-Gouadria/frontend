import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { socialMediaManagerCardData } from '../data/socialMediaStuffsMockData.js'
import styles from './SocialMediaManagerCard.module.css'

export function SocialMediaManagerCard({ data = socialMediaManagerCardData }) {
  const {
    title,
    subtitle,
    status,
    activityLabel,
    currentActivity,
    breakdownLabel,
    engagementCards,
    metrics,
    insightTitle,
    insightText,
    ctaLabel,
  } = data

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.sectionLabel}>{activityLabel}</div>
      <div className={styles.batchProgress}>
        <span className={styles.batchProgressDot} />
        <span>{currentActivity.name}</span>
        <strong>{currentActivity.progress}</strong>
      </div>

      <div className={styles.sectionLabel}>{breakdownLabel}</div>
      <div className={styles.breakdownRow}>
        {engagementCards.map((card) => (
          <div key={card.icon} className={`${styles.breakdownCard} ${styles[card.tone]}`}>
            <div className={styles.breakdownHead}>
              <span className={styles.breakdownIcon}>{card.icon}</span>
              <span className={styles.breakdownValue}>{card.value}</span>
            </div>
            <svg className={styles.breakdownChart} viewBox="0 0 112 44" aria-hidden="true">
              <polyline className={styles.breakdownLine} points={card.points} />
            </svg>
          </div>
        ))}
      </div>

      <div className={styles.metricRow}>
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>{metrics.primary.label}</span>
          <strong className={styles.metricValue}>{metrics.primary.value}</strong>
          <svg className={styles.metricChart} viewBox="0 0 84 42" aria-hidden="true">
            {metrics.primary.bars.map((bar, index) => (
              <rect
                key={`${bar}-${index}`}
                x={4 + index * 6.3}
                y={40 - bar / 1.5}
                width="2.2"
                height={bar / 1.5}
                rx="1"
                className={styles.metricBar}
              />
            ))}
          </svg>
        </div>
        <div className={styles.shareGrowth}>
          <div className={styles.metricBlock}>
            <span className={styles.metricLabel}>{metrics.secondary.label}</span>
            <strong className={styles.metricValue}>{metrics.secondary.value}</strong>
          </div>
          <svg className={styles.growthChart} viewBox="0 0 190 46" aria-hidden="true">
            <defs>
              <linearGradient id={metrics.secondary.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(209, 232, 72, 0.44)" />
                <stop offset="100%" stopColor="rgba(209, 232, 72, 0)" />
              </linearGradient>
            </defs>
            <polygon
              points={metrics.secondary.fillPoints}
              className={styles.growthFill}
              style={{ fill: `url(#${metrics.secondary.gradientId})` }}
            />
            <polyline points={metrics.secondary.points} className={styles.growthLine} />
          </svg>
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span>{insightTitle}</span>
        </div>
        <p>{insightText}</p>
      </div>

      <button type="button" className={styles.cta}>
        {ctaLabel}
      </button>
    </article>
  )
}
