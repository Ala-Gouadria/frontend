import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { opportunityDetectionCardData } from '../data/strategyIntelligenceMockData.js'
import styles from './OpportunityDetectionCard.module.css'

function Sparkline({ item, id }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 270 48" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 228, 91, 0.42)" />
          <stop offset="100%" stopColor="rgba(201, 228, 91, 0)" />
        </linearGradient>
      </defs>
      <polygon points={item.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      <polyline points={item.points} className={styles.sparkLine} />
    </svg>
  )
}

export function OpportunityDetectionCard({ data = opportunityDetectionCardData }) {
  const { title, subtitle, status, topLabel, topValue, topChart, panelTitle, opportunities, reasonsTitle, reasonText, insight, ctaLabel } = data

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
          <span className={styles.topLabel}>{topLabel}</span>
          <strong className={styles.topValue}>{topValue}</strong>
        </div>
        <Sparkline item={topChart} id="opportunity-top" />
      </div>

      <section className={styles.opportunityPanel}>
        <div className={styles.panelHeader}>{panelTitle}</div>
        <div className={styles.panelBody}>
          {opportunities.map((item, index) => (
            <div key={item.label} className={styles.opportunityItem}>
              <div className={styles.itemHeader}>
                <span>{item.label}</span>
                <span>{item.metric}</span>
              </div>
              <Sparkline item={item} id={`opportunity-${index}`} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.reasonPanel}>
        <div className={styles.reasonHeader}>{reasonsTitle}</div>
        <div className={styles.reasonBody}>{reasonText}</div>
      </section>

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
