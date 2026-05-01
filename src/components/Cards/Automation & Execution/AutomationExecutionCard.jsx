import {
  AiActionButton,
  AiInsight,
  AutomationArcGauge,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { automationExecutionCardData } from '../../../features/Automation & Execution/data/automationExecutionMockData.js'
import './Automation & ExecutionCardShared.css'
import './AutomationExecutionCard.css'

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : 0
}

function getTone(value) {
  const percent = getPercent(value)

  if (percent >= 70) {
    return 'green'
  }

  if (percent >= 50) {
    return 'blue'
  }

  return 'orange'
}

const LANE_TONES = {
  'High Intent': 'green',
  'Campaign Launch': 'blue',
  'Audience Sync': 'orange',
}

export function AutomationExecutionCard({ data = automationExecutionCardData }) {
  const insight =
    'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.'

  return (
    <article className="analytics-card automation-card automation-execution-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row automation-card__topline automation-execution-card__state">
        <span className="analytics-card__label">{data.stateLabel}</span>
        <strong className="analytics-card__value analytics-card__value--good">{data.stateValue}</strong>
      </section>

      <AutomationArcGauge
          progress={data.gauge.progress}
          label={data.gauge.label}
          detail={`${data.stateValue} • ${data.gauge.sublabel}`}
          className="automation-execution-card__gauge"
        />

      <section className="automation-execution-card__lanes">
        <h3>{data.laneTitle}</h3>
        {data.lanes.map((lane) => {
          const tone = LANE_TONES[lane.label] ?? getTone(lane.value)

          return (
            <div
              key={lane.label}
              className={`automation-execution-card__lane automation-execution-card__lane--${tone}`}
            >
              <div className="automation-execution-card__lane-head">
                <span>{lane.label}</span>
                <strong>{lane.value}</strong>
              </div>
              <SegmentedStripedBar
                value={getPercent(lane.value)}
                segments={24}
                tone={tone}
                label={`${lane.label}: ${lane.value} • ${lane.active}/${lane.total}`}
              />
            </div>
          )
        })}
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default AutomationExecutionCard
