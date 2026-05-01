import './StrategyIntelligenceCardShared.css'
import './CompetitorTrackingCard.css'
import { AiInsight, AiActionButton } from '../../visuals-parts'

const defaultCompetitors = [
  { name: 'Alpha Fit',    platform: 'Instagram', tactic: 'Higher saves',       delta: '+14%', avatarBg: '#f5a623', initials: 'AF' },
  { name: 'Prime Method', platform: 'Instagram', tactic: 'More proof content', delta: '+4%',  avatarBg: '#e84343', initials: 'PM' },
  { name: 'Built Daily',  platform: 'Facebook',  tactic: 'Founder-led posts',  delta: '+9%',  avatarBg: '#4a9fdd', initials: 'BD' },
]

export function CompetitorTrackingCard({
  status = 'Active',
  trackedLabel = '3 active brands',
  performanceLabel = 'Performing 7% better',
  competitors = defaultCompetitors,
  aiText = 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  className = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Competitor Tracking</h2>
          <p className="analytics-card__subtitle">Competitor activity and advantage gaps</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Competitors tracked</p>
        <div className="analytics-card__row">
          <span className="ct-card__tracked-label">{trackedLabel}</span>
          <span className="ct-card__performance-label">{performanceLabel}</span>
        </div>
      </div>

      <div className="analytics-card__source-list">
        {competitors.map((c) => (
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

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default CompetitorTrackingCard