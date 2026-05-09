import './StrategyIntelligenceCardShared.css'
import './RiskDetectionCard.css'
import { MiniLineChart, AiInsight, AiActionButton } from '../../visuals-parts'

const defaultRisks = [
  {
    label: 'Low engagement on recent posts',
    statusText: 'Getting worse',
    statusTone: 'bad',
    delta: '-18% engagement',
    points: '0,28 20,32 40,30 60,36 80,34 100,40 120,38 140,44 160,42 172,48',
    fillPoints: '0,58 0,28 20,32 40,30 60,36 80,34 100,40 120,38 140,44 160,42 172,48 172,58',
  },
  {
    label: 'Drop-off at checkout',
    statusText: 'Stable',
    statusTone: 'neutral',
    delta: '-12% conversions',
    points: '0,34 20,36 40,34 60,38 80,36 100,38 120,36 140,40 160,38 172,40',
    fillPoints: '0,58 0,34 20,36 40,34 60,38 80,36 100,38 120,36 140,40 160,38 172,40 172,58',
  },
  {
    label: 'Low engagement on recent posts',
    statusText: 'Improving',
    statusTone: 'good',
    delta: '-8% reach',
    points: '0,48 20,44 40,46 60,42 80,40 100,36 120,38 140,34 160,32 172,28',
    fillPoints: '0,58 0,48 20,44 40,46 60,42 80,40 100,36 120,38 140,34 160,32 172,28 172,58',
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
