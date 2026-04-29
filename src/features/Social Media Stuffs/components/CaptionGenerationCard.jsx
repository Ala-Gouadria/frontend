import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { captionGenerationCardData } from '../data/socialMediaStuffsMockData.js'
import styles from './CaptionGenerationCard.module.css'

export function CaptionGenerationCard({ data = captionGenerationCardData }) {
  const {
    title,
    subtitle,
    status,
    currentBatchLabel,
    currentBatch,
    captionLabel,
    captionStatus,
    paragraphs,
    pager,
    upcomingBatchTitle,
    upcomingBatch,
    insightTitle,
    insightText,
    ctaLabel,
  } = data

  const progressText = `${currentBatch.completed}/${currentBatch.total}`
  const pagerText = `${pager.current}/${pager.total}`

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.sectionLabel}>{currentBatchLabel}</div>
      <div className={styles.batchProgress}>
        <span className={styles.batchProgressDot} />
        <span>{currentBatch.name}</span>
        <strong>{progressText}</strong>
      </div>

      <div className={styles.captionHeader}>
        <span>{captionLabel}</span>
        <span className={styles.generating}>{captionStatus}</span>
      </div>

      <div className={styles.captionBody}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className={styles.pager}>
        <button type="button" aria-label="Previous caption">
          &lsaquo;
        </button>
        <span>{pagerText}</span>
        <button type="button" aria-label="Next caption">
          &rsaquo;
        </button>
      </div>

      <section className={styles.batchPanel}>
        <div className={styles.batchHeader}>{upcomingBatchTitle}</div>
        <div className={styles.batchList}>
          {upcomingBatch.map((item) => (
            <div className={styles.batchRow} key={item.label}>
              <span className={styles.batchDot} />
              <span className={styles.batchLabel}>{item.label}</span>
              <span className={styles.batchValue}>{item.value}</span>
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
