import { useMemo } from 'react'
import './StrategyIntelligenceCardShared.css'
import './GrowthStrategyCard.css'
import { MiniLineChart, StackedBars, ColoredPanel, AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData, useRevenueData } from '../../../hooks/useAnalyticsData'

const defaultSegments = [
  { label: 'Strong Hook', value: 25, tone: 'blue' },
  { label: 'Content',     value: 45, tone: 'green' },
  { label: 'Add Resource',value: 30, tone: 'orange' },
]

const defaultContent = [
  { label: 'Educational content',  value: '55%', tone: 'blue' },
  { label: 'Promotional posts',    value: '35%', tone: 'green' },
  { label: 'Collaboration posts',  value: '10%', tone: 'orange' },
]

const legendMeta = { blue: '+25%', green: '35%', orange: '+10%' }

function transformData(socialData, revenueData, defaults) {
  if (!socialData && !revenueData) return null

  // If no data in either source, show zeros
  if (!socialData?.platforms && !revenueData?.current) {
    return {
      status: 'No Data',
      focus: 'No active strategy',
      segments: defaultSegments.map(s => ({ ...s, value: 0 })),
      content: defaultContent.map(c => ({ ...c, value: '0%' })),
      aiText: 'No growth data available. Connect your integrations to see strategy insights.',
    }
  }

  const reachGrowth = socialData?.growth?.reach || 0
  const engagementGrowth = socialData?.growth?.engagement || 0
  const revenueChange = revenueData?.revenueChange || 0

  return {
    status: 'Live',
    focus: reachGrowth > 0 ? 'Audience Growth' : engagementGrowth > 0 ? 'Engagement Focus' : 'Content Strategy',
    segments: defaults.segments,
    content: [
      { ...defaultContent[0], value: `${Math.max(0, 50 + Math.round(reachGrowth))}%` },
      { ...defaultContent[1], value: `${Math.max(0, 35 + Math.round(engagementGrowth / 2))}%` },
      { ...defaultContent[2], value: `${Math.max(0, 15 + Math.round(revenueChange / 3))}%` },
    ],
    aiText: `Growth metrics: Reach ${reachGrowth >= 0 ? '+' : ''}${reachGrowth.toFixed(0)}%, Engagement ${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}%.`,
  }
}

export function GrowthStrategyCard({
  status,
  focus,
  segments,
  content,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: socialData, loading: loadingSocial } = useSocialData({ days: 30 })
  const { data: revenueData, loading: loadingRevenue } = useRevenueData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    focus: focus || 'Educational Contents',
    segments: segments || defaultSegments,
    content: content || defaultContent,
    aiText: aiText || 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  }

  const data = useMemo(() => {
    if (useRealData && (socialData || revenueData)) {
      const transformed = transformData(socialData, revenueData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, socialData, revenueData])

  const loading = loadingSocial || loadingRevenue
  const blockCounts = { blue: 14, green: 8, orange: 3 }

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Growth Strategy</h2>
          <p className="analytics-card__subtitle">Current business growth plan</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div className="analytics-card__row">
        <div>
          <p className="analytics-card__section-title">Focusing on</p>
          <span className="gs-card__focus-label">{data.focus}</span>
        </div>
        <MiniLineChart className="analytics-card__top-chart" tone="green" />
      </div>

      <div className="gs-card__stacked-section">
        <div className="analytics-card__legend">
          {data.segments.map((s) => (
            <span key={s.label} className="analytics-card__legend-item">
              <span className={`analytics-card__swatch analytics-card__swatch--${s.tone}`} />
              {s.label} {legendMeta[s.tone]}
            </span>
          ))}
        </div>
        <StackedBars segments={data.segments} />
      </div>

      <ColoredPanel title="Reasons" tone="orange">
        <div className="analytics-card__source-list">
          {data.content.map((item) => (
            <div key={item.label}>
              <div className="analytics-card__source-head">
                <div className="gs-card__content-row">
                  <span className={`gs-card__dot gs-card__dot--${item.tone}`} />
                  <span className="gs-card__content-label">{item.label}</span>
                </div>
                <span className="gs-card__content-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="gs-card__blocks">
          {Object.entries(blockCounts).flatMap(([tone, count]) =>
            Array.from({ length: count }).map((_, i) => (
              <span key={`${tone}-${i}`} className={`gs-card__block gs-card__block--${tone}`} />
            ))
          )}
        </div>
      </ColoredPanel>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default GrowthStrategyCard
