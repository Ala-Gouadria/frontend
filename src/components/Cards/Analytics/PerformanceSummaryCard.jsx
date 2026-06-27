import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  ColoredPanel,
  DottedDataBars,
  MiniLineChart,
} from '../../visuals-parts'
import { performanceSummaryCardData } from '../../../api/analyticsMockData'
import { useSocialData, useCrmData } from '../../../hooks/useAnalyticsData'
import { seriesToPoints } from '../../../lib/sparkline'
import './PerformanceSummaryCard.css'

function transformData(socialData, crmData, mockData) {
  // If no data at all, show zeros
  if (!socialData && !crmData) {
    return {
      ...mockData,
      title: 'Performance Summary',
      subtitle: 'No data available',
      status: 'No Data',
      snapshotState: 'No data available',
      results: [
        { label: 'Reach', value: '0', columns: mockData.results[0].columns.map(c => ({ ...c, count: 0 })) },
        { label: 'Engagement', value: '0%', columns: mockData.results[1].columns.map(c => ({ ...c, count: 0 })) },
        { label: 'Leads', value: '0', columns: mockData.results[2].columns.map(c => ({ ...c, count: 0 })) },
      ],
      insight: 'No performance data available. Connect your integrations to see real data.',
    }
  }

  const social = socialData?.current
  const crm = crmData?.current

  const totalReach = social?.totalReach || 0
  // engagementRate is stored as a fraction (engagement / reach); display as a percent.
  const engagementRate = social?.engagementRate ? (Number(social.engagementRate) * 100).toFixed(1) : 0
  const totalLeads = crm?.totalLeads || 0

  const socialGrowth = socialData?.growth?.reach || 0
  const isImproving = socialGrowth >= 0

  // Real time-series for the snapshot chart, drawn from the social trend
  // (engagement per day). Falls back to the mock chart until enough daily
  // snapshots have accrued.
  const trendPoints = seriesToPoints((socialData?.trend ?? []).map((t) => t.engagement))
  const snapshotChart = trendPoints
    ? { ...mockData.snapshotChart, points: trendPoints }
    : mockData.snapshotChart

  return {
    ...mockData,
    title: 'Performance Summary',
    subtitle: 'Real-time outcome snapshot',
    status: 'Live',
    snapshotChart,
    snapshotState: isImproving ? 'Performance improving' : 'Performance declining',
    results: [
      { label: 'Reach', value: totalReach > 1000 ? `${(totalReach / 1000).toFixed(0)}k` : String(totalReach), columns: mockData.results[0].columns },
      { label: 'Engagement', value: `${engagementRate}%`, columns: mockData.results[1].columns },
      { label: 'Leads', value: totalLeads.toLocaleString(), columns: mockData.results[2].columns },
    ],
    insight: totalReach > 0 || totalLeads > 0
      ? `Total reach: ${totalReach.toLocaleString()}. Engagement rate: ${engagementRate}%. ${totalLeads} leads generated.`
      : mockData.insight,
  }
}

export function PerformanceSummaryCard({ data: propData, useRealData = true }) {
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })
  const { data: crmData, loading: loadingCrm } = useCrmData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && (socialData || crmData)) {
      return transformData(socialData, crmData, performanceSummaryCardData)
    }
    return performanceSummaryCardData
  }, [propData, useRealData, socialData, crmData])

  const loading = loadingSocial || loadingCrm

  return (
    <article className={`analytics-card performance-summary-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.snapshotLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.snapshotState}</strong>
        </div>
        <MiniLineChart
          points={data.snapshotChart.points}
          fillPoints={data.snapshotChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <ColoredPanel title={data.panelTitle} tone="orange" bodyClassName="analytics-card__panel-grid analytics-card__panel-grid--three">
        {data.results.map((metric) => (
          <div className="analytics-card__mini-stat" key={metric.label}>
            <span>{metric.label}</span>
            <span>{metric.value}</span>
            <DottedDataBars columns={metric.columns} tone="green" />
          </div>
        ))}
      </ColoredPanel>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default PerformanceSummaryCard
