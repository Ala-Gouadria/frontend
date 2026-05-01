import { MiniLineChart, WebsiteStagePath } from '../../visuals-parts'
import { websiteTrafficStatusCardData } from '../../../features/Website & Traffic/data/websiteTrafficMockData'
import {
  BlockLegend,
  BlockMix,
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

      <section className="website-traffic-status-card__drop">
        <h3>{data.problemTitle}</h3>
        <p>{data.problemText}</p>
        <WebsiteStagePath stages={data.stages} />
      </section>

      <section className="website-traffic-status-card__quality">
        <h3>{data.qualityTitle}</h3>
        <BlockLegend items={data.legend} />
        <BlockMix blocks={data.blocks} segments={15} />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default WebsiteTrafficStatusCard
