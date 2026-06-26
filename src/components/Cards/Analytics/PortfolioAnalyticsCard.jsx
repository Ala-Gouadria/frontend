import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  ColoredPanel,
  DottedDataBars,
  MiniLineChart,
  SemiCircleGauge,
} from '../../visuals-parts'
import { portfolioAnalyticsCardData } from '../../../api/analyticsMockData'
import { useSocialData, useRevenueData } from '../../../hooks/useAnalyticsData'
import './PortfolioAnalyticsCard.css'

function transformData(socialData, revenueData, mockData) {
  if (!socialData && !revenueData) return null

  // If no current data in either source, show zeros
  if (!socialData?.current && !revenueData?.current) {
    return {
      ...mockData,
      title: 'Portfolio Analytics',
      subtitle: 'No data available',
      status: 'No Data',
      growthLabel: 'Overall Growth',
      growthValue: '+0%',
      summaryItems: [
        { ...mockData.summaryItems[0], label: 'Posts', value: '0' },
        { ...mockData.summaryItems[1], label: 'Reach', value: '0' },
        { ...mockData.summaryItems[2], label: 'Revenue', value: '$0' },
      ],
      gauge: { current: 0, target: 100, progress: 0 },
      insight: 'No portfolio data available. Connect your integrations to see real data.',
    }
  }

  const social = socialData?.current
  const revenue = revenueData?.current

  const reachGrowth = socialData?.growth?.reach || 0
  const revenueChange = revenueData?.revenueChange || 0
  const overallGrowth = (reachGrowth + revenueChange) / 2

  const totalReach = social?.totalReach || 0
  const totalRevenue = revenue?.totalRevenue ? Math.round(revenue.totalRevenue / 1000) : 0
  const postCount = social?.followers ? Math.round(social.followers / 100) : 0 // Estimate

  // Calculate progress towards goals
  const goalProgress = totalReach > 0 ? Math.min(Math.round((totalReach / 100000) * 100), 100) : 0

  return {
    ...mockData,
    title: 'Portfolio Analytics',
    subtitle: 'Real-time performance data',
    status: 'Live',
    growthLabel: 'Overall Growth',
    growthValue: `${overallGrowth >= 0 ? '+' : ''}${overallGrowth.toFixed(0)}%`,
    summaryItems: [
      { ...mockData.summaryItems[0], label: 'Posts', value: postCount.toString() },
      { ...mockData.summaryItems[1], label: 'Reach', value: totalReach > 1000 ? `${(totalReach / 1000).toFixed(0)}k` : totalReach.toString() },
      { ...mockData.summaryItems[2], label: 'Revenue', value: `$${totalRevenue}k` },
    ],
    gauge: { current: goalProgress, target: 100, progress: goalProgress },
    insight: totalReach > 0 || totalRevenue > 0
      ? `Portfolio reach: ${totalReach.toLocaleString()}. Revenue: $${totalRevenue}k. Overall growth ${overallGrowth >= 0 ? 'up' : 'down'} ${Math.abs(overallGrowth).toFixed(0)}%.`
      : mockData.insight,
  }
}

export function PortfolioAnalyticsCard({ data: propData, useRealData = true }) {
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })
  const { data: revenueData, loading: loadingRevenue } = useRevenueData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && (socialData || revenueData)) {
      const transformed = transformData(socialData, revenueData, portfolioAnalyticsCardData)
      if (transformed) return transformed
    }
    return portfolioAnalyticsCardData
  }, [propData, useRealData, socialData, revenueData])

  const loading = loadingSocial || loadingRevenue

  return (
    <article className={`analytics-card portfolio-analytics-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.growthLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.growthValue}</strong>
        </div>
        <MiniLineChart
          points={data.growthChart.points}
          fillPoints={data.growthChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <ColoredPanel title={data.panelTitle} tone="orange" bodyClassName="analytics-card__panel-grid analytics-card__panel-grid--three">
        {data.summaryItems.map((item) => (
          <div className="analytics-card__mini-stat" key={item.label}>
            <span>{item.label}</span>
            <span>{item.value}</span>
            {item.type === 'line' ? (
              <MiniLineChart points={item.points} fillPoints={item.fillPoints} />
            ) : (
              <DottedDataBars columns={item.columns} tone="green" />
            )}
          </div>
        ))}
      </ColoredPanel>

      <section>
        <h3 className="analytics-card__section-title">{data.gaugeTitle}</h3>
        <div className="analytics-card__gauge-wrap">
          <SemiCircleGauge current={data.gauge.current} target={data.gauge.target} progress={data.gauge.progress} />
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default PortfolioAnalyticsCard
