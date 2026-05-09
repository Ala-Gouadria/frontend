import { websiteTrafficCardData } from '../../../api/websiteTrafficMockData'
import {
  BlockLegend,
  BlockMix,
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './WebsiteTrafficCard.css'

export function WebsiteTrafficCard({ data = websiteTrafficCardData }) {
  return (
    <article className="website-card website-traffic-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <MetricDots title={data.panelTitle} metrics={data.reasonMetrics} columns={3} />

      <section className="website-traffic-card__source">
        <h3>{data.sourceMixTitle}</h3>
        <StripedList items={data.sourceMix} />
      </section>

      <section className="website-traffic-card__device">
        <h3>{data.deviceTitle}</h3>
        <BlockLegend items={data.deviceLegend} />
        <BlockMix blocks={data.deviceBlocks} segments={18} />
      </section>

      <section className="website-traffic-card__countries">
        <h3>{data.countriesTitle}</h3>
        {data.countries.map((country) => (
          <div key={country.label}>
            <span>{country.label}</span>
            <strong>{country.value}</strong>
          </div>
        ))}
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default WebsiteTrafficCard
