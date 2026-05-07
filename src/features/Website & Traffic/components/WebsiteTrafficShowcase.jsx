import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import {
  conversionSignalsCardData,
  pagePerformanceCardData,
  seoInsightsCardData,
  trafficQualityCardData,
  userBehaviorCardData,
  websiteTrafficCardData,
  websiteTrafficStatusCardData,
} from '../data/websiteTrafficMockData.js'
import { SEOInsightsCard } from './SEOInsightsCard.jsx'
import { WebsiteTrafficStatusCard } from './WebsiteTrafficStatusCard.jsx'
import { TrafficQualityCard } from './TrafficQualityCard.jsx'
import { WebsiteTrafficCard } from './WebsiteTrafficCard.jsx'
import { UserBehaviorCard } from './UserBehaviorCard.jsx'
import { PagePerformanceCard } from './PagePerformanceCard.jsx'
import { ConversionSignalsCard } from './ConversionSignalsCard.jsx'
import styles from './WebsiteTrafficShowcase.module.css'

const cards = [
  { label: 'SEO Insights', render: () => <SEOInsightsCard data={seoInsightsCardData} /> },
  { label: 'Website & Traffic', render: () => <WebsiteTrafficStatusCard data={websiteTrafficStatusCardData} /> },
  { label: 'Traffic Quality', render: () => <TrafficQualityCard data={trafficQualityCardData} /> },
  { label: 'Website Traffic', render: () => <WebsiteTrafficCard data={websiteTrafficCardData} /> },
  { label: 'User Behavior', render: () => <UserBehaviorCard data={userBehaviorCardData} /> },
  { label: 'Page Performance', render: () => <PagePerformanceCard data={pagePerformanceCardData} /> },
  { label: 'Conversion Signals', render: () => <ConversionSignalsCard data={conversionSignalsCardData} /> },
]

export function WebsiteTrafficShowcase() {
  return (
    <section className={styles.shell}>
      <div className={styles.headerPill}>
        <span className={styles.logoBubble}>
          <img src={logoMark} alt="" aria-hidden="true" />
        </span>
        <span>Website &amp; Traffic</span>
      </div>

      <div className={styles.stage}>
        <div className={styles.deck}>
          {cards.map(({ label, render }) => (
            <div className={styles.cardColumn} key={label}>
              <p className={styles.cardLabel}>{label}</p>
              {render()}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
