import './StrategyIntelligenceCardShared.css'
import './RiskDetectionCard.css'
import { MiniLineChart, AiInsight, AiActionButton } from '../../visuals-parts'

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

export function RiskDetectionCard({
  status = 'Active',
  risks = defaultRisks,
  reasonText = 'Content lacks strong hooks and posting consistency is affecting audience retention.',
  aiText = 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  className = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Risk Detection</h2>
          <p className="analytics-card__subtitle">Active performance risks and blockers</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div className="rd-card__panel">
        <div className="rd-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          {risks.map((risk, i) => (
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
        </div>
      </div>

      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <p className="rd-card__reason-text">{reasonText}</p>
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default RiskDetectionCard
