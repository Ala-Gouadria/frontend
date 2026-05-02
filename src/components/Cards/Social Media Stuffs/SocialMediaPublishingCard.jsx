import { useState } from 'react'
import './SocialMediaStuffsCardShared.css'
import './SocialMediaPublishingCard.css'
import { AiInsight, AiActionButton, ProgressBars } from '../../visuals-parts'

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials',  count: '8 Images'  },
  { label: 'Twitter Engagement Tips',   count: '10 Images' },
]

const PLATFORMS = [
  { id: 'fb',  icon: 'f',  color: '#4267B2', done: true  },
  { id: 'li',  icon: 'in', color: '#0077B5', done: true  },
  { id: 'ig',  icon: '◎',  color: '#E1306C', done: false },
]

function PlatformBadge({ icon, color, done }) {
  return (
    <span className="smp-card__platform" style={{ '--platform-color': color }}>
      <span className="smp-card__platform-icon">{icon}</span>
      {done
        ? <span className="smp-card__platform-check">✓</span>
        : <span className="smp-card__platform-spinner" />}
    </span>
  )
}

function PostPreview({ src }) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)
  return (
    <div className="smp-card__preview-img">
      {(!loaded || error) && <span className="smp-card__img-spinner" />}
      {!error && (
        <img
          src={src}
          alt="Post preview"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}

export function SocialMediaPublishingCard({
  status       = 'Active',
  batchLabel   = 'Instagram Live Hack posts',
  batchProgress = 7,
  batchTotal   = 12,
  accountName  = 'XWorldLTD',
  accountSub   = 'Manchester, United Kingdom',
  accountSrc,
  postSrc,
  caption      = "Most people don't fail because they lack talent.\nThey fail because they lack consistency....",
  upcomingBatch = defaultBatch,
  aiText       = 'Users are saving educational posts more than other content',
  className    = '',
}) {
  const pct = Math.round((batchProgress / batchTotal) * 100)
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Social Media Publishing</h2>
          <p className="analytics-card__subtitle">Post delivery and scheduling</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current Batch</p>
        <div
          className="smp-card__batch-bar"
          aria-label={`${pct}% of current batch published`}
          title={`${pct}% published`}
        >
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{batchLabel}</span>
          <span className="smp-card__batch-count">{batchProgress}/{batchTotal}</span>
        </div>
      </div>

      <div className="smp-card__platforms">
        {PLATFORMS.map(p => <PlatformBadge key={p.id} {...p} />)}
      </div>

      {/* Post card */}
      <div className="smp-card__post-card">
        <div className="smp-card__post-header">
          <div className="smp-card__account-avatar">
            {accountSrc
              ? <img src={accountSrc} alt={accountName} onError={e => e.target.style.display='none'} />
              : <span>{accountName[0]}</span>}
          </div>
          <div>
            <p className="smp-card__account-name">{accountName}</p>
            <p className="smp-card__account-sub">{accountSub}</p>
          </div>
        </div>
        <PostPreview src={postSrc} />
        <p className="smp-card__caption">{caption}</p>
        <div className="smp-card__actions">
          <span>♡</span><span>◻</span><span>➤</span>
          <span className="smp-card__bookmark">⊹</span>
        </div>
      </div>

      {/* Upcoming Batch panel */}
      <div className="smc-card__upcoming-panel">
        <div className="smc-card__upcoming-title">Upcoming Batch</div>
        <div className="smc-card__upcoming-body">
          {upcomingBatch.map(item => (
            <div key={item.label} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{item.label}</span>
              <span className="smc-card__upcoming-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default SocialMediaPublishingCard
