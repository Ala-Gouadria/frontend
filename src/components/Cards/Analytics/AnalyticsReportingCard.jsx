import {
  AiActionButton,
  AiInsight,
  AreaRevenueChart,
  MetricGrid,
  MetricItem,
  MiniBarChart,
  MiniLineChart,
} from '../../visuals-parts'
import { analyticsReportingCardData } from '../../../features/Analytics/data/analyticsMockData'
import './AnalyticsReportingCard.css'

function renderRiskMessage(message) {
  const match = String(message).match(/(-?\d+%)/)

  if (!match) {
    return message
  }

  const [highlight] = match
  const [before, after] = String(message).split(highlight)

  return (
    <>
      {before}
      <strong>{highlight}</strong>
      {after}
    </>
  )
}

export function AnalyticsReportingCard({ data = analyticsReportingCardData }) {
  const activeSegments = Math.round((Number.parseFloat(data.progress.value) / 100) * data.progress.segments)

  return (
    <article className="analytics-card analytics-reporting-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <MetricGrid columns={3} className="analytics-card__metric-grid">
        {data.metrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            {metric.type === 'bars' ? (
              <MiniBarChart bars={metric.bars} tone={metric.value.includes('-') ? 'red' : 'ink'} />
            ) : (
              <MiniLineChart points={metric.points} fillPoints={metric.fillPoints} tone={metric.value.includes('-') ? 'red' : 'green'} />
            )}
          </MetricItem>
        ))}
      </MetricGrid>

      <section>
        <h3 className="analytics-card__section-title">{data.chartTitle}</h3>
        <AreaRevenueChart
          upperSeries={data.revenueChart.upperSeries}
          lowerSeries={data.revenueChart.lowerSeries}
          activeIndex={data.revenueChart.activeIndex}
        />
      </section>

      <section className="analytics-card__risk-row">
        <span className="analytics-card__risk-icon">!</span>
        <span>{data.risk.label}</span>
        <span>{renderRiskMessage(data.risk.message)}</span>
      </section>

      <section>
        <div className="analytics-card__progress-head">
          <span>{data.progress.label}</span>
          <strong>{data.progress.value}</strong>
        </div>
        <div className="analytics-card__segmented-progress">
          {Array.from({ length: data.progress.segments }).map((_, index) => (
            <span
              key={`segment-${index}`}
              className={`analytics-card__segment ${index < activeSegments ? 'analytics-card__segment--active' : ''}`}
              title={`${data.progress.label}: segment ${index + 1} of ${data.progress.segments}`}
            />
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

export default AnalyticsReportingCard
