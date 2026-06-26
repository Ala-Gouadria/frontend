import { useMemo } from 'react'
import './StrategyIntelligenceCardShared.css'
import './RiskDetectionCard.css'
import { MiniLineChart, ColoredPanel, AiInsight, AiActionButton } from '../../visuals-parts'
import { useTrafficData, useSocialData } from '../../../hooks/useAnalyticsData'

const defaultRisks = [
  {
    label: 'Low engagement on recent posts',
    statusText: 'Getting worse',
    statusTone: 'bad',
    delta: '-18% engagement',
    points: '0,32 12,28 24,34 36,22 48,30 60,18 72,26 84,20 96,32 108,24 120,30 132,22 144,16 156,28 172,14',
    fillPoints: '0,58 0,32 12,28 24,34 36,22 48,30 60,18 72,26 84,20 96,32 108,24 120,30 132,22 144,16 156,28 172,14 172,58',
  },
  {
    label: 'Drop-off at checkout',
    statusText: 'Stable',
    statusTone: 'neutral',
    delta: '-12% conversions',
    points: '0,40 12,36 24,42 36,34 48,38 60,32 72,40 84,36 96,42 108,28 120,36 132,30 144,38 156,24 172,32',
    fillPoints: '0,58 0,40 12,36 24,42 36,34 48,38 60,32 72,40 84,36 96,42 108,28 120,36 132,30 144,38 156,24 172,32 172,58',
  },
  {
    label: 'Low engagement on recent posts',
    statusText: 'Improving',
    statusTone: 'good',
    delta: '-8% reach',
    points: '0,46 12,42 24,38 36,44 48,36 60,40 72,28 84,34 96,22 108,30 120,18 132,26 144,14 156,20 172,10',
    fillPoints: '0,58 0,46 12,42 24,38 36,44 48,36 60,40 72,28 84,34 96,22 108,30 120,18 132,26 144,14 156,20 172,10 172,58',
  },
]

function transformData(trafficData, socialData, defaults) {
  if (!trafficData && !socialData) return null

  // If no data in either source, show zeros
  if (!trafficData?.current && !socialData?.platforms) {
    return {
      status: 'No Data',
      risks: [
        { ...defaultRisks[0], delta: '0% engagement', statusText: 'No data', statusTone: 'neutral' },
        { ...defaultRisks[1], delta: '0% conversions', statusText: 'No data', statusTone: 'neutral' },
        { ...defaultRisks[2], delta: '0% reach', statusText: 'No data', statusTone: 'neutral' },
      ],
      reasonText: 'No risk data available.',
      aiText: 'Connect your analytics to see risk detection.',
    }
  }

  const visitorsChange = trafficData?.visitorsChange || 0
  const reachGrowth = socialData?.growth?.reach || 0
  const engagementGrowth = socialData?.growth?.engagement || 0

  // Detect risks from negative trends
  const risks = []

  if (engagementGrowth < 0) {
    risks.push({
      ...defaultRisks[0],
      delta: `${engagementGrowth.toFixed(0)}% engagement`,
      statusText: engagementGrowth < -10 ? 'Getting worse' : 'Declining',
      statusTone: engagementGrowth < -10 ? 'bad' : 'neutral',
    })
  }

  if (visitorsChange < 0) {
    risks.push({
      ...defaultRisks[1],
      label: 'Traffic decline detected',
      delta: `${visitorsChange.toFixed(0)}% traffic`,
      statusText: visitorsChange < -10 ? 'Getting worse' : 'Declining',
      statusTone: visitorsChange < -10 ? 'bad' : 'neutral',
    })
  }

  if (reachGrowth < 0) {
    risks.push({
      ...defaultRisks[2],
      delta: `${reachGrowth.toFixed(0)}% reach`,
      statusText: reachGrowth < -10 ? 'Getting worse' : 'Declining',
      statusTone: reachGrowth < -10 ? 'bad' : 'neutral',
    })
  }

  // If no risks detected
  if (risks.length === 0) {
    risks.push({
      ...defaultRisks[0],
      label: 'No significant risks',
      delta: 'All metrics stable',
      statusText: 'Good',
      statusTone: 'good',
    })
  }

  return {
    status: 'Live',
    risks: risks.slice(0, 3),
    reasonText: risks.length > 1 ? 'Multiple metrics showing decline. Review content strategy.' : 'Metrics mostly stable.',
    aiText: `Detected ${risks.length} potential risks. ${engagementGrowth < 0 ? 'Engagement needs attention.' : 'Continue monitoring.'}`,
  }
}

export function RiskDetectionCard({
  status,
  risks,
  reasonText,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: trafficData, loading: loadingTraffic } = useTrafficData({ days: 30 })
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    risks: risks || defaultRisks,
    reasonText: reasonText || 'Content lacks strong hooks and posting consistency is affecting audience retention.',
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
          <h2 className="analytics-card__title">Risk Detection</h2>
          <p className="analytics-card__subtitle">Active performance risks and blockers</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <ColoredPanel title="Reasons" tone="red">
        {data.risks.map((risk, i) => (
          <div key={i} className="rd-card__risk-row">
            <div className="analytics-card__row">
              <span className="rd-card__risk-label">{risk.label}</span>
              <span className="rd-card__risk-delta">{risk.delta}</span>
            </div>
            <span className={`rd-card__risk-status rd-card__risk-status--${risk.statusTone}`}>
              {risk.statusText}
            </span>
            <MiniLineChart
              points={risk.points}
              fillPoints={risk.fillPoints}
              tone="red"
              className="analytics-card__compact-chart"
            />
          </div>
        ))}
      </ColoredPanel>

      <ColoredPanel title="Reasons" tone="orange">
        <p className="rd-card__reason-text">{data.reasonText}</p>
      </ColoredPanel>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default RiskDetectionCard
