import { useMemo } from 'react'
import './StrategyIntelligenceCardShared.css'
import './CompetitorTrackingCard.css'
import { AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'

const defaultCompetitors = [
  { name: 'Alpha Fit',    platform: 'Instagram', tactic: 'Higher saves',       delta: '+14%', avatarBg: '#f5a623', initials: 'AF' },
  { name: 'Prime Method', platform: 'Instagram', tactic: 'More proof content', delta: '+4%',  avatarBg: '#e84343', initials: 'PM' },
  { name: 'Built Daily',  platform: 'Facebook',  tactic: 'Founder-led posts',  delta: '+9%',  avatarBg: '#4a9fdd', initials: 'BD' },
]

function transformData(socialData, defaults) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      status: 'No Data',
      trackedLabel: '0 brands tracked',
      performanceLabel: 'No comparison data',
      competitors: [
        { name: 'No competitors', platform: '-', tactic: 'Add competitors to track', delta: '0%', avatarBg: '#888', initials: '--' },
      ],
      aiText: 'No competitor data available. Add competitors to track their performance.',
    }
  }

  // Show connected state but no real competitor API yet
  const connectedPlatforms = Object.keys(socialData.platforms).length

  return {
    status: 'Live',
    trackedLabel: defaults.trackedLabel,
    performanceLabel: defaults.performanceLabel,
    competitors: defaults.competitors,
    aiText: `Connected to ${connectedPlatforms} platforms. Competitor tracking ready.`,
  }
}

export function CompetitorTrackingCard({
  status,
  trackedLabel,
  performanceLabel,
  competitors,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    trackedLabel: trackedLabel || '3 active brands',
    performanceLabel: performanceLabel || 'Performing 7% better',
    competitors: competitors || defaultCompetitors,
    aiText: aiText || 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  }

  const data = useMemo(() => {
    if (useRealData && socialData) {
      const transformed = transformData(socialData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, socialData])

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Competitor Tracking</h2>
          <p className="analytics-card__subtitle">Competitor activity and advantage gaps</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Competitors tracked</p>
        <div className="analytics-card__row">
          <span className="ct-card__tracked-label">{data.trackedLabel}</span>
          <span className="ct-card__performance-label">{data.performanceLabel}</span>
        </div>
      </div>

      <div className="analytics-card__source-list">
        {data.competitors.map((c) => (
          <div key={c.name}>
            <div className="analytics-card__source-head">
              <div className="ct-card__competitor-info">
                <div className="ct-card__avatar" style={{ background: c.avatarBg }}>
                  {c.initials}
                </div>
                <div className="ct-card__competitor-meta">
                  <span className="ct-card__competitor-name">{c.name}</span>
                  <span className="ct-card__competitor-platform">{c.platform}</span>
                </div>
              </div>
              <div className="ct-card__competitor-result">
                <span className="ct-card__tactic">{c.tactic}</span>
                <span className="ct-card__delta">{c.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default CompetitorTrackingCard
