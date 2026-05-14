import './StrategyIntelligenceCardShared.css'
import './OpportunityDetectionCard.css'
import { MiniLineChart, AiInsight, AiActionButton } from '../../visuals-parts'

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

export function OpportunityDetectionCard({
  status = 'Active',
  topOpportunity = 'Instagram + Organic',
  opportunities = defaultOpportunities,
  reasonText = 'Audience response is strongest where educational content meets high-intent traffic.',
  aiText = 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  className = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Opportunity Detection</h2>
          <p className="analytics-card__subtitle">Growth opportunities identified from live signals</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div className="analytics-card__row">
        <div>
          <p className="analytics-card__section-title">Top Opportunity</p>
          <span className="od-card__opportunity-top">{topOpportunity}</span>
        </div>
        <MiniLineChart className="analytics-card__top-chart" tone="green" />
      </div>

      <div className="od-card__panel">
        <div className="od-card__panel-title">3 high Potential Area</div>
        <div className="analytics-card__panel-body">
          {opportunities.map((opp) => (
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
        </div>
      </div>

      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <p className="od-card__reason-text">{reasonText}</p>
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default OpportunityDetectionCard
