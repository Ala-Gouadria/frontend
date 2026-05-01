import {
  AiActionButton,
  AiInsight,
  MiniLineChart,
  QualityBlocks,
} from '../../visuals-parts'
import { salesReportCardData } from '../../../features/Analytics/data/analyticsMockData'
import './SalesReportCard.css'

function toneFromValue(value) {
  return String(value).includes('-') ? 'red' : 'green'
}

export function SalesReportCard({ data = salesReportCardData }) {
  return (
    <article className="analytics-card sales-report-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.growthLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.growthValue}</strong>
        </div>
        <MiniLineChart
          points={data.growthChart.points}
          fillPoints={data.growthChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <section className="analytics-card__panel">
        <div className="analytics-card__panel-title">{data.panelTitle}</div>
        <div className="analytics-card__panel-body analytics-card__panel-grid">
          {data.results.map((result) => (
            <div className="analytics-card__mini-stat" key={result.label}>
              <span>{result.label}</span>
              <span>{result.value}</span>
              <MiniLineChart points={result.points} fillPoints={result.fillPoints} tooltips={result.tooltips} tone={toneFromValue(result.value)} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="analytics-card__section-title">{data.sourceTitle}</h3>
        <div className="analytics-card__legend">
          {data.sourceLegend.map((item) => (
            <span className="analytics-card__legend-item" key={item.label}>
              <span className={`analytics-card__swatch analytics-card__swatch--${item.tone}`} />
              {item.label} {item.value}
            </span>
          ))}
        </div>
        <QualityBlocks blocks={data.sourceBlocks} />
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default SalesReportCard
