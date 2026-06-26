import { useMemo } from 'react'
import { WebsiteArcGauge } from '../../visuals-parts'
import { trafficQualityCardData } from '../../../api/websiteTrafficMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import {
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './TrafficQualityCard.css'

// Helper to convert array of values to SVG path points
function arrayToChartPoints(values, width = 234, height = 40, baseline = 40) {
  if (!values || values.length === 0) return null
  const max = Math.max(...values, 1)
  const step = width / Math.max(values.length - 1, 1)

  const points = values.map((v, i) => {
    const x = Math.round(i * step)
    const y = Math.round(baseline - (v / max) * (height - 10))
    return `${x},${y}`
  }).join(' ')

  const fillPoints = `0,${baseline} ${points} ${Math.round((values.length - 1) * step)},${baseline}`

  return { points, fillPoints }
}

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Traffic Quality',
      subtitle: 'No data available',
      status: 'No Data',
      trendLabel: 'Quality trend',
      trendValue: 'No traffic data',
      trendDelta: '0%',
      topChart: mockData.topChart,
      gauge: { current: '0', label: 'Quality Score', progress: 0 },
      panelMetrics: [
        { label: 'High intent', value: '0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: 'Bounce risk', value: '0%', bars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      ],
      intentMix: [{ label: 'No data', value: '0%', width: '0%' }],
      sources: [{ label: 'No data', note: 'Connect Analytics', score: 'Score 0', tag: 'N/A', tone: 'gray', width: '0%' }],
      insight: 'No traffic quality data available. Connect Google Analytics to see real data.',
    }
  }

  const current = apiData.current

  // Calculate quality score based on bounce rate and session duration
  const bounceRate = current.bounceRate ? Number(current.bounceRate) * 100 : 50
  const qualityScore = Math.round(100 - bounceRate)

  // Build trend chart
  const trendValues = (apiData.history || []).slice(0, 14).reverse().map((h) => {
    const br = h.bounceRate ? Number(h.bounceRate) * 100 : 50
    return Math.round(100 - br)
  })
  const trendChart = arrayToChartPoints(trendValues)

  // Estimate intent mix from source data
  const sourceMix = current.sourceMix || {}
  const organic = sourceMix['Organic Search'] || sourceMix['organic'] || 0
  const direct = sourceMix['Direct'] || sourceMix['direct'] || 0
  const social = sourceMix['Social'] || sourceMix['social'] || 0

  return {
    ...mockData,
    title: 'Traffic Quality',
    subtitle: 'Real-time data from Google Analytics',
    status: 'Live',
    trendLabel: 'Quality trend',
    trendValue: qualityScore > 60 ? 'Qualified traffic improving' : 'Traffic quality needs work',
    trendDelta: `${apiData.visitorsChange >= 0 ? '+' : ''}${(apiData.visitorsChange || 0).toFixed(1)}%`,
    topChart: trendChart || mockData.topChart,
    gauge: { current: String(qualityScore), label: 'Quality Score', progress: qualityScore / 100 },
    panelMetrics: [
      { label: 'High intent', value: `${Math.round(organic)}%`, bars: mockData.panelMetrics[0].bars },
      { label: 'Bounce risk', value: `${Math.round(bounceRate)}%`, bars: mockData.panelMetrics[1].bars },
    ],
    intentMix: [
      { label: 'High intent', value: `${Math.round(organic)}%`, width: `${Math.min(100, organic)}%` },
      { label: 'Medium intent', value: `${Math.round(direct)}%`, width: `${Math.min(100, direct)}%` },
      { label: 'Low intent', value: `${Math.round(social)}%`, width: `${Math.min(100, social)}%` },
    ],
    sources: [
      { label: 'Organic Search', note: organic > 30 ? 'High quality' : 'Medium quality', score: `Score ${Math.round(organic)}`, tag: 'Strong intent', tone: 'green', width: `${organic}%` },
      { label: 'Direct', note: 'Medium quality', score: `Score ${Math.round(direct)}`, tag: 'Moderate intent', tone: 'orange', width: `${direct}%` },
      { label: 'Social', note: social > 20 ? 'Medium quality' : 'Low quality', score: `Score ${Math.round(social)}`, tag: 'Weak intent', tone: 'red', width: `${social}%` },
    ],
    insight: `Quality score is ${qualityScore}/100. Bounce rate: ${bounceRate.toFixed(1)}%. ${organic > 30 ? 'Organic traffic is driving quality visitors.' : 'Focus on improving organic traffic.'}`,
  }
}

export function TrafficQualityCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, trafficQualityCardData)
      if (transformed) return transformed
    }
    return trafficQualityCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`website-card traffic-quality-card ${loading ? 'loading' : ''}`}>
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <WebsiteArcGauge value={data.gauge.current} label={data.gauge.label} progress={data.gauge.progress} />

      <MetricDots title={data.panelTitle} metrics={data.panelMetrics} columns={2} panel="green" />

      <section className="traffic-quality-card__mix">
        <div className="traffic-quality-card__section-head">
          <span>{data.intentMixTitle}</span>
          <span>{data.intentMixMeta}</span>
        </div>
        <StripedList items={data.intentMix} />
      </section>

      <section className="traffic-quality-card__sources">
        <div className="traffic-quality-card__section-head">
          <span>{data.sourceQualityTitle}</span>
          <span>{data.sourceQualityMeta}</span>
        </div>
        <StripedList
          items={data.sources.map((source) => ({
            label: source.label,
            note: source.note,
            value: source.width,
            width: source.width,
            rightTop: source.score,
            rightBottom: source.tag,
            tone: source.tone,
          }))}
        />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default TrafficQualityCard
