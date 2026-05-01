import { WebsiteArcGauge } from '../../visuals-parts'
import { seoInsightsCardData } from '../../../features/Website & Traffic/data/websiteTrafficMockData'
import {
  CardFooter,
  CardHeader,
  StripedRow,
  TrendRow,
} from './WebsiteCardParts'
import { getPercent } from './websiteCardUtils'
import './WebsiteTrafficCardShared.css'
import './SEOInsightsCard.css'

export function SEOInsightsCard({ data = seoInsightsCardData }) {
  return (
    <article className="website-card seo-insights-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <WebsiteArcGauge value={data.gauge.current} label={data.gauge.label} progress={data.gauge.progress} />

      <section className="seo-insights-card__keywords">
        <div className="seo-insights-card__head">
          <span>{data.keywordsTitle}</span>
          <span>{data.keywordsMeta}</span>
        </div>
        {data.keywords.map((keyword) => (
          <StripedRow
            key={keyword.label}
            label={keyword.label}
            note={keyword.note.replace('Â·', '·')}
            value={keyword.delta}
            width={keyword.width}
            rightTop={keyword.rank}
            rightBottom={keyword.delta}
            tone={getPercent(keyword.delta) < 0 ? 'red' : 'green'}
          />
        ))}
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default SEOInsightsCard
