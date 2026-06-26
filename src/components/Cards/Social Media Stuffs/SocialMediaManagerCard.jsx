import { useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './SocialMediaManagerCard.css'
import {
  ActivityProgressPill,
  AiActionButton,
  AiInsight,
  DottedDataBars,
  MetricVisualPanel,
  MiniLineChart,
  PlatformEngagementCard,
} from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import facebookIcon from '../../../assets/icons/Social-Media-Card-Icon/fb.svg'
import linkedinIcon from '../../../assets/icons/Social-Media-Card-Icon/in.svg'
import instagramIcon from '../../../assets/icons/Social-Media-Card-Icon/instagram.svg'

const defaultEngagement = [
  {
    id: 'fb',
    iconSrc: facebookIcon,
    iconAlt: 'Facebook',
    delta: '+ 32%',
    tone: 'facebook',
    points: '0,36 14,34 28,37 42,35 56,38 70,31 84,32 98,28 112,31 126,26 140,42 154,24 168,47 182,29 194,38',
  },
  {
    id: 'li',
    iconSrc: linkedinIcon,
    iconAlt: 'LinkedIn',
    delta: '+ 32%',
    tone: 'linkedin',
    points: '0,39 14,36 28,38 42,41 56,35 70,37 84,33 98,35 112,29 126,31 140,43 154,24 168,45 182,25 194,39',
  },
  {
    id: 'ig',
    iconSrc: instagramIcon,
    iconAlt: 'Instagram',
    delta: '+ 24%',
    tone: 'instagram',
    points: '0,26 14,43 28,38 42,40 56,36 70,42 84,37 98,40 112,34 126,37 140,35 154,23 168,42 182,54 194,35',
  },
]

const crtColumns = [2, 7, 4, 9, 5, 8, 3, 6, 9, 4, 5, 8, 7, 4]

function transformData(socialData, defaults) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      status: 'No Data',
      currentActivity: 'No active campaigns',
      activityProgress: 0,
      engagement: [
        { ...defaultEngagement[0], delta: '+ 0%' },
        { ...defaultEngagement[1], delta: '+ 0%' },
        { ...defaultEngagement[2], delta: '+ 0%' },
      ],
      crt: '0%',
      share: '+0%',
      aiText: 'No social media data available. Connect your social accounts to see engagement metrics.',
    }
  }

  const platforms = socialData.platforms

  // Calculate engagement deltas per platform
  const engagement = []
  const platformMap = {
    facebook: { id: 'fb', iconSrc: facebookIcon, iconAlt: 'Facebook', tone: 'facebook' },
    instagram: { id: 'ig', iconSrc: instagramIcon, iconAlt: 'Instagram', tone: 'instagram' },
    linkedin: { id: 'li', iconSrc: linkedinIcon, iconAlt: 'LinkedIn', tone: 'linkedin' },
  }

  Object.entries(platforms).forEach(([name, data]) => {
    const config = platformMap[name.toLowerCase()]
    if (config) {
      const engagementRate = data.followers > 0 ? ((data.engagement || 0) / data.followers) * 100 : 0
      engagement.push({
        ...config,
        delta: `${engagementRate >= 0 ? '+ ' : ''}${engagementRate.toFixed(0)}%`,
        points: defaultEngagement.find(e => e.id === config.id)?.points || defaultEngagement[0].points,
      })
    }
  })

  // Use defaults for missing platforms
  while (engagement.length < 3) {
    const missing = defaultEngagement.find(e => !engagement.find(x => x.id === e.id))
    if (missing) engagement.push({ ...missing, delta: '+ 0%' })
    else break
  }

  // Calculate overall metrics
  let totalEngagement = 0
  let totalFollowers = 0
  Object.values(platforms).forEach(p => {
    totalEngagement += p.engagement || 0
    totalFollowers += p.followers || 0
  })

  const avgCrt = totalFollowers > 0 ? ((totalEngagement / totalFollowers) * 100).toFixed(1) : 0
  const shareGrowth = socialData.growth?.reach || 0

  return {
    status: 'Live',
    currentActivity: totalEngagement > 0 ? 'Managing Social Campaigns' : 'No active campaigns',
    activityProgress: totalEngagement > 0 ? 75 : 0,
    engagement,
    crt: `${avgCrt}%`,
    share: `${shareGrowth >= 0 ? '+' : ''}${shareGrowth.toFixed(0)}%`,
    aiText: totalEngagement > 0
      ? `Total engagement: ${totalEngagement.toLocaleString()} across ${Object.keys(platforms).length} platforms.`
      : 'No social media data available. Connect your social accounts to see engagement metrics.',
  }
}

export function SocialMediaManagerCard({
  status,
  currentActivity,
  activityProgress,
  engagement,
  crt,
  share,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    currentActivity: currentActivity || 'Running Instagram Campaign',
    activityProgress: activityProgress || 75,
    engagement: engagement || defaultEngagement,
    crt: crt || '3.2%',
    share: share || '+9%',
    aiText: aiText || 'Instagram is driving the strongest growth today, while LinkedIn needs attention.',
  }

  const data = useMemo(() => {
    if (useRealData && socialData) {
      const transformed = transformData(socialData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, socialData])

  return (
    <div className={`analytics-card smm-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header smm-card__header">
        <div>
          <h2 className="analytics-card__title smm-card__title">Social Media Manager</h2>
          <p className="analytics-card__subtitle smm-card__subtitle">Content, publishing, and engagement</p>
        </div>
        <span className="analytics-card__status smm-card__status">{data.status}</span>
      </div>

      <section className="smm-card__section" aria-label="Current activity">
        <p className="analytics-card__section-title smm-card__section-title">Current Activity</p>
        <ActivityProgressPill
          label={data.currentActivity}
          progress={data.activityProgress}
          className="smm-card__activity"
        />
      </section>

      <section className="smm-card__section" aria-label="Engagement breakdown">
        <p className="analytics-card__section-title smm-card__section-title">Engagement Breakdown</p>
        <div className="smm-card__engagement-grid">
          {data.engagement.map((platform) => (
            <PlatformEngagementCard
              key={platform.id}
              iconSrc={platform.iconSrc}
              iconAlt={platform.iconAlt}
              delta={platform.delta}
              points={platform.points}
              tone={platform.tone}
            />
          ))}
        </div>
      </section>

      <div className="smm-card__metrics-grid">
        <MetricVisualPanel label="CRT" value={data.crt} className="smm-card__metric smm-card__metric--crt">
          <DottedDataBars columns={crtColumns} tone="ink" className="smm-card__dotted-bars" />
        </MetricVisualPanel>
        <MetricVisualPanel label="Share" value={data.share} valueTone="good" className="smm-card__metric smm-card__metric--share">
          <MiniLineChart
            points="0,48 14,42 28,36 42,22 56,18 70,24 84,20 98,26 112,30 126,32 140,34 154,30 168,28 182,12 194,8"
            tone="green"
            className="smm-card__share-chart"
          />
        </MetricVisualPanel>
      </div>

      <AiInsight className="smm-card__insight">{data.aiText}</AiInsight>
      <AiActionButton className="smm-card__action" />
    </div>
  )
}

export default SocialMediaManagerCard
