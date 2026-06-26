import { useMemo } from 'react'
import { conversionSignalsCardData } from '../../../api/websiteTrafficMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import {
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './ConversionSignalsCard.css'

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Conversion Signals',
      subtitle: 'No data available',
      status: 'No Data',
      metrics: [
        { label: 'CTA clicks', value: '0', delta: '+0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Form starts', value: '0', delta: '+0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Checkouts', value: '0', delta: '+0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      ],
      ladder: [
        { label: 'Visit', value: '0%', width: '0%' },
        { label: 'Engage', value: '0%', width: '0%' },
        { label: 'Intent', value: '0%', width: '0%' },
        { label: 'Convert', value: '0%', width: '0%' },
      ],
      insight: 'No conversion data available. Connect Google Analytics to see real data.',
    }
  }

  const current = apiData.current

  // Calculate conversion funnel from available data
  const visitors = current.visitors || 0
  const sessions = current.sessions || 0
  const bounceRate = current.bounceRate ? Number(current.bounceRate) : 0.5

  // Estimate funnel stages
  const engaged = Math.round((1 - bounceRate) * 100)
  const intent = Math.round(engaged * 0.5) // Estimate 50% of engaged show intent
  const converted = Math.round(intent * 0.4) // Estimate 40% of intent converts

  const visitorsChange = apiData.visitorsChange || 0

  return {
    ...mockData,
    title: 'Conversion Signals',
    subtitle: 'Real-time data from Google Analytics',
    status: 'Live',
    metrics: [
      { label: 'CTA clicks', value: 'N/A', delta: '+0%', bars: mockData.metrics[0].bars },
      { label: 'Form starts', value: 'N/A', delta: '+0%', bars: mockData.metrics[1].bars },
      { label: 'Sessions', value: sessions.toLocaleString(), delta: `${visitorsChange >= 0 ? '+' : ''}${visitorsChange.toFixed(0)}%`, bars: mockData.metrics[2].bars },
    ],
    ladder: [
      { label: 'Visit', value: '100%', width: '100%' },
      { label: 'Engage', value: `${engaged}%`, width: `${engaged}%` },
      { label: 'Intent', value: `${intent}%`, width: `${intent}%` },
      { label: 'Convert', value: `${converted}%`, width: `${converted}%` },
    ],
    insight: `${engaged}% of visitors engage with content. Estimated conversion rate: ${converted}%. ${bounceRate > 0.5 ? 'High bounce rate affecting conversions.' : 'Good engagement leading to conversions.'}`,
  }
}

export function ConversionSignalsCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, conversionSignalsCardData)
      if (transformed) return transformed
    }
    return conversionSignalsCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`website-card conversion-signals-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />

      <MetricDots
        title={data.panelTitle}
        metrics={data.metrics.map((metric) => ({
          ...metric,
          value: `${metric.value} ${metric.delta}`,
          tone: metric.delta.includes('-') ? 'red' : undefined,
        }))}
        columns={3}
        panel="green"
      />

      <section className="conversion-signals-card__ladder">
        <div className="conversion-signals-card__section-head">
          <span>{data.ladderTitle}</span>
          <span>{data.ladderMeta}</span>
        </div>
        <StripedList items={data.ladder} />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default ConversionSignalsCard
