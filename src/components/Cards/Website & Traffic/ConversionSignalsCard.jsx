import { conversionSignalsCardData } from '../../../features/Website & Traffic/data/websiteTrafficMockData'
import {
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './ConversionSignalsCard.css'

export function ConversionSignalsCard({ data = conversionSignalsCardData }) {
  return (
    <article className="website-card conversion-signals-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />

      <MetricDots
        title={data.panelTitle}
        metrics={data.metrics.map((metric) => ({
          ...metric,
          value: `${metric.value} ${metric.delta}`,
          tone: metric.delta.includes('-') ? 'red' : undefined,
        }))}
        columns={3}
        panel="green"
      />

      <section className="conversion-signals-card__ladder">
        <div className="conversion-signals-card__section-head">
          <span>{data.ladderTitle}</span>
          <span>{data.ladderMeta}</span>
        </div>
        <StripedList items={data.ladder} />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default ConversionSignalsCard
