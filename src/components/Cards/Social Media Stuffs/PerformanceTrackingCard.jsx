import { useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './PerformanceTrackingCard.css'
import { MiniLineChart, DottedDataBars, StripedBars, AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'

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
  { id: 'fb', label: 'f', color: '#4267B2', bgColor: 'rgba(66,103,178,0.1)', delta: '+34%', deltaGood: true },
  { id: 'li', label: 'in', color: '#0077B5', bgColor: 'rgba(0,119,181,0.1)', delta: '+44%', deltaGood: true },
  { id: 'ig', label: '◎', color: '#E1306C', bgColor: 'rgba(225,48,108,0.1)', delta: '-12%', deltaGood: false },
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
        { id: 'none', label: '-', color: '#888', bgColor: 'rgba(136,136,136,0.1)', delta: '0%', deltaGood: true },
      ],
      aiText: 'No social media data available. Connect your social accounts to see performance tracking.',
    }
  }

  const platforms = apiData.platforms

  // Calculate aggregated metrics
  let totalReach = 0
  let totalEngagement = 0
  let totalFollowers = 0

  Object.values(platforms).forEach(p => {
    totalReach += p.reach || 0
    totalEngagement += p.engagement || 0
    totalFollowers += p.followers || 0
  })

  const avgEngagementRate = totalFollowers > 0 ? (totalEngagement / totalFollowers) * 100 : 0

  // Transform metrics
  const metrics = [
    {
      label: 'Reach',
      value: `${(totalReach / 1000).toFixed(1)}k`,
      tone: 'good',
      columns: defaults.metrics[0].columns, // Keep mock columns
    },
    {
      label: 'Engagement',
      value: totalEngagement.toLocaleString(),
      tone: 'good',
      columns: defaults.metrics[1].columns,
    },
    {
      label: 'Eng. Rate',
      value: `${avgEngagementRate.toFixed(1)}%`,
      tone: 'neutral',
      columns: defaults.metrics[2].columns,
    },
  ]

  // Transform platforms
  const platformsArray = Object.entries(platforms).map(([name, data]) => {
    const engagementChange = ((data.engagement || 0) / (data.followers || 1)) * 100
    const platformMap = {
      facebook: { id: 'fb', label: 'f', color: '#4267B2', bgColor: 'rgba(66,103,178,0.1)' },
      instagram: { id: 'ig', label: '◎', color: '#E1306C', bgColor: 'rgba(225,48,108,0.1)' },
      linkedin: { id: 'li', label: 'in', color: '#0077B5', bgColor: 'rgba(0,119,181,0.1)' },
      twitter: { id: 'tw', label: '𝕏', color: '#1DA1F2', bgColor: 'rgba(29,161,242,0.1)' },
    }

    const config = platformMap[name.toLowerCase()] || { id: name, label: name[0], color: '#888', bgColor: 'rgba(136,136,136,0.1)' }

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
    topPerformers: defaults.topPerformers, // Keep mock for now (need content type breakdown)
    platforms: platformsArray.length > 0 ? platformsArray : defaults.platforms,
    aiText: `Total reach: ${(totalReach / 1000).toFixed(1)}k across ${platformsArray.length} platforms. Average engagement rate: ${avgEngagementRate.toFixed(1)}%.`,
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
  const { data: apiData, loading, hasRealData } = useSocialData()

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
        <div className="pt-card__platforms">
          {data.platforms.map(p => (
            <span key={p.id} className="pt-card__platform-badge" style={{ '--p-color': p.color, '--p-bg': p.bgColor }}>
              <span className="pt-card__platform-icon">{p.label}</span>
              <span className={`pt-card__platform-delta ${p.deltaGood ? 'pt-card__good' : 'pt-card__bad'}`}>{p.delta}</span>
            </span>
          ))}
        </div>
      </div>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default PerformanceTrackingCard
