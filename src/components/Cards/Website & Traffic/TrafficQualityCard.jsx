import { DottedDataBars, MiniLineChart, WebsiteArcGauge } from '../../visuals-parts'
import { trafficQualityCardData } from '../../../features/Website & Traffic/data/websiteTrafficMockData'
import {
  CardFooter,
  CardHeader,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './TrafficQualityCard.css'

function toColumns(bars) {
  return bars.map((count, index) => ({ label: `Point ${index + 1}`, count: Math.max(1, Math.round(count / 12)) }))
}

export function TrafficQualityCard({ data = trafficQualityCardData }) {
  const [intentMetric, bounceMetric] = data.panelMetrics

  return (
    <article className="website-card traffic-quality-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <WebsiteArcGauge value={data.gauge.current} label={data.gauge.label} progress={data.gauge.progress} />

      <section className="traffic-quality-card__health">
        <h3>{data.panelTitle}</h3>
        <div className="traffic-quality-card__health-body">
          <div>
            <span>{intentMetric.label}</span>
            <strong>{intentMetric.value}</strong>
            <DottedDataBars columns={toColumns(intentMetric.bars)} />
          </div>
          <div>
            <span>{bounceMetric.label}</span>
            <strong>{bounceMetric.value}</strong>
            <MiniLineChart points={bounceMetric.points} fillPoints={bounceMetric.fillPoints} />
          </div>
        </div>
      </section>

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
