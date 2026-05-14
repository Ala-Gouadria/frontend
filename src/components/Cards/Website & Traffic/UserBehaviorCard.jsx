import { userBehaviorCardData } from '../../../api/websiteTrafficMockData'
import {
  CardFooter,
  CardHeader,
  MetricDots,
  StripedList,
  TrendRow,
} from './WebsiteCardParts'
import './WebsiteTrafficCardShared.css'
import './UserBehaviorCard.css'

export function UserBehaviorCard({ data = userBehaviorCardData }) {
  return (
    <article className="website-card user-behavior-card">
      <CardHeader title={data.title} subtitle={data.subtitle} status={data.status} />
      <TrendRow label={data.trendLabel} value={data.trendValue} delta={data.trendDelta} chart={data.topChart} />
      <MetricDots title={data.panelTitle} metrics={data.metrics} columns={3} />

      <section className="user-behavior-card__flow">
        <h3>{data.userflowTitle}</h3>
        <StripedList items={data.userflow} />
      </section>

      <CardFooter insight={data.insight} ctaLabel={data.ctaLabel} />
    </article>
  )
}

export default UserBehaviorCard
