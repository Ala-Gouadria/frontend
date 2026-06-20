import { useState } from 'react'
import './SocialMediaStuffsCardShared.css'
import './ImageGenerationCard.css'
import { AiInsight, AiActionButton, NoraImageLoader } from '../../visuals-parts'

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials',  count: '8 Images'  },
  { label: 'Twitter Engagement Tips',   count: '10 Images' },
]

function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)
  const showLoader = !loaded || error || !src
  return (
    <div className={`ig-card__lazy-wrap ${className || ''}`}>
      {showLoader && <NoraImageLoader className="ig-card__loader" />}
      {!error && src && (
        <img
          src={src}
          alt={alt || ''}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  )
}

export function ImageGenerationCard({
  status        = 'Active',
  batchLabel    = 'Instagram Live Hack posts',
  batchProgress = 7,
  batchTotal    = 12,
  mainSrc,
  thumbnails    = [null, null, null, null],
  upcomingBatch = defaultBatch,
  aiText        = 'Users are saving educational posts more than other content',
  className     = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Image Generation</h2>
          <p className="analytics-card__subtitle">Live batch image production</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current Batch</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{batchLabel}</span>
          <span className="smp-card__batch-count">{batchProgress}/{batchTotal}</span>
        </div>
      </div>

      <LazyImage src={mainSrc} alt="Main generated" className="ig-card__main" />

      <div className="ig-card__thumbs">
        {thumbnails.map((src, i) => (
          <LazyImage key={i} src={src} alt={`Thumb ${i+1}`} className="ig-card__thumb" />
        ))}
      </div>

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

export default ImageGenerationCard
