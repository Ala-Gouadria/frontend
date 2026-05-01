import './StrategyIntelligenceCardShared.css'
import './MarketInsightsCard.css'
import { MiniLineChart, AiInsight, AiActionButton } from '../../visuals-parts'

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

export function MarketInsightsCard({
  status = 'Active',
  signalsLabel = '3 high-impact signals',
  confidenceLabel = 'High Confident',
  trends = defaultTrends,
  reasonText = 'Users engaging more with problem-solution content over generic posts',
  aiText = 'Market is shifting toward high-value, actionable content with clear outcomes. Increase educational carousels with strong hooks and outcome driven messaging',
  className = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Market Insights</h2>
          <p className="analytics-card__subtitle">Live market trends and behavior shifts</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Rising trends</p>
        <div className="analytics-card__row">
          <span className="mi-card__signals-label">{signalsLabel}</span>
          <span className="mi-card__confidence-label">{confidenceLabel}</span>
        </div>
      </div>

      <div className="mi-card__trends">
        {trends.map((trend) => (
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

      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <p className="mi-card__reason-text">{reasonText}</p>
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default MarketInsightsCard