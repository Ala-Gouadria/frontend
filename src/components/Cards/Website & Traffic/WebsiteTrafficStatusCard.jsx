import { useMemo } from 'react'
import { MiniLineChart, QualityBlocks, StageFlow } from '../../visuals-parts'
import { websiteTrafficStatusCardData } from '../../../api/websiteTrafficMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import {
  BlockLegend,
  CardFooter,
  CardHeader,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './WebsiteTrafficStatusCard.css'

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Website & Traffic',
      subtitle: 'No data available',
      status: 'No Data',
      revenueLabel: 'Traffic Status',
      revenueValue: 'No Data',
      topChart: mockData.topChart,
      problemTitle: 'Main Issue',
      problemText: 'No traffic data available. Connect Google Analytics.',
      stages: ['Visit', 'Engage', 'Convert'],
      legend: [
        { label: 'High Intent', value: '0%', tone: 'green' },
        { label: 'Low intent', value: '0%', tone: 'red' },
      ],
      blocks: [
        { tone: 'gray', count: 15 },
      ],
      insight: 'No traffic data available. Connect Google Analytics to see real data.',
    }
  }

  const current = apiData.current
  const visitorsChange = apiData.visitorsChange || 0

  // Determine traffic status
  let statusText = 'Stable'
  if (visitorsChange > 10) statusText = 'Growing Fast'
  else if (visitorsChange > 0) statusText = 'Growing'
  else if (visitorsChange < -10) statusText = 'Declining Fast'
  else if (visitorsChange < 0) statusText = 'Slowing'

  // Calculate quality from bounce rate
  const bounceRate = current.bounceRate ? Number(current.bounceRate) * 100 : 50
  const highIntent = Math.round(100 - bounceRate)
  const lowIntent = Math.round(bounceRate)

  // Identify main issue
  let problemText = 'Traffic is healthy'
  if (bounceRate > 60) problemText = 'High bounce rate - users leaving early'
  else if (current.pagesPerSession < 2) problemText = 'Low pages per session - weak engagement'
  else if (visitorsChange < -10) problemText = 'Traffic declining - needs attention'

  return {
    ...mockData,
    title: 'Website & Traffic',
    subtitle: 'Real-time data from Google Analytics',
    status: 'Live',
    revenueLabel: 'Traffic Status',
    revenueValue: statusText,
    topChart: mockData.topChart, // Keep mock chart format
    problemTitle: 'Main Issue',
    problemText,
    stages: ['Visit', 'Engage', 'Convert'],
    legend: [
      { label: 'High Intent', value: `${highIntent}%`, tone: 'green' },
      { label: 'Low intent', value: `${lowIntent}%`, tone: 'red' },
    ],
    blocks: [
      { tone: 'green', count: Math.round(highIntent / 100 * 15) },
      { tone: 'red', count: Math.round(lowIntent / 100 * 15) },
    ],
    insight: `Traffic is ${visitorsChange >= 0 ? 'up' : 'down'} ${Math.abs(visitorsChange).toFixed(1)}%. ${highIntent > 50 ? 'Good quality traffic.' : 'Focus on improving traffic quality.'}`,
  }
}

export function WebsiteTrafficStatusCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, websiteTrafficStatusCardData)
      if (transformed) return transformed
    }
    return websiteTrafficStatusCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`website-card website-traffic-status-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />

      <section className="website-traffic-status-card__revenue">
        <div>
          <span className="website-card__label">{data.revenueLabel}</span>
          <p>
            <span className="website-traffic-status-card__down">↓</span>
            <strong>{data.revenueValue}</strong>
          </p>
        </div>
        <MiniLineChart
          points={data.topChart.points}
          fillPoints={data.topChart.fillPoints}
          tone="red"
          className="website-traffic-status-card__chart"
        />
      </section>

      <div className="analytics-card__panel website-traffic-status-card__problem-panel">
        <div className="analytics-card__panel-title">{data.problemTitle}</div>
        <div className="analytics-card__panel-body website-traffic-status-card__problem-body">
          <p className="website-traffic-status-card__problem-desc">{data.problemText}</p>
          <StageFlow
            stages={data.stages}
            activeIndex={data.stages.length - 1}
            className="website-traffic-status-card__stage-flow"
          />
        </div>
      </div>

      <section className="website-traffic-status-card__quality">
        <h3>{data.qualityTitle}</h3>
        <BlockLegend items={data.legend} />
        <QualityBlocks blocks={data.blocks} className="website-traffic-status-card__quality-blocks" />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default WebsiteTrafficStatusCard
