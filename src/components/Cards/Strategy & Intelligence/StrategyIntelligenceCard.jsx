import './StrategyIntelligenceCardShared.css'
import './StrategyIntelligenceCard.css'
import { StripedBars, DottedDataBars, AiInsight, AiActionButton } from '../../visuals-parts'

export function StrategyIntelligenceCard({
  status = 'Active',
  strategy = 'Retargeting lost Audiences',
  strategyProgress = 55,
  impactValue = 56,
  confidenceLabel = 'Confident',
  confidenceLevel = 'Mid',
  opportunityLevel = 'High',
  reasons = [
    { label: 'Traffic',     value: '80%', columns: [{label:'M',count:3},{label:'T',count:5},{label:'W',count:4},{label:'T',count:6},{label:'F',count:5}] },
    { label: 'Conversion',  value: '60%', columns: [{label:'M',count:4},{label:'T',count:3},{label:'W',count:5},{label:'T',count:2},{label:'F',count:4}] },
    { label: 'Returning',   value: '20%', columns: [{label:'M',count:2},{label:'T',count:3},{label:'W',count:1},{label:'T',count:4},{label:'F',count:2}] },
  ],
  aiText = 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  className = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Strategy &amp; Intelligence</h2>
          <p className="analytics-card__subtitle">Decision making and growth planning</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div className="si-card__section">
        <p className="analytics-card__section-title">Active Strategy</p>
        <div className="analytics-card__row">
          <span className="si-card__green-bold">{strategy}</span>
          <span className="si-card__green-bold">{strategyProgress}%</span>
        </div>
        <StripedBars value={strategyProgress} tone="green" />
      </div>

      <div className="si-card__section">
        <div className="analytics-card__row">
          <span className="analytics-card__label">Expected Impact</span>
          <span className="si-card__green-bold">{impactValue}%</span>
        </div>
        <div className="analytics-card__row si-card__confidence-row">
          <span className="si-card__orange-bold">{confidenceLabel}</span>
          <span className="si-card__muted-small">{confidenceLevel}</span>
        </div>
        <StripedBars value={65} tone="orange" />
      </div>

      <div className="si-card__section">
        <div className="analytics-card__row">
          <span className="si-card__green-bold">Opportunity</span>
          <span className="si-card__green-bold">{opportunityLevel}</span>
        </div>
        <StripedBars value={90} tone="green" />
      </div>

      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {reasons.map((r) => (
              <div key={r.label} className="analytics-card__mini-stat">
                <span>{r.label}</span>
                <strong>{r.value}</strong>
              </div>
            ))}
          </div>
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {reasons.map((r) => (
              <DottedDataBars key={r.label} columns={r.columns} tone="green" />
            ))}
          </div>
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default StrategyIntelligenceCard