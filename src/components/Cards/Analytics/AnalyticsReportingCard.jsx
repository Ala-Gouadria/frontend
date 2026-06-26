import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  AreaRevenueChart,
  MetricGrid,
  MetricItem,
  MiniBarChart,
  MiniLineChart,
  QualityBlocks,
} from '../../visuals-parts'
import { analyticsReportingCardData } from '../../../api/analyticsMockData'
import { useRevenueData, useTrafficData } from '../../../hooks/useAnalyticsData'
import './AnalyticsReportingCard.css'

function renderRiskMessage(message) {
  const match = String(message).match(/(-?\d+%)/)
  if (!match) return message
  const [highlight] = match
  const [before, after] = String(message).split(highlight)
  return <>{before}<strong>{highlight}</strong>{after}</>
}

function transformData(revenueData, trafficData, mockData) {
  // If no data at all, show zeros
  if (!revenueData && !trafficData) {
    return {
      ...mockData,
      title: 'Analytics & Reporting',
      subtitle: 'No data available',
      status: 'No Data',
      metrics: [
        { label: 'Total Revenue', value: '$0', type: 'bars', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'CRT', value: '0%', type: 'bars', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Growth', value: '+0%', type: 'line', points: mockData.metrics[2].points, fillPoints: mockData.metrics[2].fillPoints },
      ],
      risk: { label: 'Risk', message: 'No data available' },
      progress: { label: 'Data Status', value: '0%', segments: 21 },
      insight: 'No analytics data available. Connect your integrations to see real data.',
    }
  }

  const revenue = revenueData?.current
  const traffic = trafficData?.current
  const revenueChange = revenueData?.revenueChange || 0
  const visitorsChange = trafficData?.visitorsChange || 0

  const totalRevenue = revenue?.totalRevenue ? Math.round(revenue.totalRevenue / 1000) : 0
  const conversionRate = traffic?.bounceRate ? ((1 - Number(traffic.bounceRate)) * 100).toFixed(1) : 0

  return {
    ...mockData,
    title: 'Analytics & Reporting',
    subtitle: 'Real-time performance tracking',
    status: 'Live',
    metrics: [
      { label: 'Total Revenue', value: `$${totalRevenue}k`, type: 'bars', bars: mockData.metrics[0].bars },
      { label: 'CRT', value: `${conversionRate}%`, type: 'bars', bars: mockData.metrics[1].bars },
      { label: 'Growth', value: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}%`, type: 'line', points: mockData.metrics[2].points, fillPoints: mockData.metrics[2].fillPoints },
    ],
    risk: { label: 'Risk', message: visitorsChange < 0 ? `Traffic dropped by ${Math.abs(visitorsChange).toFixed(0)}% recently` : 'No significant risks detected' },
    progress: { label: 'Data Health', value: `${revenue && traffic ? '100' : revenue || traffic ? '50' : '0'}%`, segments: 21 },
    insight: revenue?.totalRevenue > 0
      ? `Total revenue: $${totalRevenue}k. ${revenueChange >= 0 ? 'Revenue growing' : 'Revenue declining'} by ${Math.abs(revenueChange).toFixed(0)}%.`
      : mockData.insight,
  }
}

export function AnalyticsReportingCard({ data: propData, useRealData = true }) {
  const { data: revenueData, loading: loadingRevenue } = useRevenueData({ days: 30 })
  const { data: trafficData, loading: loadingTraffic } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && (revenueData || trafficData)) {
      return transformData(revenueData, trafficData, analyticsReportingCardData)
    }
    return analyticsReportingCardData
  }, [propData, useRealData, revenueData, trafficData])

  const loading = loadingRevenue || loadingTraffic
  const activeSegments = Math.round((Number.parseFloat(data.progress.value) / 100) * data.progress.segments)

  return (
    <article className={`analytics-card analytics-reporting-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <MetricGrid columns={3} className="analytics-card__metric-grid">
        {data.metrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            {metric.type === 'bars' ? (
              <MiniBarChart bars={metric.bars} tone={metric.value.includes('-') ? 'red' : 'ink'} />
            ) : (
              <MiniLineChart points={metric.points} fillPoints={metric.fillPoints} tone={metric.value.includes('-') ? 'red' : 'green'} />
            )}
          </MetricItem>
        ))}
      </MetricGrid>

      <section>
        <h3 className="analytics-card__section-title">{data.chartTitle}</h3>
        <AreaRevenueChart
          upperSeries={data.revenueChart.upperSeries}
          lowerSeries={data.revenueChart.lowerSeries}
          activeIndex={data.revenueChart.activeIndex}
        />
      </section>

      <section className="analytics-card__risk-row">
        <span className="analytics-card__risk-icon">!</span>
        <span>{data.risk.label}</span>
        <span>{renderRiskMessage(data.risk.message)}</span>
      </section>

      <section>
        <div className="analytics-card__progress-head">
          <span>{data.progress.label}</span>
          <strong>{data.progress.value}</strong>
        </div>
        <QualityBlocks
          className="analytics-reporting-card__progress-blocks"
          blocks={[
            { tone: 'red', count: activeSegments },
            { tone: 'red-muted', count: data.progress.segments - activeSegments },
          ]}
        />
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default AnalyticsReportingCard
