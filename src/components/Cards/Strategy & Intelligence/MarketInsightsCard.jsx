import { useMemo } from 'react'
import './StrategyIntelligenceCardShared.css'
import './MarketInsightsCard.css'
import { MiniLineChart, ColoredPanel, AiInsight, AiActionButton } from '../../visuals-parts'
import { useTrafficData, useSocialData } from '../../../hooks/useAnalyticsData'

const defaultTrends = [
  {
    label: 'Short-form educational',
    delta: '+28% Growth',
    points: '0,44 20,38 40,42 60,28 80,32 100,24 120,30 140,22 160,28 172,18',
    fillPoints: '0,58 0,44 20,38 40,42 60,28 80,32 100,24 120,30 140,22 160,28 172,18 172,58',
  },
  {
    label: 'Before/after proof',
    delta: '+18% leads',
    points: '0,48 20,44 40,50 60,40 80,44 100,36 120,42 140,34 160,38 172,30',
    fillPoints: '0,58 0,48 20,44 40,50 60,40 80,44 100,36 120,42 140,34 160,38 172,30 172,58',
  },
  {
    label: 'Hook-first captions',
    delta: '+11% conversion',
    points: '0,50 20,46 40,52 60,44 80,48 100,40 120,46 140,38 160,44 172,36',
    fillPoints: '0,58 0,50 20,46 40,52 60,44 80,48 100,40 120,46 140,38 160,44 172,36 172,58',
  },
]

function transformData(trafficData, socialData, defaults) {
  if (!trafficData && !socialData) return null

  // If no data in either source, show zeros
  if (!trafficData?.current && !socialData?.platforms) {
    return {
      status: 'No Data',
      signalsLabel: '0 signals detected',
      confidenceLabel: 'No Data',
      trends: defaultTrends.map(t => ({ ...t, delta: '+0%' })),
      reasonText: 'No market data available.',
      aiText: 'No market insights available. Connect your analytics to see trends.',
    }
  }

  const visitorsChange = trafficData?.visitorsChange || 0
  const reachGrowth = socialData?.growth?.reach || 0
  const engagementGrowth = socialData?.growth?.engagement || 0

  const signalCount = [visitorsChange, reachGrowth, engagementGrowth].filter(v => Math.abs(v) > 5).length

  return {
    status: 'Live',
    signalsLabel: `${signalCount} active signals`,
    confidenceLabel: signalCount >= 2 ? 'High Confidence' : signalCount === 1 ? 'Medium Confidence' : 'Low Confidence',
    trends: [
      { ...defaultTrends[0], delta: `${visitorsChange >= 0 ? '+' : ''}${visitorsChange.toFixed(0)}% Traffic` },
      { ...defaultTrends[1], delta: `${reachGrowth >= 0 ? '+' : ''}${reachGrowth.toFixed(0)}% Reach` },
      { ...defaultTrends[2], delta: `${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}% Engagement` },
    ],
    reasonText: visitorsChange > 0 || reachGrowth > 0 ? 'Positive signals across traffic and social channels.' : 'Mixed signals detected. Monitor closely.',
    aiText: `Traffic ${visitorsChange >= 0 ? 'up' : 'down'} ${Math.abs(visitorsChange).toFixed(0)}%. Social reach ${reachGrowth >= 0 ? 'up' : 'down'} ${Math.abs(reachGrowth).toFixed(0)}%.`,
  }
}

export function MarketInsightsCard({
  status,
  signalsLabel,
  confidenceLabel,
  trends,
  reasonText,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: trafficData, loading: loadingTraffic } = useTrafficData({ days: 30 })
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    signalsLabel: signalsLabel || '3 high-impact signals',
    confidenceLabel: confidenceLabel || 'High Confident',
    trends: trends || defaultTrends,
    reasonText: reasonText || 'Users engaging more with problem-solution content over generic posts',
    aiText: aiText || 'Market is shifting toward high-value, actionable content with clear outcomes. Increase educational carousels with strong hooks and outcome driven messaging',
  }

  const data = useMemo(() => {
    if (useRealData && (trafficData || socialData)) {
      const transformed = transformData(trafficData, socialData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, trafficData, socialData])

  const loading = loadingTraffic || loadingSocial

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Market Insights</h2>
          <p className="analytics-card__subtitle">Live market trends and behavior shifts</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Rising trends</p>
        <div className="analytics-card__row">
          <span className="mi-card__signals-label">{data.signalsLabel}</span>
          <span className="mi-card__confidence-label">{data.confidenceLabel}</span>
        </div>
      </div>

      <div className="mi-card__trends">
        {data.trends.map((trend) => (
          <div key={trend.label} className="mi-card__trend-row">
            <div className="analytics-card__row">
              <span className="mi-card__trend-label">{trend.label}</span>
              <span className="mi-card__trend-delta">{trend.delta}</span>
            </div>
            <MiniLineChart
              points={trend.points}
              fillPoints={trend.fillPoints}
              tone="green"
              className="analytics-card__compact-chart"
            />
          </div>
        ))}
      </div>

      <ColoredPanel title="Reasons" tone="orange">
        <p className="mi-card__reason-text">{data.reasonText}</p>
      </ColoredPanel>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default MarketInsightsCard
