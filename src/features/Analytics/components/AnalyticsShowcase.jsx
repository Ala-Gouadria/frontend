import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import {
  analyticsReportingCardData,
  campaignPerformanceCardData,
  conversionFunnelCardData,
  performanceSummaryCardData,
  portfolioAnalyticsCardData,
  salesReportCardData,
  trafficSourceBreakdownCardData,
} from '../data/analyticsMockData.js'
import { AnalyticsReportingCard } from './AnalyticsReportingCard.jsx'
import { PerformanceSummaryCard } from './PerformanceSummaryCard.jsx'
import { CampaignPerformanceCard } from './CampaignPerformanceCard.jsx'
import { PortfolioAnalyticsCard } from './PortfolioAnalyticsCard.jsx'
import { SalesReportCard } from './SalesReportCard.jsx'
import { ConversionFunnelCard } from './ConversionFunnelCard.jsx'
import { TrafficSourceBreakdownCard } from './TrafficSourceBreakdownCard.jsx'
import styles from './AnalyticsShowcase.module.css'

const cards = [
  { label: 'Analytics & Reporting', render: () => <AnalyticsReportingCard data={analyticsReportingCardData} /> },
  { label: 'Performance Summary', render: () => <PerformanceSummaryCard data={performanceSummaryCardData} /> },
  { label: 'Campaign Performance', render: () => <CampaignPerformanceCard data={campaignPerformanceCardData} /> },
  { label: 'Portfolio Analytics', render: () => <PortfolioAnalyticsCard data={portfolioAnalyticsCardData} /> },
  { label: 'Sales Report', render: () => <SalesReportCard data={salesReportCardData} /> },
  { label: 'Conversion Funnel', render: () => <ConversionFunnelCard data={conversionFunnelCardData} /> },
  { label: 'Traffic Source Breakdown', render: () => <TrafficSourceBreakdownCard data={trafficSourceBreakdownCardData} /> },
]

export function AnalyticsShowcase() {
  return (
    <section className={styles.shell}>
      <div className={styles.headerPill}>
        <span className={styles.logoBubble}>
          <img src={logoMark} alt="" aria-hidden="true" />
        </span>
        <span>Analytics Components</span>
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
