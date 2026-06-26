import { useMemo } from 'react'
import './StrategyIntelligenceCardShared.css'
import './StrategyIntelligenceCard.css'
import { StripedBars, ProgressBars, DottedDataBars, ColoredPanel, AiInsight, AiActionButton } from '../../visuals-parts'
import { useTrafficData, useSocialData, useRevenueData } from '../../../hooks/useAnalyticsData'

const defaultReasons = [
  { label: 'Traffic',     value: '80%', columns: [{label:'M',count:3},{label:'T',count:5},{label:'W',count:4},{label:'T',count:6},{label:'F',count:5}] },
  { label: 'Conversion',  value: '60%', columns: [{label:'M',count:4},{label:'T',count:3},{label:'W',count:5},{label:'T',count:2},{label:'F',count:4}] },
  { label: 'Returning',   value: '20%', columns: [{label:'M',count:2},{label:'T',count:3},{label:'W',count:1},{label:'T',count:4},{label:'F',count:2}] },
]

function transformData(trafficData, socialData, revenueData, defaults) {
  if (!trafficData && !socialData && !revenueData) return null

  // If no data in any source, show zeros
  if (!trafficData?.current && !socialData?.platforms && !revenueData?.current) {
    return {
      status: 'No Data',
      strategy: 'No active strategy',
      strategyProgress: 0,
      impactValue: 0,
      confidenceLabel: 'No Data',
      confidenceLevel: '-',
      opportunityLevel: '-',
      reasons: defaultReasons.map(r => ({ ...r, value: '0%', columns: r.columns.map(c => ({ ...c, count: 0 })) })),
      aiText: 'No strategy data available. Connect your integrations to see insights.',
    }
  }

  const visitorsChange = trafficData?.visitorsChange || 0
  const reachGrowth = socialData?.growth?.reach || 0
  const engagementGrowth = socialData?.growth?.engagement || 0
  const revenueChange = revenueData?.revenueChange || 0

  // Calculate overall performance score
  const avgGrowth = (visitorsChange + reachGrowth + engagementGrowth + revenueChange) / 4
  const impactScore = Math.max(0, Math.min(100, 50 + Math.round(avgGrowth)))

  // Determine strategy based on metrics
  let strategy = 'Content Optimization'
  if (visitorsChange < 0) strategy = 'Traffic Recovery'
  else if (engagementGrowth < 0) strategy = 'Engagement Boost'
  else if (revenueChange > 0) strategy = 'Revenue Scaling'

  const confidence = avgGrowth > 5 ? 'High' : avgGrowth > 0 ? 'Mid' : 'Low'
  const opportunity = impactScore > 60 ? 'High' : impactScore > 40 ? 'Mid' : 'Low'

  return {
    status: 'Live',
    strategy,
    strategyProgress: Math.max(0, Math.min(100, 50 + Math.round(avgGrowth * 2))),
    impactValue: impactScore,
    confidenceLabel: 'Confident',
    confidenceLevel: confidence,
    opportunityLevel: opportunity,
    reasons: [
      { ...defaultReasons[0], value: `${Math.max(0, Math.min(100, 50 + Math.round(visitorsChange)))}%` },
      { ...defaultReasons[1], value: `${Math.max(0, Math.min(100, 50 + Math.round(engagementGrowth)))}%` },
      { ...defaultReasons[2], value: `${Math.max(0, Math.min(100, 30 + Math.round(revenueChange)))}%` },
    ],
    aiText: `${strategy}: Traffic ${visitorsChange >= 0 ? '+' : ''}${visitorsChange.toFixed(0)}%, Engagement ${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}%, Revenue ${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}%.`,
  }
}

export function StrategyIntelligenceCard({
  status,
  strategy,
  strategyProgress,
  impactValue,
  confidenceLabel,
  confidenceLevel,
  opportunityLevel,
  reasons,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: trafficData, loading: loadingTraffic } = useTrafficData({ days: 30 })
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })
  const { data: revenueData, loading: loadingRevenue } = useRevenueData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    strategy: strategy || 'Retargeting lost Audiences',
    strategyProgress: strategyProgress || 55,
    impactValue: impactValue || 56,
    confidenceLabel: confidenceLabel || 'Confident',
    confidenceLevel: confidenceLevel || 'Mid',
    opportunityLevel: opportunityLevel || 'High',
    reasons: reasons || defaultReasons,
    aiText: aiText || 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  }

  const data = useMemo(() => {
    if (useRealData && (trafficData || socialData || revenueData)) {
      const transformed = transformData(trafficData, socialData, revenueData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, trafficData, socialData, revenueData])

  const loading = loadingTraffic || loadingSocial || loadingRevenue

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Strategy &amp; Intelligence</h2>
          <p className="analytics-card__subtitle">Decision making and growth planning</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div className="si-card__section">
        <p className="analytics-card__section-title">Active Strategy</p>
        <div className="analytics-card__row">
          <span className="si-card__green-bold">{data.strategy}</span>
          <span className="si-card__green-bold">{data.strategyProgress}%</span>
        </div>
        <ProgressBars value={data.strategyProgress} tone="green" />
      </div>

      <div className="si-card__section">
        <div className="analytics-card__row">
          <span className="analytics-card__label">Expected Impact</span>
          <span className="si-card__green-bold">{data.impactValue}%</span>
        </div>
        <div className="analytics-card__row si-card__confidence-row">
          <span className="si-card__orange-bold">{data.confidenceLabel}</span>
          <span className="si-card__muted-small">{data.confidenceLevel}</span>
        </div>
        <StripedBars value={65} tone="orange" />
      </div>

      <div className="si-card__section">
        <div className="analytics-card__row">
          <span className="si-card__green-bold">Opportunity</span>
          <span className="si-card__green-bold">{data.opportunityLevel}</span>
        </div>
        <StripedBars value={90} tone="green" />
      </div>

      <ColoredPanel title="Reasons" tone="orange">
        <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
          {data.reasons.map((r) => (
            <div key={r.label} className="analytics-card__mini-stat">
              <span>{r.label}</span>
              <strong>{r.value}</strong>
            </div>
          ))}
        </div>
        <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
          {data.reasons.map((r) => (
            <DottedDataBars key={r.label} columns={r.columns} tone="green" />
          ))}
        </div>
      </ColoredPanel>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default StrategyIntelligenceCard
