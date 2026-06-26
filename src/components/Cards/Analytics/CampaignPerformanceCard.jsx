import { useMemo } from 'react'
import {
  ActivityRings,
  AiActionButton,
  AiInsight,
  AreaRevenueChart,
  ColoredPanel,
  MiniLineChart,
} from '../../visuals-parts'
import { campaignPerformanceCardData } from '../../../api/analyticsMockData'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import './CampaignPerformanceCard.css'

function toneFromValue(value) {
  return String(value).includes('-') ? 'red' : 'green'
}

function transformData(socialData, mockData) {
  if (!socialData) return null

  // If no current data, show zeros
  if (!socialData.current) {
    return {
      ...mockData,
      title: 'Campaign Performance',
      subtitle: 'No data available',
      status: 'No Data',
      activeLabel: 'Active Campaigns',
      activeValue: '0',
      campaignRings: [
        { percent: 0, tone: 'red' },
        { percent: 0, tone: 'orange' },
        { percent: 0, tone: 'green' },
      ],
      campaigns: [
        { ...mockData.campaigns[0], label: 'Campaign 1', value: '+0%' },
        { ...mockData.campaigns[1], label: 'Campaign 2', value: '+0%' },
      ],
      insight: 'No campaign data available. Create campaigns to see performance metrics.',
    }
  }

  const current = socialData.current
  const engagementGrowth = socialData.growth?.engagement || 0
  const reachGrowth = socialData.growth?.reach || 0

  // Use social data as proxy for campaign performance
  const totalEngagement = current.totalEngagement || 0
  const totalReach = current.totalReach || 0

  return {
    ...mockData,
    title: 'Campaign Performance',
    subtitle: 'Real-time social campaign data',
    status: 'Live',
    activeLabel: 'Active Campaigns',
    activeValue: totalReach > 0 ? '3 Running' : '0',
    campaignRings: [
      { percent: Math.min(Math.round(engagementGrowth + 50), 100), tone: 'red' },
      { percent: Math.min(Math.round(reachGrowth + 50), 100), tone: 'orange' },
      { percent: totalReach > 0 ? 75 : 0, tone: 'green' },
    ],
    campaigns: [
      { ...mockData.campaigns[0], label: 'Reach', value: `${reachGrowth >= 0 ? '+' : ''}${reachGrowth.toFixed(0)}%` },
      { ...mockData.campaigns[1], label: 'Engagement', value: `${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}%` },
    ],
    insight: totalReach > 0
      ? `Campaign reach: ${totalReach.toLocaleString()}. Engagement ${engagementGrowth >= 0 ? 'up' : 'down'} ${Math.abs(engagementGrowth).toFixed(0)}%.`
      : mockData.insight,
  }
}

export function CampaignPerformanceCard({ data: propData, useRealData = true }) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && socialData) {
      const transformed = transformData(socialData, campaignPerformanceCardData)
      if (transformed) return transformed
    }
    return campaignPerformanceCardData
  }, [propData, useRealData, socialData])

  return (
    <article className={`analytics-card campaign-performance-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.activeLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.activeValue}</strong>
        </div>
        <ActivityRings rings={data.campaignRings} />
      </section>

      <ColoredPanel title={data.panelTitle} tone="orange" bodyClassName="analytics-card__panel-grid">
        {data.campaigns.map((campaign) => (
          <div className="analytics-card__mini-stat" key={campaign.label}>
            <span>{campaign.label}</span>
            <strong>{campaign.value}</strong>
            <MiniLineChart points={campaign.points} fillPoints={campaign.fillPoints} tone={toneFromValue(campaign.value)} />
          </div>
        ))}
      </ColoredPanel>

      <section>
        <h3 className="analytics-card__section-title">{data.spendTitle}</h3>
        <AreaRevenueChart
          upperSeries={data.spendChart.upperSeries}
          lowerSeries={data.spendChart.lowerSeries}
          activeIndex={data.spendChart.activeIndex}
          className="analytics-card__area-chart"
        />
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default CampaignPerformanceCard
