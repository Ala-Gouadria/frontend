import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { marketInsightsCardData } from '../data/strategyIntelligenceMockData.js'
import styles from './MarketInsightsCard.module.css'

function InsightLine({ item, id }) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <span>{item.label}</span>
        <span>{item.metric}</span>
      </div>
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
    </div>
  )
}

export function MarketInsightsCard({ data = marketInsightsCardData }) {
  const { title, subtitle, status, trendsLabel, trendsValue, confidence, items, reasonsTitle, reasonText, insight, ctaLabel } = data

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.topMeta}>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>{trendsLabel}</span>
          <strong className={styles.metaValue}>{trendsValue}</strong>
        </div>
        <strong className={styles.confidence}>{confidence}</strong>
      </div>

      <div className={styles.items}>
        {items.map((item, index) => (
          <InsightLine key={item.label} item={item} id={`market-insight-${index}`} />
        ))}
      </div>

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
