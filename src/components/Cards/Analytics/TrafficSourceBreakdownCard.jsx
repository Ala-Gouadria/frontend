import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  MiniLineChart,
  StripedBars,
} from '../../visuals-parts'
import { trafficSourceBreakdownCardData } from '../../../api/analyticsMockData'
import { useTrafficData } from '../../../hooks/useAnalyticsData'
import './TrafficSourceBreakdownCard.css'

function percentNumber(value) {
  return Number.parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
}

function deltaTone(delta) {
  return String(delta).includes('-') ? 'bad' : 'good'
}

function barTone(delta) {
  return String(delta).includes('-') ? 'orange' : 'green'
}

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Traffic Source Breakdown',
      subtitle: 'No data available',
      status: 'No Data',
      topSourceLabel: 'Top Source',
      topSourceValue: 'No data 0%',
      sources: [
        { label: 'Organic', percent: '0%', delta: '0%', width: '0%' },
        { label: 'Direct', percent: '0%', delta: '0%', width: '0%' },
        { label: 'Referral', percent: '0%', delta: '0%', width: '0%' },
      ],
      insight: 'No traffic source data available. Connect Google Analytics to see real data.',
    }
  }

  const current = apiData.current
  const sourceMix = current.sourceMix || {}

  // Get previous period source mix for delta calculation
  const previousMix = apiData.previous?.sourceMix || {}

  // Transform source mix to array and calculate deltas
  const sources = Object.entries(sourceMix)
    .sort((a, b) => b[1] - a[1]) // Sort by percentage descending
    .map(([channel, percentage]) => {
      const prevPct = previousMix[channel] || 0
      const delta = percentage - prevPct
      const channelName = channel.charAt(0).toUpperCase() + channel.slice(1)

      return {
        label: channelName,
        percent: `${Math.round(percentage)}%`,
        delta: delta !== 0 ? `${delta > 0 ? '+' : ''}${delta.toFixed(0)}%` : '0%',
        width: `${Math.round(percentage)}%`,
      }
    })

  // Find top source
  const topSource = sources[0] || { label: 'Organic', percent: '0%' }

  // Build trend chart from history
  const trendPoints = (apiData.history || [])
    .slice(0, 7)
    .reverse()
    .map((h) => (h.sourceMix?.[topSource.label.toLowerCase()] || 0))

  return {
    ...mockData,
    title: 'Traffic Source Breakdown',
    subtitle: 'Real-time data from Google Analytics',
    status: 'Live',
    topSourceLabel: 'Top Source',
    topSourceValue: `${topSource.label} ${topSource.percent}`,
    topSourceChart: {
      points: trendPoints.length > 0 ? trendPoints : mockData.topSourceChart.points,
      fillPoints: trendPoints.length > 0 ? trendPoints : mockData.topSourceChart.fillPoints,
    },
    mixTitle: 'Source Mix',
    sources: sources.length > 0 ? sources : mockData.sources,
    insight: sources.length > 0
      ? `${topSource.label} is your top traffic source at ${topSource.percent}, followed by ${sources[1]?.label || 'other sources'}.`
      : mockData.insight,
    ctaLabel: 'View Source Details',
  }
}

export function TrafficSourceBreakdownCard({ data: propData, useRealData = true }) {
  const { data: apiData, loading, hasRealData } = useTrafficData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, trafficSourceBreakdownCardData)
      if (transformed) return transformed
    }
    return trafficSourceBreakdownCardData
  }, [propData, useRealData, apiData])

  return (
    <article className={`analytics-card traffic-source-breakdown-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.topSourceLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.topSourceValue}</strong>
        </div>
        <MiniLineChart
          points={data.topSourceChart.points}
          fillPoints={data.topSourceChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <section>
        <h3 className="analytics-card__section-title">{data.mixTitle}</h3>
        <div className="analytics-card__source-list">
          {data.sources.map((source) => (
            <div key={source.label}>
              <div className="analytics-card__source-head">
                <span>{source.label}</span>
                <span>{source.percent}</span>
                <span className={`analytics-card__source-delta--${deltaTone(source.delta)}`}>{source.delta}</span>
              </div>
              <StripedBars value={percentNumber(source.width)} tone={barTone(source.delta)} label={source.label} endLabel={`${source.percent} ${source.delta}`} />
            </div>
          ))}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default TrafficSourceBreakdownCard
