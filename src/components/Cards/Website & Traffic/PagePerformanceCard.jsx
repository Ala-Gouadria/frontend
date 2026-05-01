import { WebsiteArcGauge } from '../../visuals-parts'
import { pagePerformanceCardData } from '../../../features/Website & Traffic/data/websiteTrafficMockData'
import {
  CardFooter,
  CardHeader,
  StripedList,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './PagePerformanceCard.css'

export function PagePerformanceCard({ data = pagePerformanceCardData }) {
  return (
    <article className="website-card page-performance-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />

      <section className="page-performance-card__gauges">
        {data.gauges.map((gauge) => (
          <WebsiteArcGauge
            key={gauge.label}
            value={gauge.value}
            label={gauge.label}
            progress={gauge.progress}
            compact
          />
        ))}
      </section>

      <section className="page-performance-card__pages">
        <div className="page-performance-card__section-head">
          <span>{data.leftTitle}</span>
          <span>{data.rightTitle}</span>
        </div>
        <StripedList
          items={data.pages.map((page) => ({
            label: page.label,
            note: page.note,
            value: page.width,
            width: page.width,
            rightTop: page.value,
            rightBottom: page.tag,
          }))}
        />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default PagePerformanceCard
