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

// ─── Mock data (passed explicitly to the data: propData cards) ────────────────
import {
  automationExecutionCardData,
  systemMonitoringCardData,
  taskExecutionCardData,
  workflowAutomationCardData,
} from '../../api/automationExecutionMockData'
import {
  analyticsReportingCardData,
  campaignPerformanceCardData,
  conversionFunnelCardData,
  performanceSummaryCardData,
  portfolioAnalyticsCardData,
  salesReportCardData,
  trafficSourceBreakdownCardData,
} from '../../api/analyticsMockData'
import {
  conversionSignalsCardData,
  pagePerformanceCardData,
  seoInsightsCardData,
  trafficQualityCardData,
  userBehaviorCardData,
  websiteTrafficCardData,
  websiteTrafficStatusCardData,
} from '../../api/websiteTrafficMockData'
import {
  leadGenerationCardData,
  leadScoringCardData,
  pipelineTrackingCardData,
  revenueFeedbackCardData,
  salesAndLeadsCardData,
} from '../../api/salesAndLeadsMockData'

import './AnalyticsCardsPreview.css'

// ─── Card sections ───────────────────────────────────────────────────────────
// Two patterns exist in this codebase:
//   A) { data: propData } cards  → pass data={mockData} to pin mock data explicitly
//   B) individual-prop cards     → useRealData={false} alone works (defaults = mock values)

const automationCards = [
  { name: 'Automation & Execution', Component: AutomationExecutionCard, data: automationExecutionCardData },
  { name: 'Task Execution',         Component: TaskExecutionCard,        data: taskExecutionCardData },
  { name: 'System Monitoring',      Component: SystemMonitoringCard,     data: systemMonitoringCardData },
  { name: 'Workflow Automation',    Component: WorkflowAutomationCard,   data: workflowAutomationCardData },
]

const analyticsCards = [
  { name: 'Campaign Performance',      Component: CampaignPerformanceCard,     data: campaignPerformanceCardData },
  { name: 'Performance Summary',       Component: PerformanceSummaryCard,      data: performanceSummaryCardData },
  { name: 'Conversion Funnel',         Component: ConversionFunnelCard,        data: conversionFunnelCardData },
  { name: 'Analytics & Reporting',     Component: AnalyticsReportingCard,      data: analyticsReportingCardData },
  { name: 'Sales Report',              Component: SalesReportCard,             data: salesReportCardData },
  { name: 'Traffic Source Breakdown',  Component: TrafficSourceBreakdownCard,  data: trafficSourceBreakdownCardData },
  { name: 'Portfolio Analytics',       Component: PortfolioAnalyticsCard,      data: portfolioAnalyticsCardData },
]

const websiteCards = [
  { name: 'Website & Traffic',  Component: WebsiteTrafficStatusCard, data: websiteTrafficStatusCardData },
  { name: 'SEO Insights',       Component: SEOInsightsCard,          data: seoInsightsCardData },
  { name: 'User Behavior',      Component: UserBehaviorCard,         data: userBehaviorCardData },
  { name: 'Traffic Quality',    Component: TrafficQualityCard,       data: trafficQualityCardData },
  { name: 'Website Traffic',    Component: WebsiteTrafficCard,       data: websiteTrafficCardData },
  { name: 'Page Performance',   Component: PagePerformanceCard,      data: pagePerformanceCardData },
  { name: 'Conversion Signals', Component: ConversionSignalsCard,    data: conversionSignalsCardData },
]

const salesLeadsCards = [
  { name: 'Lead Generation',   Component: LeadGenerationCard,   data: leadGenerationCardData },
  { name: 'Lead Scoring',      Component: LeadScoringCard,      data: leadScoringCardData },
  { name: 'Sales and Leads',   Component: SalesAndLeadsCard,    data: salesAndLeadsCardData },
  { name: 'Revenue Feedback',  Component: RevenueFeedbackCard,  data: revenueFeedbackCardData },
  { name: 'Pipeline Tracking', Component: PipelineTrackingCard, data: pipelineTrackingCardData },
]

// Pattern B — individual-prop cards: defaults already match mock data
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

function CardSlot({ card, index }) {
  const { Component, data } = card
  return (
    <div
      className="analytics-cards-preview__item"
      style={{ '--preview-index': index }}
    >
      {/* data prop overrides API fetch; useRealData=false skips all hook transforms */}
      <Component useRealData={false} {...(data ? { data } : {})} />
    </div>
  )
}

function PreviewGrid({ title, cards, startIndex = 0 }) {
  return (
    <section className="analytics-cards-preview__section" aria-label={`${title} previews`}>
      <h2 className="analytics-cards-preview__section-title">{title}</h2>
      <div className="analytics-cards-preview__grid">
        {cards.map((card, index) => (
          <CardSlot key={card.name} card={card} index={startIndex + index} />
        ))}
      </div>
    </section>
  )
}

export default function AnalyticsCardsPreview() {
  const automationCount  = automationCards.length
  const websiteCount     = websiteCards.length
  const analyticsCount   = analyticsCards.length
  const strategyCount    = strategyCards.length
  const salesLeadsCount  = salesLeadsCards.length

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
