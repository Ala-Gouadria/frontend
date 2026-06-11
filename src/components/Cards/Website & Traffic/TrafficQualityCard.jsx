import { WebsiteArcGauge } from '../../visuals-parts'
import { trafficQualityCardData } from '../../../api/websiteTrafficMockData'
import {
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './TrafficQualityCard.css'

export function TrafficQualityCard({ data = trafficQualityCardData }) {
  return (
    <article className="website-card traffic-quality-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <WebsiteArcGauge value={data.gauge.current} label={data.gauge.label} progress={data.gauge.progress} />

      <MetricDots title={data.panelTitle} metrics={data.panelMetrics} columns={2} panel="green" />

      <section className="traffic-quality-card__mix">
        <div className="traffic-quality-card__section-head">
          <span>{data.intentMixTitle}</span>
          <span>{data.intentMixMeta}</span>
        </div>
        <StripedList items={data.intentMix} />
      </section>

      <section className="traffic-quality-card__sources">
        <div className="traffic-quality-card__section-head">
          <span>{data.sourceQualityTitle}</span>
          <span>{data.sourceQualityMeta}</span>
        </div>
        <StripedList
          items={data.sources.map((source) => ({
            label: source.label,
            note: source.note,
            value: source.width,
            width: source.width,
            rightTop: source.score,
            rightBottom: source.tag,
            tone: source.tone,
          }))}
        />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default TrafficQualityCard
