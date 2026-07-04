import { useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './PerformanceTrackingCard.css'
import { MiniLineChart, DottedDataBars, StripedBars, AiInsight, AiActionButton, PlatformPerformance } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import { seriesToColumns, topPostsToPerformers } from '../../../lib/socialCardData'
import facebookIcon from '../../../assets/icons/Social-Media-Card-Icon/fb.svg'
import linkedinIcon from '../../../assets/icons/Social-Media-Card-Icon/in.svg'
import instagramIcon from '../../../assets/icons/Social-Media-Card-Icon/instagram.svg'

const defaultMetrics = [
  { label: 'Reach',  value: '+34k', tone: 'good',
    columns: [{label:'M',count:3},{label:'T',count:5},{label:'W',count:4},{label:'T',count:6},{label:'F',count:5},{label:'S',count:4}] },
  { label: 'Saves',  value: '-122', tone: 'bad',
    columns: [{label:'M',count:5},{label:'T',count:4},{label:'W',count:3},{label:'T',count:2},{label:'F',count:3},{label:'S',count:2}] },
  { label: 'CTR',    value: '2.8%', tone: 'neutral',
    columns: [{label:'M',count:3},{label:'T',count:4},{label:'W',count:3},{label:'T',count:5},{label:'F',count:4},{label:'S',count:3}] },
]

const defaultPerformers = [
  { label: 'Educational Posts', value: 65, tone: 'green' },
  { label: 'Proof-based posts',  value: 35, tone: 'green' },
  { label: 'Promotional posts',  value: 25, tone: 'green' },
]

const defaultPlatforms = [
  { id: 'fb', iconSrc: facebookIcon, iconAlt: 'Facebook', bgColor: 'rgba(24,119,242,0.2)', deltaColor: '#1877F2', delta: '+34%', deltaGood: true },
  { id: 'li', iconSrc: linkedinIcon, iconAlt: 'LinkedIn', bgColor: '#BFEBFF', deltaColor: '#007EBB', delta: '+44%', deltaGood: true },
  { id: 'ig', iconSrc: instagramIcon, iconAlt: 'Instagram', bgColor: '#FFC4DE', deltaColor: '#E54F6F', delta: '-12%', deltaGood: false },
]

// Transform real API data to card data format
function transformApiData(apiData, defaults) {
  if (!apiData) return null

  // If API returned but no platforms data, show zeros
  if (!apiData.platforms || Object.keys(apiData.platforms).length === 0) {
    return {
      status: 'No Data',
      trendLabel: 'No Activity',
      metrics: [
        { label: 'Reach', value: '0', tone: 'neutral', columns: defaults.metrics[0].columns },
        { label: 'Engagement', value: '0', tone: 'neutral', columns: defaults.metrics[1].columns },
        { label: 'Eng. Rate', value: '0%', tone: 'neutral', columns: defaults.metrics[2].columns },
      ],
      topPerformers: [
        { label: 'No data', value: 0, tone: 'green' },
      ],
      platforms: [
        { id: 'none', label: '-', color: '#888', bgColor: 'rgba(136,136,136,0.1)', deltaColor: '#888', delta: '0%', deltaGood: true },
      ],
      aiText: 'No social media data available. Connect your social accounts to see performance tracking.',
    }
  }

  const platforms = apiData.platforms

  // Calculate aggregated metrics
  let totalReach = 0
  let totalImpressions = 0
  let totalEngagement = 0
  let totalFollowers = 0

  Object.values(platforms).forEach(p => {
    totalReach += p.reach || 0
    totalImpressions += p.impressions || 0
    totalEngagement += p.engagement || 0
    totalFollowers += p.followers || 0
  })

  // Reach is limited on some platforms (Meta removed FB Page organic reach),
  // so fall back to impressions when reach is unavailable.
  const reachMetric = totalReach > 0 ? totalReach : totalImpressions
  const reachLabel = totalReach > 0 ? 'Reach' : 'Impressions'

  const avgEngagementRate = totalFollowers > 0 ? (totalEngagement / totalFollowers) * 100 : 0

  // Real sparkline columns from the daily trend series (fall back to mock when
  // the series is still too sparse to draw).
  const reachCols = seriesToColumns((apiData.trend || []).map((t) => t.reach)) || defaults.metrics[0].columns
  const engCols = seriesToColumns((apiData.trend || []).map((t) => t.engagement)) || defaults.metrics[1].columns

  // Transform metrics
  const metrics = [
    {
      label: reachLabel,
      value: reachMetric >= 1000 ? `${(reachMetric / 1000).toFixed(1)}k` : String(reachMetric),
      tone: 'good',
      columns: reachCols,
    },
    {
      label: 'Engagement',
      value: totalEngagement.toLocaleString(),
      tone: 'good',
      columns: engCols,
    },
    {
      label: 'Eng. Rate',
      value: `${avgEngagementRate.toFixed(1)}%`,
      tone: 'neutral',
      columns: engCols,
    },
  ]

  // Transform platforms
  const platformsArray = Object.entries(platforms).map(([name, data]) => {
    const engagementChange = ((data.engagement || 0) / (data.followers || 1)) * 100
    const platformMap = {
      facebook: { id: 'fb', iconSrc: facebookIcon, iconAlt: 'Facebook', bgColor: 'rgba(24,119,242,0.2)', deltaColor: '#1877F2' },
      instagram: { id: 'ig', iconSrc: instagramIcon, iconAlt: 'Instagram', bgColor: '#FFC4DE', deltaColor: '#E54F6F' },
      linkedin: { id: 'li', iconSrc: linkedinIcon, iconAlt: 'LinkedIn', bgColor: '#BFEBFF', deltaColor: '#007EBB' },
      twitter: { id: 'tw', label: '𝕏', color: '#1DA1F2', bgColor: 'rgba(29,161,242,0.1)', deltaColor: '#1DA1F2' },
    }

    const config = platformMap[name.toLowerCase()] || { id: name, label: name[0], color: '#888', bgColor: 'rgba(136,136,136,0.1)', deltaColor: '#888' }

    return {
      ...config,
      delta: `${engagementChange >= 0 ? '+' : ''}${engagementChange.toFixed(0)}%`,
      deltaGood: engagementChange >= 0,
    }
  })

  return {
    status: 'Live',
    trendLabel: totalEngagement > 0 ? 'Engagement Growing' : 'No Activity',
    metrics,
    // Real top performers from actual top posts (ranked by engagement).
    topPerformers: topPostsToPerformers(apiData.current?.topPosts) || defaults.topPerformers,
    platforms: platformsArray.length > 0 ? platformsArray : defaults.platforms,
    aiText: `${reachLabel}: ${reachMetric >= 1000 ? `${(reachMetric / 1000).toFixed(1)}k` : reachMetric} across ${platformsArray.length} platforms. Average engagement rate: ${avgEngagementRate.toFixed(1)}%.`,
  }
}

export function PerformanceTrackingCard({
  status,
  trendLabel,
  metrics,
  topPerformers,
  platforms,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: apiData, loading } = useSocialData()

  const defaults = {
    status: status || 'Active',
    trendLabel: trendLabel || 'Sales Boosting',
    metrics: metrics || defaultMetrics,
    topPerformers: topPerformers || defaultPerformers,
    platforms: platforms || defaultPlatforms,
    aiText: aiText || 'Educational and proof-based posts are driving the strongest engagement, while promotional content is underperforming',
  }

  const data = useMemo(() => {
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, apiData])
  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Performance Tracking</h2>
          <p className="analytics-card__subtitle">Live post performance summary</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Overall trend</p>
        <div className="pt-card__trend-row">
          <span className="pt-card__trend-arrow">↑</span>
          <span className="pt-card__trend-label">{data.trendLabel}</span>
        </div>
        <MiniLineChart
          points="0,46 20,42 40,44 60,36 80,38 100,32 120,34 140,28 160,24 172,20"
          fillPoints="0,58 0,46 20,42 40,44 60,36 80,38 100,32 120,34 140,28 160,24 172,20 172,58"
          tone="green"
        />
      </div>

      {/* Metrics panel */}
      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {data.metrics.map(m => (
              <div key={m.label} className="analytics-card__mini-stat">
                <span>{m.label}</span>
                <strong className={m.tone === 'bad' ? 'pt-card__bad' : m.tone === 'good' ? 'pt-card__good' : 'pt-card__neutral'}>
                  {m.value}
                </strong>
              </div>
            ))}
          </div>
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {data.metrics.map(m => (
              <DottedDataBars
                key={m.label}
                columns={m.columns}
                tone={m.tone === 'bad' ? 'red' : 'green'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div>
        <p className="analytics-card__section-title">Top performers</p>
        <div className="pt-card__performers">
          {data.topPerformers.map(p => (
            <div key={p.label} className="pt-card__performer-row">
              <div className="analytics-card__row" style={{ marginBottom: 4 }}>
                <span className="pt-card__performer-label">{p.label}</span>
                <span className="pt-card__performer-val">{p.value}%</span>
              </div>
              <StripedBars value={p.value} tone={p.tone} />
            </div>
          ))}
        </div>
      </div>

      {/* Platform performance */}
      <div>
        <p className="analytics-card__section-title">Platform Performance</p>
        <PlatformPerformance platforms={data.platforms} />
      </div>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default PerformanceTrackingCard
