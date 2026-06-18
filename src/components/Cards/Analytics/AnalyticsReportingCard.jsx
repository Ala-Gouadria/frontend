import {
  AiActionButton,
  AiInsight,
  AreaRevenueChart,
  MetricGrid,
  MetricItem,
  MiniBarChart,
  MiniLineChart,
  QualityBlocks,
} from '../../visuals-parts'
import { analyticsReportingCardData } from '../../../api/analyticsMockData'
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
          tone="blue"
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
        <QualityBlocks
          className="analytics-reporting-card__progress-blocks"
          blocks={[
            { tone: 'red', count: activeSegments },
            { tone: 'red-muted', count: data.progress.segments - activeSegments },
          ]}
        />
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default AnalyticsReportingCard
