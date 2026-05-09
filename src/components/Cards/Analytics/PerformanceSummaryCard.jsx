import {
  AiActionButton,
  AiInsight,
  DottedDataBars,
  MiniLineChart,
} from '../../visuals-parts'
import { performanceSummaryCardData } from '../../../api/analyticsMockData'
import './PerformanceSummaryCard.css'

export function PerformanceSummaryCard({ data = performanceSummaryCardData }) {
  return (
    <article className="analytics-card performance-summary-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.snapshotLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.snapshotState}</strong>
        </div>
        <MiniLineChart
          points={data.snapshotChart.points}
          fillPoints={data.snapshotChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <section className="analytics-card__panel">
        <div className="analytics-card__panel-title">{data.panelTitle}</div>
        <div className="analytics-card__panel-body analytics-card__panel-grid analytics-card__panel-grid--three">
          {data.results.map((metric) => (
            <div className="analytics-card__mini-stat" key={metric.label}>
              <span>{metric.label}</span>
              <span>{metric.value}</span>
              <DottedDataBars columns={metric.columns} tone="green" />
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

export default PerformanceSummaryCard
