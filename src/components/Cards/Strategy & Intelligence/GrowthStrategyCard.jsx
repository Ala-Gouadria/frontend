import './StrategyIntelligenceCardShared.css'
import './GrowthStrategyCard.css'
import { MiniLineChart, StackedBars, ColoredPanel, QualityBlocks, AiInsight, AiActionButton } from '../../visuals-parts'

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

export function GrowthStrategyCard({
  status = 'Active',
  focus = 'Educational Contents',
  segments = defaultSegments,
  content = defaultContent,
  aiText = 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
  className = '',
}) {
  const qualityBlocks = [
    { tone: 'green',  count: 14 },
    { tone: 'blue',   count: 8  },
    { tone: 'orange', count: 3  },
  ]

  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Growth Strategy</h2>
          <p className="analytics-card__subtitle">Current business growth plan</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div className="analytics-card__row">
        <div>
          <p className="analytics-card__section-title">Focusing on</p>
          <span className="gs-card__focus-label">{focus}</span>
        </div>
        <MiniLineChart className="analytics-card__top-chart" tone="green" />
      </div>

      <div className="gs-card__stacked-section">
        <div className="analytics-card__legend">
          {segments.map((s) => (
            <span key={s.label} className="analytics-card__legend-item">
              <span className={`analytics-card__swatch analytics-card__swatch--${s.tone}`} />
              {s.label} {legendMeta[s.tone]}
            </span>
          ))}
        </div>
        <StackedBars segments={segments} />
      </div>

      <ColoredPanel title="Reasons" tone="orange">
        <div className="analytics-card__source-list">
          {content.map((item) => (
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
        <QualityBlocks blocks={qualityBlocks} />
      </ColoredPanel>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default GrowthStrategyCard
