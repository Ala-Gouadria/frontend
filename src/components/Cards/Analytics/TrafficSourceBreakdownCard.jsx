import {
  AiActionButton,
  AiInsight,
  MiniLineChart,
  StripedBars,
} from '../../visuals-parts'
import { trafficSourceBreakdownCardData } from '../../../features/Analytics/data/analyticsMockData'
import './TrafficSourceBreakdownCard.css'

function percentNumber(value) {
  return Number.parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
}

function deltaTone(delta) {
  return String(delta).includes('-') ? 'bad' : 'good'
}

function barTone(delta) {
  return String(delta).includes('-') ? 'orange' : 'green'
}

export function TrafficSourceBreakdownCard({ data = trafficSourceBreakdownCardData }) {
  return (
    <article className="analytics-card traffic-source-breakdown-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.topSourceLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.topSourceValue}</strong>
        </div>
        <MiniLineChart
          points={data.topSourceChart.points}
          fillPoints={data.topSourceChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <section>
        <h3 className="analytics-card__section-title">{data.mixTitle}</h3>
        <div className="analytics-card__source-list">
          {data.sources.map((source) => (
            <div key={source.label}>
              <div className="analytics-card__source-head">
                <span>{source.label}</span>
                <span>{source.percent}</span>
                <span className={`analytics-card__source-delta--${deltaTone(source.delta)}`}>{source.delta}</span>
              </div>
              <StripedBars value={percentNumber(source.width)} tone={barTone(source.delta)} label={source.label} endLabel={`${source.percent} ${source.delta}`} />
            </div>
          ))}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default TrafficSourceBreakdownCard
