import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { salesAndLeadsCardData } from '../data/salesAndLeadsMockData.js'
import styles from './SalesAndLeadsCard.module.css'

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

export function SalesAndLeadsCard({ data = salesAndLeadsCardData }) {
  const {
    title,
    subtitle,
    status,
    revenueLabel,
    revenueValue,
    revenueChart,
    problemTitle,
    problemText,
    stages,
    leadQualityTitle,
    leadQualityLabel,
    legend,
    blocks,
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
        <div className={styles.revenueMeta}>
          <span className={styles.revenueLabel}>{revenueLabel}</span>
          <div className={styles.revenueValueRow}>
            <span className={styles.arrow}>&uarr;</span>
            <strong className={styles.revenueValue}>{revenueValue}</strong>
          </div>
        </div>
        <Sparkline chart={revenueChart} id="sales-and-leads-top" />
      </div>

      <section className={styles.problemPanel}>
        <div className={styles.problemTitle}>{problemTitle}</div>
        <div className={styles.problemText}>{problemText}</div>
        <div className={styles.stagePills}>
          {stages.map((stage, index) => (
            <div key={stage} className={styles.stageGroup}>
              <span className={`${styles.stagePill} ${index === 2 ? styles.orangePill : styles.greenPill}`}>{stage}</span>
              {index < stages.length - 1 ? <span className={styles.stageArrow}>&gt;</span> : null}
            </div>
          ))}
        </div>
      </section>

      <div className={styles.leadSection}>
        <div className={styles.sectionTitle}>{leadQualityTitle}</div>
        <div className={styles.sectionLabel}>{leadQualityLabel}</div>
        <div className={styles.legendRow}>
          {legend.map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles[item.tone]}`} />
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        <div className={styles.blockRow}>
          {blocks.map((group) =>
            Array.from({ length: group.count }).map((_, index) => (
              <span key={`${group.tone}-${index}`} className={`${styles.block} ${styles[group.tone]}`} />
            )),
          )}
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
