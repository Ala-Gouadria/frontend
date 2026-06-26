import { useState, useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './CaptionGenerationCard.css'
import { AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'

const defaultCaptions = [
  `Most people don't fail because they lack talent.\nThey fail because they lack consistency.\n\nYou don't need a perfect plan.\nYou need to show up — even on the days you don't feel like it.\n\nThe ones who win are the ones who keep going when it's boring, slow, and unnoticed.\n\nStart small. Stay consistent. Watch what happens.\n\nIf you're serious about changing your life, type "START" below.`,
  `Your brand voice matters more than your posting frequency.\n\nOne powerful caption beats ten empty ones.\n\nStop chasing trends. Start creating value.\n\nDrop a 🔥 if this hit different.`,
  `The algorithm rewards consistency.\nBut your audience rewards authenticity.\n\nGive them both.`,
]

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials',  count: '8 Images'  },
  { label: 'Twitter Engagement Tips',   count: '10 Images' },
]

function transformData(socialData, defaults) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      status: 'No Data',
      batchLabel: 'No caption batches',
      batchProgress: 0,
      batchTotal: 0,
      captions: ['No captions generated yet. Connect your accounts and create content to see captions here.'],
      upcomingBatch: [{ label: 'No scheduled batches', count: '0 captions' }],
      aiText: 'No caption data available. Generate captions to see activity.',
    }
  }

  // Show connected state but keep default captions (no caption tracking API yet)
  const connectedPlatforms = Object.keys(socialData.platforms).length

  return {
    status: 'Live',
    batchLabel: defaults.batchLabel,
    batchProgress: defaults.batchProgress,
    batchTotal: defaults.batchTotal,
    captions: defaults.captions,
    upcomingBatch: defaults.upcomingBatch,
    aiText: `Connected to ${connectedPlatforms} platforms. Caption generation ready.`,
  }
}

export function CaptionGenerationCard({
  status,
  batchLabel,
  batchProgress,
  batchTotal,
  captions,
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
    captions: captions || defaultCaptions,
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

  const [index, setIndex] = useState(0)
  const [generating, setGenerating] = useState(false)

  function navigate(dir) {
    setGenerating(true)
    setTimeout(() => {
      setIndex((prev) => (prev + dir + data.captions.length) % data.captions.length)
      setGenerating(false)
    }, 600)
  }

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Caption Generation</h2>
          <p className="analytics-card__subtitle">Batch caption production</p>
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

      <div className="cg-card__caption-panel">
        <div className="cg-card__caption-header">
          <span className="cg-card__caption-num">Caption {index + 1}</span>
          {generating
            ? <span className="cg-card__generating">Generating…</span>
            : <span className="cg-card__generating cg-card__generating--done">Ready</span>}
        </div>
        <div className={`cg-card__caption-body ${generating ? 'cg-card__caption-body--loading' : ''}`}>
          {generating
            ? <span className="cg-card__spinner" />
            : <p className="cg-card__caption-text">{data.captions[index]}</p>}
        </div>
        <div className="cg-card__pagination">
          <button onClick={() => navigate(-1)}>‹</button>
          <span>{index + 1}/{data.captions.length}</span>
          <button onClick={() => navigate(1)}>›</button>
        </div>
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

export default CaptionGenerationCard
