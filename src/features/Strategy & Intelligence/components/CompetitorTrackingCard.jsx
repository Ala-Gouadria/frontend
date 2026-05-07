import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { competitorTrackingCardData } from '../data/strategyIntelligenceMockData.js'
import styles from './CompetitorTrackingCard.module.css'

export function CompetitorTrackingCard({ data = competitorTrackingCardData }) {
  const { title, subtitle, status, trackedLabel, trackedValue, summary, competitors, insight, ctaLabel } = data

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
        <div className={styles.meta}>
          <span className={styles.metaLabel}>{trackedLabel}</span>
          <strong className={styles.metaValue}>{trackedValue}</strong>
        </div>
        <strong className={styles.summary}>{summary}</strong>
      </div>

      <div className={styles.list}>
        {competitors.map((item) => (
          <div key={item.id} className={styles.competitorRow}>
            <div className={styles.left}>
              <span className={`${styles.avatar} ${styles[item.tone]}`} />
              <div className={styles.identity}>
                <strong>{item.name}</strong>
                <span>{item.platform}</span>
              </div>
            </div>
            <div className={styles.right}>
              <span>{item.note}</span>
              <strong>{item.delta}</strong>
            </div>
          </div>
        ))}
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
