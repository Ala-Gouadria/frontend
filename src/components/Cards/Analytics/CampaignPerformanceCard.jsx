import {
  ActivityRings,
  AiActionButton,
  AiInsight,
  AreaRevenueChart,
  ColoredPanel,
  MiniLineChart,
} from '../../visuals-parts'
import { campaignPerformanceCardData } from '../../../api/analyticsMockData'
import './CampaignPerformanceCard.css'

function toneFromValue(value) {
  return String(value).includes('-') ? 'red' : 'green'
}

export function CampaignPerformanceCard({ data = campaignPerformanceCardData }) {
  return (
    <article className="analytics-card campaign-performance-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row">
        <div>
          <span className="analytics-card__label">{data.activeLabel}</span>
          <strong className="analytics-card__value analytics-card__value--good">{data.activeValue}</strong>
        </div>
        <ActivityRings rings={data.campaignRings} />
      </section>

      <ColoredPanel title={data.panelTitle} tone="orange" bodyClassName="analytics-card__panel-grid">
        {data.campaigns.map((campaign) => (
          <div className="analytics-card__mini-stat" key={campaign.label}>
            <span>{campaign.label}</span>
            <strong>{campaign.value}</strong>
            <MiniLineChart points={campaign.points} fillPoints={campaign.fillPoints} tone={toneFromValue(campaign.value)} />
          </div>
        ))}
      </ColoredPanel>

      <section>
        <h3 className="analytics-card__section-title">{data.spendTitle}</h3>
        <AreaRevenueChart
          upperSeries={data.spendChart.upperSeries}
          lowerSeries={data.spendChart.lowerSeries}
          activeIndex={data.spendChart.activeIndex}
          className="analytics-card__area-chart"
        />
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default CampaignPerformanceCard
