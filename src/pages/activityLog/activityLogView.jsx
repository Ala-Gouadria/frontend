import { useTranslation } from 'react-i18next'
import brandLogo from '../../assets/logo/Nora_Componennts_Logo.png'
import './activityLogView.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8 4 3 10l5 6M15 4l-5 6 5 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SocialIcon({ type }) {
  if (type === 'bookmark') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="M5.4 3.5h7.2v11l-3.6-2-3.6 2v-11Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'comment') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="M4 5.2c0-1 0.8-1.8 1.8-1.8h6.4c1 0 1.8.8 1.8 1.8v4.3c0 1-.8 1.8-1.8 1.8H8.4l-3.1 2.1v-2.1c-.8-.2-1.3-.9-1.3-1.8V5.2Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'send') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="m3.4 3.8 11.2 5.1-11.2 5.1 1.6-4.5 5.3-.6-5.3-.6-1.6-4.6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M9 14.2S3.5 11 3.5 6.8c0-1.6 1.2-2.8 2.7-2.8 1 0 1.9.6 2.4 1.4C9.1 4.6 10 4 11 4c1.5 0 2.7 1.2 2.7 2.8 0 4.2-4.7 7.4-4.7 7.4Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function MetricCard({ label, value, tone }) {
  return (
    <article className={`activity-log-view-metric ${tone ? `activity-log-view-metric--${tone}` : ''}`}>
      <strong>{label}</strong>
      <span>{value}</span>
    </article>
  )
}

function PreviewPost({ asset, index }) {
  return (
    <article className="activity-log-view-post" style={{ '--view-delay': `${index * 55}ms` }}>
      <div className="activity-log-view-post__brand">
        <img src={brandLogo} alt="" aria-hidden="true" />
        <div>
          <strong>XWorldLTD</strong>
          <span>Manchester, United Kingdom</span>
        </div>
      </div>

      {asset.image ? <img src={asset.image} alt="" aria-hidden="true" className="activity-log-view-post__image" /> : null}
      <p>{asset.text}</p>

      <div className="activity-log-view-post__actions">
        <SocialIcon />
        <SocialIcon type="comment" />
        <SocialIcon type="send" />
        <span />
        <SocialIcon type="bookmark" />
      </div>
    </article>
  )
}

export default function ActivityLogView({ log, onBack }) {
  const { t } = useTranslation()

  return (
    <aside className="activity-log-view" aria-label="Activity log detail">
      <button type="button" className="activity-log-view__back" onClick={onBack}>
        <BackIcon />
        <span>{t('activityLogView.back')}</span>
      </button>

      <header className="activity-log-view__header">
        <h2>{log.detailTitle}</h2>
        <p>{log.timestamp} · {log.department} · {log.id}</p>
      </header>

      <div className="activity-log-view__divider" />

      <div className="activity-log-view__metrics">
        <MetricCard label={t('activityLogView.eventType')} value={log.eventType} />
        <MetricCard label={t('activityLogView.impact')} value={log.impactDetail} />
        <MetricCard label={t('activityLogView.status')} value={log.status} tone={log.status.toLowerCase()} />
      </div>

      <section className="activity-log-view__summary">
        <h3>{t('activityLogView.summary')}</h3>
        <p>{log.summary}</p>
      </section>

      <div className="activity-log-view__grid">
        {log.assets.map((asset, index) => (
          <PreviewPost key={asset.id} asset={asset} index={index} />
        ))}
      </div>
    </aside>
  )
}
