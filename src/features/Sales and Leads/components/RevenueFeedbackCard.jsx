import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { revenueFeedbackCardData } from '../data/salesAndLeadsMockData.js'
import styles from './RevenueFeedbackCard.module.css'

function Sparkline({ chart, id }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 270 46" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 228, 91, 0.42)" />
          <stop offset="100%" stopColor="rgba(201, 228, 91, 0)" />
        </linearGradient>
      </defs>
      <polygon points={chart.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      <polyline points={chart.points} className={styles.sparkLine} />
    </svg>
  )
}

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : 0
}

function getSourceTone(percent) {
  if (percent >= 50) {
    return 'green'
  }

  if (percent >= 35) {
    return 'blue'
  }

  return 'red'
}

export function RevenueFeedbackCard({ data = revenueFeedbackCardData }) {
  const { title, subtitle, status, responseLabel, responseValue, topChart, sourcesTitle, sources, insight, ctaLabel } = data

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.topRow}>
        <div className={styles.topMeta}>
          <span className={styles.topLabel}>{responseLabel}</span>
          <strong className={styles.topValue}>{responseValue}</strong>
        </div>
        <Sparkline chart={topChart} id="revenue-feedback-top" />
      </div>

      <div className={styles.sourceSection}>
        <div className={styles.sourceTitle}>{sourcesTitle}</div>
        <div className={styles.sourceList}>
          {sources.map((source, index) => {
            const percent = getPercent(source.value || source.width)
            const width = percent > 0 ? `${percent}%` : source.width
            const sourceTone = getSourceTone(percent)

            return (
              <div
                key={source.label}
                className={`${styles.sourceRow} ${styles[`${sourceTone}Source`]}`}
                style={{ '--source-delay': `${index * 110}ms` }}
              >
                <div className={styles.sourceHead}>
                  <span>{source.label}</span>
                  <span>{source.value}</span>
                </div>
                <div className={styles.track}>
                  <div
                    className={styles.trackFill}
                    style={{
                      width,
                      '--fill-delay': `${index * 110}ms`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span>AI Insight</span>
        </div>
        <p>{insight}</p>
      </div>

      <button type="button" className={styles.cta}>
        {ctaLabel}
      </button>
    </article>
  )
}
