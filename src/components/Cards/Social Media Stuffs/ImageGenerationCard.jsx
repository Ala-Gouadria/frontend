import { useState, useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './ImageGenerationCard.css'
import { AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import { socialApi } from '../../../api/social.js'
import { resolveAuthedImageUrl } from '../../../api/authedImage.js'
import { setDraftImage } from '../../../lib/contentDraftStore.js'

// Derive an image prompt from the tenant's top-performing post theme.
function buildImagePrompt(socialData) {
  const topPost = socialData?.current?.topPosts?.[0]?.content
  const theme = topPost ? topPost.replace(/\s+/g, ' ').trim().slice(0, 140) : 'our latest product highlight'
  return `Premium social media product photograph for this post theme: "${theme}". Clean, on-brand, vibrant, professional marketing visual.`
}

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

  const [options, setOptions] = useState(null) // array of resolved image URLs
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  // The main ("top") image always reflects the selected option.
  const displayMainSrc = (options && options[selectedIndex]) ?? mainSrc
  const displayThumbs = options ?? thumbnails

  function selectOption(i) {
    if (!options || !options[i]) return
    setSelectedIndex(i)
    setDraftImage(options[i]) // chosen one flows to the publishing card preview
  }

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const basePrompt = buildImagePrompt(socialData)
      // Distinct, on-brand variations so the user has real choices.
      const variations = [
        'front-facing hero product shot, centered composition',
        'flat-lay top-down composition on a clean surface',
        'lifestyle scene with a soft, on-brand background',
        'close-up detail shot highlighting texture and quality',
      ]
      const results = await Promise.all(
        variations.map((v) =>
          socialApi
            .generateImage({ prompt: `${basePrompt} Variation: ${v}.`, style: 'photographic', size: '1024x1024' })
            .then((res) => resolveAuthedImageUrl(res?.imageUrl || res?.url))
            .catch(() => null),
        ),
      )
      const urls = results.filter(Boolean)
      if (urls.length) {
        setOptions(urls)
        setSelectedIndex(0)
        setDraftImage(urls[0]) // default selection → main image + publishing card
      } else {
        setError('No images returned')
      }
    } catch (e) {
      setError(e?.message || 'Image generation failed')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Image Generation</h2>
          <p className="analytics-card__subtitle">Live batch image production</p>
        </div>
        <span className="analytics-card__status">{generating ? 'Generating…' : data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current Batch</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{data.batchLabel}</span>
          <span className="smp-card__batch-count">{data.batchProgress}/{data.batchTotal}</span>
        </div>
      </div>

      <LazyImage src={displayMainSrc} alt="Main generated" className="ig-card__main" />

      <div className="ig-card__thumbs">
        {displayThumbs.map((src, i) => (
          <div
            key={i}
            role="button"
            tabIndex={options ? 0 : -1}
            aria-label={`Select image option ${i + 1}`}
            aria-pressed={options ? i === selectedIndex : undefined}
            onClick={() => selectOption(i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(i) } }}
            className="ig-card__thumb"
            style={{
              cursor: options ? 'pointer' : 'default',
              outline: options && i === selectedIndex ? '2px solid var(--accent, #6c5ce7)' : 'none',
              outlineOffset: 2,
              borderRadius: 8,
            }}
          >
            <LazyImage src={src} alt={`Option ${i + 1}`} />
          </div>
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

      <AiInsight>{error ? `Couldn't generate: ${error}` : options ? 'Pick an option — it updates the main image and the publishing preview.' : data.aiText}</AiInsight>
      <AiActionButton onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating 4 options…' : 'Generate 4 image options'}
      </AiActionButton>
    </div>
  )
}

export default ImageGenerationCard
