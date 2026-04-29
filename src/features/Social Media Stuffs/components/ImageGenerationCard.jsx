import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { imageGenerationCardData } from '../data/socialMediaStuffsMockData.js'
import styles from './ImageGenerationCard.module.css'

export function ImageGenerationCard({ data = imageGenerationCardData }) {
  const {
    title,
    subtitle,
    status,
    currentBatchLabel,
    currentBatch,
    heroVariant,
    thumbnails,
    upcomingBatchTitle,
    upcomingBatch,
    insightTitle,
    insightText,
    ctaLabel,
  } = data

  const progressText = `${currentBatch.completed}/${currentBatch.total}`
  const heroClassName = heroVariant && styles[heroVariant] ? `${styles.heroVisual} ${styles[heroVariant]}` : styles.heroVisual

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

      <div className={heroClassName}>
        <div className={styles.sunGlow} />
        <div className={styles.figure} />
      </div>

      <div className={styles.thumbRow}>
        {thumbnails.map((thumb) => (
          <div
            key={thumb.id ?? thumb.variant}
            className={`${styles.thumb} ${thumb.variant && styles[thumb.variant] ? styles[thumb.variant] : ''}`}
          />
        ))}
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
