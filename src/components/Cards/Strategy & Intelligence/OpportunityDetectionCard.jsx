import { useMemo } from 'react'
import './StrategyIntelligenceCardShared.css'
import './OpportunityDetectionCard.css'
import { MiniLineChart, ColoredPanel, AiInsight, AiActionButton } from '../../visuals-parts'
import { useTrafficData, useSocialData } from '../../../hooks/useAnalyticsData'

const defaultOpportunities = [
  {
    label: 'Educational posts on Instagram',
    delta: '+24% reach',
    points: '0,44 20,38 40,42 60,28 80,32 100,26 120,30 140,22 160,28 172,18',
    fillPoints: '0,58 0,44 20,38 40,42 60,28 80,32 100,26 120,30 140,22 160,28 172,18 172,58',
  },
  {
    label: 'Organic traffic to landing page',
    delta: '+18% leads',
    points: '0,48 20,44 40,50 60,38 80,42 100,34 120,40 140,32 160,36 172,28',
    fillPoints: '0,58 0,48 20,44 40,50 60,38 80,42 100,34 120,40 140,32 160,36 172,28 172,58',
  },
  {
    label: 'Proof-based content for retargeting',
    delta: '+11% conversion',
    points: '0,50 20,46 40,52 60,42 80,48 100,38 120,44 140,36 160,42 172,34',
    fillPoints: '0,58 0,50 20,46 40,52 60,42 80,48 100,38 120,44 140,36 160,42 172,34 172,58',
  },
]

function transformData(trafficData, socialData, defaults) {
  if (!trafficData && !socialData) return null

  // If no data in either source, show zeros
  if (!trafficData?.current && !socialData?.platforms) {
    return {
      status: 'No Data',
      topOpportunity: 'No opportunities detected',
      opportunities: defaultOpportunities.map(o => ({ ...o, delta: '+0%' })),
      reasonText: 'No data available to detect opportunities.',
      aiText: 'Connect your analytics to see opportunity insights.',
    }
  }

  const visitorsChange = trafficData?.visitorsChange || 0
  const reachGrowth = socialData?.growth?.reach || 0
  const engagementGrowth = socialData?.growth?.engagement || 0

  // Determine top opportunity based on positive growth
  let topOpp = 'Content Optimization'
  if (reachGrowth > visitorsChange && reachGrowth > engagementGrowth) {
    topOpp = 'Social Reach'
  } else if (visitorsChange > 0) {
    topOpp = 'Traffic Growth'
  } else if (engagementGrowth > 0) {
    topOpp = 'Engagement'
  }

  return {
    status: 'Live',
    topOpportunity: topOpp,
    opportunities: [
      { ...defaultOpportunities[0], delta: `${reachGrowth >= 0 ? '+' : ''}${reachGrowth.toFixed(0)}% reach` },
      { ...defaultOpportunities[1], delta: `${visitorsChange >= 0 ? '+' : ''}${visitorsChange.toFixed(0)}% traffic` },
      { ...defaultOpportunities[2], delta: `${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}% engagement` },
    ],
    reasonText: reachGrowth > 0 || visitorsChange > 0 ? 'Positive trends detected across channels.' : 'Monitor for emerging opportunities.',
    aiText: `Top growth areas: ${topOpp}. Focus on channels showing positive momentum.`,
  }
}

export function OpportunityDetectionCard({
  status,
  topOpportunity,
  opportunities,
  reasonText,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: trafficData, loading: loadingTraffic } = useTrafficData({ days: 30 })
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    topOpportunity: topOpportunity || 'Instagram + Organic',
    opportunities: opportunities || defaultOpportunities,
    reasonText: reasonText || 'Audience response is strongest where educational content meets high-intent traffic.',
    aiText: aiText || 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
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
          <h2 className="analytics-card__title">Opportunity Detection</h2>
          <p className="analytics-card__subtitle">Growth opportunities identified from live signals</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div className="analytics-card__row">
        <div>
          <p className="analytics-card__section-title">Top Opportunity</p>
          <span className="od-card__opportunity-top">{data.topOpportunity}</span>
        </div>
        <MiniLineChart className="analytics-card__top-chart" tone="green" />
      </div>

      <ColoredPanel title="3 high Potential Area" tone="green">
        {data.opportunities.map((opp) => (
          <div key={opp.label} className="od-card__opp-row">
            <div className="analytics-card__row">
              <span className="od-card__opp-label">{opp.label}</span>
              <span className="od-card__opp-delta">{opp.delta}</span>
            </div>
            <MiniLineChart
              points={opp.points}
              fillPoints={opp.fillPoints}
              tone="green"
              className="analytics-card__compact-chart"
            />
          </div>
        ))}
      </ColoredPanel>

      <ColoredPanel title="Reasons" tone="orange">
        <p className="od-card__reason-text">{data.reasonText}</p>
      </ColoredPanel>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default OpportunityDetectionCard
