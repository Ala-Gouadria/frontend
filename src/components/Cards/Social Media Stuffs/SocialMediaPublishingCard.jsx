import { useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './SocialMediaPublishingCard.css'
import {
  AiActionButton,
  AiInsight,
  SocialPlatformBadge,
  SocialPostPreview,
} from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import facebookIcon from '../../../assets/icons/Social-Media-Card-Icon/fb.svg'
import linkedinIcon from '../../../assets/icons/Social-Media-Card-Icon/in.svg'
import instagramIcon from '../../../assets/icons/Social-Media-Card-Icon/instagram.svg'
import accountLogo from '../../../assets/logo/Xword-Logo.png'

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials', count: '8 Images' },
  { label: 'Twitter Engagement Tips', count: '10 Images' },
]

const defaultPlatforms = [
  { id: 'fb', iconSrc: facebookIcon, iconAlt: 'Facebook', tone: 'blue', state: 'done' },
  { id: 'li', iconSrc: linkedinIcon, iconAlt: 'LinkedIn', tone: 'blue', state: 'done' },
  { id: 'ig', iconSrc: instagramIcon, iconAlt: 'Instagram', tone: 'pink', state: 'loading' },
]

function transformData(socialData, defaults) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      status: 'No Data',
      batchLabel: 'No scheduled posts',
      batchProgress: 0,
      batchTotal: 0,
      platforms: defaultPlatforms.map(p => ({ ...p, state: 'idle' })),
      upcomingBatch: [{ label: 'No scheduled batches', count: '0 posts' }],
      aiText: 'No publishing data available. Create and schedule posts to see activity.',
    }
  }

  const platforms = socialData.platforms
  const connectedPlatforms = Object.keys(platforms)

  // Build platform badges based on connected accounts
  const platformBadges = []
  const platformMap = {
    facebook: { id: 'fb', iconSrc: facebookIcon, iconAlt: 'Facebook', tone: 'blue' },
    instagram: { id: 'ig', iconSrc: instagramIcon, iconAlt: 'Instagram', tone: 'pink' },
    linkedin: { id: 'li', iconSrc: linkedinIcon, iconAlt: 'LinkedIn', tone: 'blue' },
  }

  connectedPlatforms.forEach(name => {
    const config = platformMap[name.toLowerCase()]
    if (config) {
      platformBadges.push({ ...config, state: 'done' })
    }
  })

  // Fill in missing platforms as idle
  Object.values(platformMap).forEach(p => {
    if (!platformBadges.find(b => b.id === p.id)) {
      platformBadges.push({ ...p, state: 'idle' })
    }
  })

  return {
    status: 'Live',
    batchLabel: `Publishing to ${connectedPlatforms.length} platforms`,
    batchProgress: connectedPlatforms.length,
    batchTotal: 3,
    platforms: platformBadges,
    upcomingBatch: defaults.upcomingBatch,
    aiText: `Connected to ${connectedPlatforms.length} social platforms. Ready to publish content.`,
  }
}

export function SocialMediaPublishingCard({
  status,
  batchLabel,
  batchProgress,
  batchTotal,
  accountName = 'XWorldLTD',
  accountSub = 'Manchester, United Kingdom',
  accountSrc = accountLogo,
  postSrc,
  caption = "Most people don't fail because they lack talent.\nThey fail because they lack consistency....",
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
    platforms: defaultPlatforms,
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
    <div className={`analytics-card smp-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header smp-card__header">
        <div>
          <h2 className="analytics-card__title smp-card__title">Social Media Publishing</h2>
          <p className="analytics-card__subtitle smp-card__subtitle">Post delivery and scheduling</p>
        </div>
        <span className="analytics-card__status smp-card__status">{data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title smp-card__section-title">Current Batch</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{data.batchLabel}</span>
          <span className="smp-card__batch-count">{data.batchProgress}/{data.batchTotal}</span>
        </div>
      </div>

      <div className="smp-card__platforms" aria-label="Publishing platforms">
        {data.platforms.map((platform) => (
          <SocialPlatformBadge key={platform.id} {...platform} />
        ))}
      </div>

      <SocialPostPreview
        accountName={accountName}
        accountSub={accountSub}
        accountSrc={accountSrc}
        postSrc={postSrc}
        caption={caption}
      />

      <div className="smc-card__upcoming-panel smp-card__upcoming-panel">
        <div className="smc-card__upcoming-title">Upcoming Batch</div>
        <div className="smc-card__upcoming-body">
          {data.upcomingBatch.map((item) => (
            <div key={item.label} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{item.label}</span>
              <span className="smc-card__upcoming-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight className="smp-card__insight">{data.aiText}</AiInsight>
      <AiActionButton className="smp-card__action" />
    </div>
  )
}

export default SocialMediaPublishingCard
