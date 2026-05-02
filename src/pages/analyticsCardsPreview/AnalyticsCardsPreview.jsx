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
import {
  LeadGenerationCard,
  LeadScoringCard,
  SalesAndLeadsCard,
  RevenueFeedbackCard,
  PipelineTrackingCard,
} from '../../components/Cards/Sales and Leads'
import {
  CompetitorTrackingCard,
  GrowthStrategyCard,
  MarketInsightsCard,
  OpportunityDetectionCard,
  RiskDetectionCard,
  StrategyIntelligenceCard,
} from '../../components/Cards/Strategy & Intelligence'
import {
  SocialMediaPublishingCard,
  CaptionGenerationCard,
  ImageGenerationCard,
  SocialMediaManagerCard,
  SocialMediaStrategyCard,
  PerformanceTrackingCard,
} from '../../components/Cards/Social Media Stuffs'
import './AnalyticsCardsPreview.css'

const automationCards = [
  { name: 'Automation & Execution', Component: AutomationExecutionCard },
  { name: 'Task Execution',         Component: TaskExecutionCard },
  { name: 'System Monitoring',      Component: SystemMonitoringCard },
  { name: 'Workflow Automation',    Component: WorkflowAutomationCard },
]

const analyticsCards = [
  { name: 'Campaign Performance',      Component: CampaignPerformanceCard },
  { name: 'Performance Summary',       Component: PerformanceSummaryCard },
  { name: 'Conversion Funnel',         Component: ConversionFunnelCard },
  { name: 'Analytics & Reporting',     Component: AnalyticsReportingCard },
  { name: 'Sales Report',              Component: SalesReportCard },
  { name: 'Traffic Source Breakdown',  Component: TrafficSourceBreakdownCard },
  { name: 'Portfolio Analytics',       Component: PortfolioAnalyticsCard },
]

const websiteCards = [
  { name: 'Website & Traffic',  Component: WebsiteTrafficStatusCard },
  { name: 'SEO Insights',       Component: SEOInsightsCard },
  { name: 'User Behavior',      Component: UserBehaviorCard },
  { name: 'Traffic Quality',    Component: TrafficQualityCard },
  { name: 'Website Traffic',    Component: WebsiteTrafficCard },
  { name: 'Page Performance',   Component: PagePerformanceCard },
  { name: 'Conversion Signals', Component: ConversionSignalsCard },
]

const salesLeadsCards = [
  { name: 'Lead Generation',  Component: LeadGenerationCard },
  { name: 'Lead Scoring',     Component: LeadScoringCard },
  { name: 'Sales and Leads',  Component: SalesAndLeadsCard },
  { name: 'Revenue Feedback', Component: RevenueFeedbackCard },
  { name: 'Pipeline Tracking',Component: PipelineTrackingCard },
]

const strategyCards = [
  { name: 'Strategy & Intelligence', Component: StrategyIntelligenceCard },
  { name: 'Competitor Tracking',     Component: CompetitorTrackingCard },
  { name: 'Growth Strategy',         Component: GrowthStrategyCard },
  { name: 'Market Insights',         Component: MarketInsightsCard },
  { name: 'Opportunity Detection',   Component: OpportunityDetectionCard },
  { name: 'Risk Detection',          Component: RiskDetectionCard },
]

const socialMediaCards = [
  { name: 'Social Media Publishing', Component: SocialMediaPublishingCard },
  { name: 'Caption Generation',      Component: CaptionGenerationCard },
  { name: 'Image Generation',        Component: ImageGenerationCard },
  { name: 'Social Media Manager',    Component: SocialMediaManagerCard },
  { name: 'Social Media Strategy',   Component: SocialMediaStrategyCard },
  { name: 'Performance Tracking',    Component: PerformanceTrackingCard },
]

function PreviewGrid({ title, cards, startIndex = 0 }) {
  return (
    <section className="analytics-cards-preview__section" aria-label={`${title} previews`}>
      <h2 className="analytics-cards-preview__section-title">{title}</h2>
      <div className="analytics-cards-preview__grid">
        {cards.map((card, index) => {
          const PreviewCard = card.Component
          return (
            <div
              className="analytics-cards-preview__item"
              key={card.name}
              style={{ '--preview-index': startIndex + index }}
            >
              <PreviewCard />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function AnalyticsCardsPreview() {
  const automationCount   = automationCards.length
  const websiteCount      = websiteCards.length
  const analyticsCount    = analyticsCards.length
  const strategyCount     = strategyCards.length
  const salesLeadsCount   = salesLeadsCards.length

  return (
    <main className="analytics-cards-preview">
      <header className="analytics-cards-preview__header">
        <div>
          <h1>Analytics Cards Preview</h1>
          <p>Standalone live view for reusable Analytics, Automation, Strategy, Sales and Social Media card components.</p>
        </div>
      </header>

      <PreviewGrid
        title="Automation & Execution"
        cards={automationCards}
      />
      <PreviewGrid
        title="Website & Traffic"
        cards={websiteCards}
        startIndex={automationCount}
      />
      <PreviewGrid
        title="Analytics"
        cards={analyticsCards}
        startIndex={automationCount + websiteCount}
      />
      <PreviewGrid
        title="Strategy & Intelligence"
        cards={strategyCards}
        startIndex={automationCount + websiteCount + analyticsCount}
      />
      <PreviewGrid
        title="Sales & Leads"
        cards={salesLeadsCards}
        startIndex={automationCount + websiteCount + analyticsCount + strategyCount}
      />
      <PreviewGrid
        title="Social Media Stuffs"
        cards={socialMediaCards}
        startIndex={automationCount + websiteCount + analyticsCount + strategyCount + salesLeadsCount}
      />
    </main>
  )
}