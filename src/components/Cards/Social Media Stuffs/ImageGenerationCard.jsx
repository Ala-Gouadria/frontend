import { useState, useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './ImageGenerationCard.css'
import { AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials',  count: '8 Images'  },
  { label: 'Twitter Engagement Tips',   count: '10 Images' },
]

function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)
  return (
    <div className={`ig-card__lazy-wrap ${className || ''}`}>
      {(!loaded || error) && <span className="ig-card__img-spinner" />}
      {!error && src && (
        <img
          src={src}
          alt={alt || ''}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      {(error || !src) && loaded === false && (
        <span className="ig-card__img-placeholder" />
      )}
    </div>
  )
}

function transformData(socialData, defaults) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      status: 'No Data',
      batchLabel: 'No image batches',
      batchProgress: 0,
      batchTotal: 0,
      upcomingBatch: [{ label: 'No scheduled batches', count: '0 images' }],
      aiText: 'No image data available. Generate images to see activity.',
    }
  }

  // Show connected state but keep defaults (no image tracking API yet)
  const connectedPlatforms = Object.keys(socialData.platforms).length

  return {
    status: 'Live',
    batchLabel: defaults.batchLabel,
    batchProgress: defaults.batchProgress,
    batchTotal: defaults.batchTotal,
    upcomingBatch: defaults.upcomingBatch,
    aiText: `Connected to ${connectedPlatforms} platforms. Image generation ready.`,
  }
}

export function ImageGenerationCard({
  status,
  batchLabel,
  batchProgress,
  batchTotal,
  mainSrc,
  thumbnails = [null, null, null, null],
  upcomingBatch,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    batchLabel: batchLabel || 'Instagram Live Hack posts',
    batchProgress: batchProgress || 7,
    batchTotal: batchTotal || 12,
    upcomingBatch: upcomingBatch || defaultBatch,
    aiText: aiText || 'Users are saving educational posts more than other content',
  }

  const data = useMemo(() => {
    if (useRealData && socialData) {
      const transformed = transformData(socialData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, socialData])

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Image Generation</h2>
          <p className="analytics-card__subtitle">Live batch image production</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current Batch</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{data.batchLabel}</span>
          <span className="smp-card__batch-count">{data.batchProgress}/{data.batchTotal}</span>
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
          {data.upcomingBatch.map(item => (
            <div key={item.label} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{item.label}</span>
              <span className="smc-card__upcoming-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default ImageGenerationCard
