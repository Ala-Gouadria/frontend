import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { leadScoringCardData } from '../data/salesAndLeadsMockData.js'
import styles from './LeadScoringCard.module.css'

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

export function LeadScoringCard({ data = leadScoringCardData }) {
  const {
    title,
    subtitle,
    status,
    scoredLabel,
    scoredValue,
    scoredDelta,
    topChart,
    leads,
    sourceLabel,
    sourceValue,
    sourceMetric,
    trackLabel,
    trackValue,
    trackWidth,
    insight,
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

      <div className={styles.topRow}>
        <div className={styles.topMeta}>
          <span className={styles.topLabel}>{scoredLabel}</span>
          <div className={styles.topValueRow}>
            <strong className={styles.topValue}>{scoredValue}</strong>
            <span className={styles.topDelta}>{scoredDelta}</span>
          </div>
        </div>
        <Sparkline chart={topChart} id="lead-scoring-top" />
      </div>

      <div className={styles.leadList}>
        {leads.map((lead) => (
          <div key={lead.name} className={styles.leadRow}>
            <div className={styles.leadInfo}>
              <strong>{lead.name}</strong>
              <span>{lead.note}</span>
            </div>
            <div className={styles.leadScore}>
              <span>{lead.intent}</span>
              <strong>{lead.score}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sourceSection}>
        <div className={styles.sourceHeader}>
          <span>{sourceLabel}</span>
        </div>
        <div className={styles.sourceRow}>
          <strong className={styles.sourceValue}>{sourceValue}</strong>
          <strong className={styles.sourceMetric}>{sourceMetric}</strong>
        </div>
        <div className={styles.trackHeader}>
          <span>{trackLabel}</span>
          <span>{trackValue}</span>
        </div>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: trackWidth }} />
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
