import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { riskDetectionCardData } from '../data/strategyIntelligenceMockData.js'
import styles from './RiskDetectionCard.module.css'

function RiskLine({ item, id }) {
  return (
    <div className={styles.riskItem}>
      <div className={styles.riskHeader}>
        <div className={styles.riskMeta}>
          <span>{item.title}</span>
          <span className={styles.riskState}>{item.state}</span>
        </div>
        <strong className={styles.riskMetric}>{item.metric}</strong>
      </div>
      <svg className={styles.sparkline} viewBox="0 0 270 48" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 120, 120, 0.32)" />
            <stop offset="100%" stopColor="rgba(255, 120, 120, 0)" />
          </linearGradient>
        </defs>
        <polyline points={item.points} className={styles.sparkLine} />
        <polygon points={`0,48 ${item.points} 270,48`} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      </svg>
    </div>
  )
}

export function RiskDetectionCard({ data = riskDetectionCardData }) {
  const { title, subtitle, status, riskPanelTitle, risks, reasonsTitle, reasonText, insight, ctaLabel } = data

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <section className={styles.riskPanel}>
        <div className={styles.riskPanelHeader}>{riskPanelTitle}</div>
        <div className={styles.riskPanelBody}>
          {risks.map((item, index) => (
            <RiskLine key={`${item.title}-${index}`} item={item} id={`risk-line-${index}`} />
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
