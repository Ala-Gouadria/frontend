import { useState, useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './CaptionGenerationCard.css'
import { ActivityProgressPill, AiInsight, AiActionButton, DashedCircle } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import { socialApi } from '../../../api/social.js'
import { setDraftCaption } from '../../../lib/contentDraftStore.js'

// Build caption topics grounded in the tenant's actual top-performing posts.
function buildTopics(socialData) {
  const platform = socialData?.current?.platform || 'instagram'
  const posts = socialData?.current?.topPosts || []
  const fromPosts = posts
    .slice(0, 3)
    .map((p) => (p.content || '').replace(/\s+/g, ' ').trim().slice(0, 120))
    .filter(Boolean)
    .map((topic) => ({ topic, platform }))
  if (fromPosts.length) return fromPosts
  return [
    { topic: 'A highlight of our most popular product or offer', platform },
    { topic: 'An engaging tip or value our audience cares about', platform },
    { topic: 'A timely seasonal promotion or announcement', platform },
  ]
}

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
  const [liveCaptions, setLiveCaptions] = useState(null)
  const [error, setError] = useState(null)

  // Real captions from the AI when generated; otherwise the card's defaults.
  const captionsList = liveCaptions ?? data.captions

  function navigate(dir) {
    setIndex((prev) => {
      const next = (prev + dir + captionsList.length) % captionsList.length
      // Keep the publishing card's preview in sync with the visible caption.
      if (liveCaptions) setDraftCaption(captionsList[next])
      return next
    })
  }

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await socialApi.generateCaptions({ topics: buildTopics(socialData) })
      const caps = (res?.captions || []).map((c) => c.caption).filter(Boolean)
      if (caps.length) {
        setLiveCaptions(caps)
        setIndex(0)
        setDraftCaption(caps[0]) // hand off to the publishing card preview
      } else {
        setError('No captions returned')
      }
    } catch (e) {
      setError(e?.message || 'Caption generation failed')
    } finally {
      setGenerating(false)
    }
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
        <ActivityProgressPill
          label={data.batchLabel}
          progress={data.batchTotal ? (data.batchProgress / data.batchTotal) * 100 : 0}
          value={`${data.batchProgress}/${data.batchTotal}`}
        />
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
            : <p className="cg-card__caption-text">{captionsList[index]}</p>}
        </div>
        <div className="cg-card__pagination">
          <button onClick={() => navigate(-1)}>‹</button>
          <span>{index + 1}/{captionsList.length}</span>
          <button onClick={() => navigate(1)}>›</button>
        </div>
      </div>

      <div className="smc-card__upcoming-panel">
        <div className="smc-card__upcoming-title">Upcoming Batch</div>
        <div className="smc-card__upcoming-body">
          {data.upcomingBatch.map(item => (
            <div key={item.label} className="smc-card__upcoming-row">
              <DashedCircle className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{item.label}</span>
              <span className="smc-card__upcoming-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight>{error ? `Couldn't generate: ${error}` : liveCaptions ? 'Fresh captions generated from your top-performing posts.' : data.aiText}</AiInsight>
      <AiActionButton onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating…' : 'Generate captions from top posts'}
      </AiActionButton>
    </div>
  )
}

export default CaptionGenerationCard
