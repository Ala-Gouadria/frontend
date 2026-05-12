import {
  AiActionButton,
  AiInsight,
  MiniLineChart,
  StripedBars,
} from '../../visuals-parts'
import { conversionFunnelCardData } from '../../../api/analyticsMockData'
import './ConversionFunnelCard.css'

function percentNumber(value) {
  return Number.parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0
}

function toneFromPercent(value) {
  const percent = percentNumber(value)

  if (percent < 30) {
    return 'orange'
  }

  return 'green'
}

export function ConversionFunnelCard({ data = conversionFunnelCardData }) {
  return (
    <article className="analytics-card conversion-funnel-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.visitsLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.visitsValue}</strong>
        </div>
        <MiniLineChart
          points={data.visitsChart.points}
          fillPoints={data.visitsChart.fillPoints}
          className="analytics-card__top-chart"
        />
      </section>

      <section>
        <h3 className="analytics-card__section-title">{data.funnelTitle}</h3>
        <div className="analytics-card__funnel">
          {data.stages.map((stage) => (
            <div className="analytics-card__funnel-row" key={stage.label}>
              <div className="analytics-card__funnel-head">
                <span>{stage.label}</span>
                <span>{stage.percent}</span>
              </div>
              <StripedBars value={percentNumber(stage.width)} tone={toneFromPercent(stage.percent)} label={stage.label} endLabel={stage.percent} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <span className="analytics-card__label">{data.totalConversionLabel}</span>
        <strong className="analytics-card__value analytics-card__value--good">{data.totalConversionValue}</strong>
        <div className="conversion-funnel-card__bottom-chart-wrap">
          <MiniLineChart
            points={data.bottomChart.points}
            fillPoints={data.bottomChart.fillPoints}
            className="conversion-funnel-card__bottom-chart"
          />
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default ConversionFunnelCard
