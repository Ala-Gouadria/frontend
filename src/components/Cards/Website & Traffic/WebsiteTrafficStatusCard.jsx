import { MiniLineChart, QualityBlocks, StageFlow } from '../../visuals-parts'
import { websiteTrafficStatusCardData } from '../../../api/websiteTrafficMockData'
import {
  BlockLegend,
  CardFooter,
  CardHeader,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './WebsiteTrafficStatusCard.css'

export function WebsiteTrafficStatusCard({ data = websiteTrafficStatusCardData }) {
  return (
    <article className="website-card website-traffic-status-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />

      <section className="website-traffic-status-card__revenue">
        <div>
          <span className="website-card__label">{data.revenueLabel}</span>
          <p>
            <span className="website-traffic-status-card__down">↓</span>
            <strong>{data.revenueValue}</strong>
          </p>
        </div>
        <MiniLineChart
          points={data.topChart.points}
          fillPoints={data.topChart.fillPoints}
          tone="red"
          className="website-traffic-status-card__chart"
        />
      </section>

      <div className="analytics-card__panel website-traffic-status-card__problem-panel">
        <div className="analytics-card__panel-title">{data.problemTitle}</div>
        <div className="analytics-card__panel-body website-traffic-status-card__problem-body">
          <p className="website-traffic-status-card__problem-desc">{data.problemText}</p>
          <StageFlow
            stages={data.stages}
            activeIndex={data.stages.length - 1}
            className="website-traffic-status-card__stage-flow"
          />
        </div>
      </div>

      <section className="website-traffic-status-card__quality">
        <h3>{data.qualityTitle}</h3>
        <BlockLegend items={data.legend} />
        <QualityBlocks blocks={data.blocks} className="website-traffic-status-card__quality-blocks" />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default WebsiteTrafficStatusCard
