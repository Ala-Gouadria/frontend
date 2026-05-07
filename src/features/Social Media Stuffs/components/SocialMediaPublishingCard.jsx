import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { socialMediaPublishingCardData } from '../data/socialMediaStuffsMockData.js'
import styles from './SocialMediaPublishingCard.module.css'

function ChannelPill({ label, tone, checked = false, loading = false }) {
  return (
    <div className={`${styles.channelPill} ${styles[tone]}`}>
      <span className={styles.channelIcon}>{label}</span>
      {checked ? <span className={styles.checkMark}>&#10003;</span> : null}
      {loading ? <span className={styles.loader} /> : null}
    </div>
  )
}

function BatchList({ title, items }) {
  return (
    <section className={styles.batchPanel}>
      <div className={styles.batchHeader}>{title}</div>
      <div className={styles.batchList}>
        {items.map((item) => (
          <div className={styles.batchRow} key={item.label}>
            <span className={styles.batchDot} />
            <span className={styles.batchLabel}>{item.label}</span>
            <span className={styles.batchValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PostAction({ action }) {
  if (action === 'bookmark') {
    return <span className={styles.bookmark}>&#8977;</span>
  }

  if (action === 'comment') {
    return <span>&#9716;</span>
  }

  if (action === 'share') {
    return <span>&#9992;</span>
  }

  return <span>&#9825;</span>
}

export function SocialMediaPublishingCard({ data = socialMediaPublishingCardData }) {
  const {
    title,
    subtitle,
    status,
    currentBatchLabel,
    currentBatch,
    channels,
    post,
    upcomingBatchTitle,
    upcomingBatch,
    insightTitle,
    insightText,
    ctaLabel,
  } = data

  const progressText = `${currentBatch.completed}/${currentBatch.total}`

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

      <div className={styles.channelRow}>
        {channels.map((channel) => (
          <ChannelPill key={`${channel.label}-${channel.tone}`} {...channel} />
        ))}
      </div>

      <section className={styles.postCard}>
        <div className={styles.postTop}>
          <div className={styles.brandMark}>{post.brandInitial}</div>
          <div>
            <div className={styles.brandName}>{post.brandName}</div>
            <div className={styles.brandMeta}>{post.brandMeta}</div>
          </div>
        </div>
        <div className={styles.postVisual}>
          <div className={styles.sunGlow} />
          <div className={styles.figure} />
          <div className={styles.figureShadow} />
        </div>
        <div className={styles.postCaption}>
          {post.caption.map((line, index) => (
            <span key={`${line}-${index}`}>
              {line}
              {index < post.caption.length - 1 ? <br /> : null}
            </span>
          ))}
        </div>
        <div className={styles.postActions}>
          {post.actions.map((action) => (
            <PostAction key={action} action={action} />
          ))}
        </div>
      </section>

      <BatchList title={upcomingBatchTitle} items={upcomingBatch} />

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
