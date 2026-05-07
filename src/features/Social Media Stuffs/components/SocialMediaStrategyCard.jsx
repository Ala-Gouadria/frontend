import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { socialMediaStrategyCardData } from '../data/socialMediaStuffsMockData.js'
import styles from './SocialMediaStrategyCard.module.css'

export function SocialMediaStrategyCard({ data = socialMediaStrategyCardData }) {
  const {
    title,
    subtitle,
    status,
    executionLabel,
    currentExecution,
    stats,
    reasonsTitle,
    reasonColumns,
    planTitle,
    planItems,
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

      <div className={styles.sectionLabel}>{executionLabel}</div>
      <div className={styles.batchProgress}>
        <span className={styles.batchProgressDot} />
        <span>{currentExecution.name}</span>
        <strong>{currentExecution.progress}</strong>
      </div>

      <div className={styles.statsRow}>
        {stats.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <section className={styles.reasonsPanel}>
        <div className={styles.reasonsHeader}>{reasonsTitle}</div>
        <div className={styles.reasonsInner}>
          {reasonColumns.map((column) => (
            <div className={styles.reasonCol} key={column.title}>
              <div className={styles.reasonTitle}>{column.title}</div>
              <div className={`${styles.reasonDelta} ${styles[column.tone]}`}>{column.delta}</div>
              <svg className={styles.reasonChart} viewBox="0 0 96 42" aria-hidden="true">
                {column.bars.map((bar, index) => (
                  <rect
                    key={`${column.title}-${index}`}
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

      <section className={styles.planPanel}>
        <div className={styles.planHeader}>{planTitle}</div>
        <div className={styles.planList}>
          {planItems.map((item) => (
            <div className={styles.planRow} key={item}>
              <span className={styles.planDot} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

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
