import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { strategyIntelligenceCardData } from '../data/strategyIntelligenceMockData.js'
import styles from './StrategyIntelligenceCard.module.css'

export function StrategyIntelligenceCard({ data = strategyIntelligenceCardData }) {
  const {
    title,
    subtitle,
    status,
    activeLabel,
    activeValue,
    activePercent,
    activeProgress,
    expectedLabel,
    expectedPercent,
    confidenceLabel,
    confidenceValue,
    confidenceWidth,
    opportunityLabel,
    opportunityValue,
    opportunityWidth,
    reasonsTitle,
    reasonColumns,
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

      <div className={styles.section}>
        <div className={styles.rowHeader}>
          <span>{activeLabel}</span>
        </div>
        <div className={styles.strategyRow}>
          <strong className={styles.strategyValue}>{activeValue}</strong>
          <strong className={styles.strategyPercent}>{activePercent}</strong>
        </div>
        <div className={styles.strategyTrack}>
          <div className={styles.strategyFill} style={{ width: `${activeProgress * 100}%` }} />
          <span className={styles.strategyCap} style={{ left: `calc(${activeProgress * 100}% - 8px)` }} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.rowHeader}>
          <span>{expectedLabel}</span>
          <strong>{expectedPercent}</strong>
        </div>
      </div>

      <div className={styles.metricBar}>
        <div className={styles.metricHead}>
          <span className={styles.orangeText}>{confidenceLabel}</span>
          <span className={styles.orangeText}>{confidenceValue}</span>
        </div>
        <div className={styles.softTrack}>
          <div className={styles.orangeFill} style={{ width: confidenceWidth }} />
        </div>
      </div>

      <div className={styles.metricBar}>
        <div className={styles.metricHead}>
          <span className={styles.greenText}>{opportunityLabel}</span>
          <span className={styles.greenText}>{opportunityValue}</span>
        </div>
        <div className={styles.softTrack}>
          <div className={styles.greenFill} style={{ width: opportunityWidth }} />
        </div>
      </div>

      <section className={styles.reasonPanel}>
        <div className={styles.reasonHeader}>{reasonsTitle}</div>
        <div className={styles.reasonBody}>
          {reasonColumns.map((column) => (
            <div key={column.label} className={styles.reasonColumn}>
              <span className={styles.reasonLabel}>{column.label}</span>
              <strong className={styles.reasonValue}>{column.value}</strong>
              <svg className={styles.reasonChart} viewBox="0 0 94 48" aria-hidden="true">
                {column.bars.map((bar, index) => (
                  <rect
                    key={`${column.label}-${bar}-${index}`}
                    x={index * 7.2}
                    y={46 - bar}
                    width="2.4"
                    height={bar}
                    rx="1.2"
                    className={styles.reasonBar}
                  />
                ))}
              </svg>
            </div>
          ))}
        </div>
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
