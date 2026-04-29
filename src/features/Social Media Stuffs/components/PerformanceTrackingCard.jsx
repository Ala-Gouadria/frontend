import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { performanceTrackingCardData } from '../data/socialMediaStuffsMockData.js'
import styles from './PerformanceTrackingCard.module.css'

export function PerformanceTrackingCard({ data = performanceTrackingCardData }) {
  const {
    title,
    subtitle,
    status,
    trendLabel,
    trend,
    reasonsTitle,
    reasons,
    performersTitle,
    performerRows,
    platformPerformanceTitle,
    platforms,
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

      <div className={styles.sectionLabel}>{trendLabel}</div>
      <div className={styles.trendRow}>
        <div className={styles.trendMeta}>
          <span className={styles.trendArrow}>{trend.direction === 'down' ? '\u2193' : '\u2191'}</span>
          <span>{trend.label}</span>
        </div>
        <svg className={styles.trendChart} viewBox="0 0 190 46" aria-hidden="true">
          <defs>
            <linearGradient id={trend.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(209, 232, 72, 0.44)" />
              <stop offset="100%" stopColor="rgba(209, 232, 72, 0)" />
            </linearGradient>
          </defs>
          <polygon points={trend.fillPoints} className={styles.trendFill} style={{ fill: `url(#${trend.gradientId})` }} />
          <polyline points={trend.points} className={styles.trendLine} />
        </svg>
      </div>

      <section className={styles.reasonsPanel}>
        <div className={styles.reasonsHeader}>{reasonsTitle}</div>
        <div className={styles.reasonsInner}>
          {reasons.map((reason) => (
            <div className={styles.reasonCol} key={reason.title}>
              <div className={styles.reasonTitle}>{reason.title}</div>
              <div className={`${styles.reasonValue} ${styles[reason.tone]}`}>{reason.value}</div>
              <svg className={styles.reasonChart} viewBox="0 0 96 42" aria-hidden="true">
                {reason.bars.map((bar, index) => (
                  <rect
                    key={`${reason.title}-${index}`}
                    x={4 + index * 7.4}
                    y={40 - bar}
                    width="2.4"
                    height={bar}
                    rx="1"
                    className={styles.reasonBar}
                  />
                ))}
              </svg>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionLabel}>{performersTitle}</div>
      <div className={styles.performers}>
        {performerRows.map((row) => (
          <div className={styles.performerRow} key={row.label}>
            <div className={styles.performerHead}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
            <div className={styles.performerTrack}>
              <div className={styles.performerFill} style={{ width: row.width }} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionLabel}>{platformPerformanceTitle}</div>
      <div className={styles.platformRow}>
        {platforms.map((platform) => (
          <div key={platform.label} className={`${styles.platformChip} ${styles[platform.tone]}`}>
            <span className={styles.platformIcon}>{platform.label}</span>
            <span>{platform.value}</span>
          </div>
        ))}
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
