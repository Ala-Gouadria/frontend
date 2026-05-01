import {
  AnalyticsReportingCard,
  CampaignPerformanceCard,
  ConversionFunnelCard,
  PerformanceSummaryCard,
  PortfolioAnalyticsCard,
  SalesReportCard,
  TrafficSourceBreakdownCard,
} from '../../components/Cards/Analytics'
import {
  AutomationExecutionCard,
  SystemMonitoringCard,
  TaskExecutionCard,
  WorkflowAutomationCard,
} from '../../components/Cards/Automation & Execution'
import {
  ConversionSignalsCard,
  PagePerformanceCard,
  SEOInsightsCard,
  TrafficQualityCard,
  UserBehaviorCard,
  WebsiteTrafficCard,
  WebsiteTrafficStatusCard,
} from '../../components/Cards/Website & Traffic'
import './AnalyticsCardsPreview.css'

const automationCards = [
  { name: 'Automation & Execution', Component: AutomationExecutionCard },
  { name: 'Task Execution', Component: TaskExecutionCard },
  { name: 'System Monitoring', Component: SystemMonitoringCard },
  { name: 'Workflow Automation', Component: WorkflowAutomationCard },
]

const analyticsCards = [
  { name: 'Campaign Performance', Component: CampaignPerformanceCard },
  { name: 'Performance Summary', Component: PerformanceSummaryCard },
  { name: 'Conversion Funnel', Component: ConversionFunnelCard },
  { name: 'Analytics & Reporting', Component: AnalyticsReportingCard },
  { name: 'Sales Report', Component: SalesReportCard },
  { name: 'Traffic Source Breakdown', Component: TrafficSourceBreakdownCard },
  { name: 'Portfolio Analytics', Component: PortfolioAnalyticsCard },
]

const websiteCards = [
  { name: 'Website & Traffic', Component: WebsiteTrafficStatusCard },
  { name: 'SEO Insights', Component: SEOInsightsCard },
  { name: 'User Behavior', Component: UserBehaviorCard },
  { name: 'Traffic Quality', Component: TrafficQualityCard },
  { name: 'Website Traffic', Component: WebsiteTrafficCard },
  { name: 'Page Performance', Component: PagePerformanceCard },
  { name: 'Conversion Signals', Component: ConversionSignalsCard },
]

function PreviewGrid({ title, cards, startIndex = 0 }) {
  return (
    <section className="analytics-cards-preview__section" aria-label={`${title} previews`}>
      <h2 className="analytics-cards-preview__section-title">{title}</h2>
      <div className="analytics-cards-preview__grid">
        {cards.map((card, index) => {
          const PreviewCard = card.Component

          return (
            <div className="analytics-cards-preview__item" key={card.name} style={{ '--preview-index': startIndex + index }}>
              <PreviewCard />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function AnalyticsCardsPreview() {
  return (
    <main className="analytics-cards-preview">
      <header className="analytics-cards-preview__header">
        <div>
          <h1>Analytics Cards Preview</h1>
          <p>Standalone live view for reusable Analytics and Automation card components.</p>
        </div>
      </header>

      <PreviewGrid title="Automation & Execution" cards={automationCards} />
      <PreviewGrid title="Website & Traffic" cards={websiteCards} startIndex={automationCards.length} />
      <PreviewGrid title="Analytics" cards={analyticsCards} startIndex={automationCards.length + websiteCards.length} />
    </main>
  )
}
