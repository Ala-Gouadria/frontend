import {
  AiActionButton,
  AiInsight,
  ColoredPanel,
  DottedDataBars,
  MiniLineChart,
  SemiCircleGauge,
} from '../../visuals-parts'
import { portfolioAnalyticsCardData } from '../../../api/analyticsMockData'
import './PortfolioAnalyticsCard.css'

export function PortfolioAnalyticsCard({ data = portfolioAnalyticsCardData }) {
  return (
    <article className="analytics-card portfolio-analytics-card">
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

      <ColoredPanel title={data.panelTitle} tone="orange" bodyClassName="analytics-card__panel-grid analytics-card__panel-grid--three">
        {data.summaryItems.map((item) => (
          <div className="analytics-card__mini-stat" key={item.label}>
            <span>{item.label}</span>
            <span>{item.value}</span>
            {item.type === 'line' ? (
              <MiniLineChart points={item.points} fillPoints={item.fillPoints} />
            ) : (
              <DottedDataBars columns={item.columns} tone="green" />
            )}
          </div>
        ))}
      </ColoredPanel>

      <section>
        <h3 className="analytics-card__section-title">{data.gaugeTitle}</h3>
        <div className="analytics-card__gauge-wrap">
          <SemiCircleGauge current={data.gauge.current} target={data.gauge.target} progress={data.gauge.progress} bandWidth={56} />
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default PortfolioAnalyticsCard
