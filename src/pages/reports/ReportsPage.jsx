import { useMemo, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { AnalyticsReportingCard } from '../../features/Analytics/components/AnalyticsReportingCard'
import { CampaignPerformanceCard } from '../../features/Analytics/components/CampaignPerformanceCard'
import { ConversionFunnelCard } from '../../features/Analytics/components/ConversionFunnelCard'
import { PerformanceSummaryCard } from '../../features/Analytics/components/PerformanceSummaryCard'
import { PortfolioAnalyticsCard } from '../../features/Analytics/components/PortfolioAnalyticsCard'
import { SalesReportCard } from '../../features/Analytics/components/SalesReportCard'
import { TrafficSourceBreakdownCard } from '../../features/Analytics/components/TrafficSourceBreakdownCard'
import { AutomationExecutionCard } from '../../features/Automation & Execution/components/AutomationExecutionCard'
import { SystemMonitoringCard } from '../../features/Automation & Execution/components/SystemMonitoringCard'
import { TaskExecutionCard } from '../../features/Automation & Execution/components/TaskExecutionCard'
import { WorkflowAutomationCard } from '../../features/Automation & Execution/components/WorkflowAutomationCard'
import { LeadGenerationCard } from '../../features/Sales and Leads/components/LeadGenerationCard'
import { LeadScoringCard } from '../../features/Sales and Leads/components/LeadScoringCard'
import { PipelineTrackingCard } from '../../features/Sales and Leads/components/PipelineTrackingCard'
import { RevenueFeedbackCard } from '../../features/Sales and Leads/components/RevenueFeedbackCard'
import { SalesAndLeadsCard } from '../../features/Sales and Leads/components/SalesAndLeadsCard'
import { CaptionGenerationCard } from '../../features/Social Media Stuffs/components/CaptionGenerationCard'
import { ImageGenerationCard } from '../../features/Social Media Stuffs/components/ImageGenerationCard'
import { PerformanceTrackingCard } from '../../features/Social Media Stuffs/components/PerformanceTrackingCard'
import { SocialMediaManagerCard } from '../../features/Social Media Stuffs/components/SocialMediaManagerCard'
import { SocialMediaPublishingCard } from '../../features/Social Media Stuffs/components/SocialMediaPublishingCard'
import { SocialMediaStrategyCard } from '../../features/Social Media Stuffs/components/SocialMediaStrategyCard'
import { CompetitorTrackingCard } from '../../features/Strategy & Intelligence/components/CompetitorTrackingCard'
import { GrowthStrategyCard } from '../../features/Strategy & Intelligence/components/GrowthStrategyCard'
import { MarketInsightsCard } from '../../features/Strategy & Intelligence/components/MarketInsightsCard'
import { OpportunityDetectionCard } from '../../features/Strategy & Intelligence/components/OpportunityDetectionCard'
import { RiskDetectionCard } from '../../features/Strategy & Intelligence/components/RiskDetectionCard'
import { StrategyIntelligenceCard } from '../../features/Strategy & Intelligence/components/StrategyIntelligenceCard'
import { ConversionSignalsCard } from '../../features/Website & Traffic/components/ConversionSignalsCard'
import { PagePerformanceCard } from '../../features/Website & Traffic/components/PagePerformanceCard'
import { SEOInsightsCard } from '../../features/Website & Traffic/components/SEOInsightsCard'
import { TrafficQualityCard } from '../../features/Website & Traffic/components/TrafficQualityCard'
import { UserBehaviorCard } from '../../features/Website & Traffic/components/UserBehaviorCard'
import { WebsiteTrafficCard } from '../../features/Website & Traffic/components/WebsiteTrafficCard'
import { WebsiteTrafficStatusCard } from '../../features/Website & Traffic/components/WebsiteTrafficStatusCard'
import './ReportsPage.css'

const CATEGORY_FILTERS = ['All', 'Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
const DURATION_FILTERS = ['All', 'Today', 'Weekly', 'Monthly', 'Custom']
const DEFAULT_COMPARE_CATEGORIES = ['Analytics', 'Strategy']

const REPORT_GROUPS = [
  {
    key: 'Analytics',
    title: 'Analytics & Reporting',
    subtitle: 'Performance tracking and insights',
    cards: [
      AnalyticsReportingCard,
      CampaignPerformanceCard,
      ConversionFunnelCard,
      PerformanceSummaryCard,
      PortfolioAnalyticsCard,
      SalesReportCard,
      TrafficSourceBreakdownCard,
    ],
  },
  {
    key: 'Strategy',
    title: 'Strategy & Intelligence',
    subtitle: 'Decision making and growth planning',
    cards: [
      StrategyIntelligenceCard,
      MarketInsightsCard,
      CompetitorTrackingCard,
      GrowthStrategyCard,
      OpportunityDetectionCard,
      RiskDetectionCard,
    ],
  },
  {
    key: 'Sales',
    title: 'Sales and Leads',
    subtitle: 'Lead flow and revenue conversion',
    cards: [
      SalesAndLeadsCard,
      LeadGenerationCard,
      LeadScoringCard,
      PipelineTrackingCard,
      RevenueFeedbackCard,
    ],
  },
  {
    key: 'Social Media',
    title: 'Social Media Manager',
    subtitle: 'Content, publishing, and engagement',
    cards: [
      SocialMediaManagerCard,
      SocialMediaStrategyCard,
      PerformanceTrackingCard,
      ImageGenerationCard,
      CaptionGenerationCard,
      SocialMediaPublishingCard,
    ],
  },
  {
    key: 'Website',
    title: 'Website & Traffic',
    subtitle: 'Traffic, behavior, and conversion',
    cards: [
      WebsiteTrafficStatusCard,
      WebsiteTrafficCard,
      TrafficQualityCard,
      UserBehaviorCard,
      PagePerformanceCard,
      SEOInsightsCard,
      ConversionSignalsCard,
    ],
  },
  {
    key: 'Automation',
    title: 'Automation & Execution',
    subtitle: 'Workflow execution and system health',
    cards: [
      AutomationExecutionCard,
      WorkflowAutomationCard,
      TaskExecutionCard,
      SystemMonitoringCard,
    ],
  },
]

const REPORT_COLUMN_GROUPS = {
  left: ['Analytics', 'Strategy', 'Automation'],
  right: ['Sales', 'Social Media', 'Website'],
}

const COMPARE_COLUMNS = [
  {
    title: 'Period A',
    dateLabel: 'Jan 1 - Jan 31',
  },
  {
    title: 'Period B',
    dateLabel: 'Apr 1 - Apr 31',
  },
]

function GridIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="reports-page__button-icon">
      <rect x="3" y="3" width="5" height="5" rx="1.2" />
      <rect x="10" y="3" width="5" height="5" rx="1.2" />
      <rect x="3" y="10" width="5" height="5" rx="1.2" />
      <rect x="10" y="10" width="5" height="5" rx="1.2" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="reports-page__button-icon">
      <path d="M9 3.2v7.1" />
      <path d="m6.4 7.9 2.6 2.6 2.6-2.6" />
      <rect x="4" y="11.2" width="10" height="3.8" rx="1.5" />
    </svg>
  )
}

function FilterRail({ label, items, active, onChange, align = 'left', trailingLabel }) {
  return (
    <div className={`reports-page__filter-rail reports-page__filter-rail--${align}`}>
      <span className="reports-page__filter-label">{label}</span>
      <div className="reports-page__filter-pills" role="tablist" aria-label={label}>
        {items.map((item) => {
          const selected = item === active

          return (
            <button
              key={item}
              type="button"
              className={`reports-page__pill ${selected ? 'reports-page__pill--active' : ''}`}
              onClick={() => onChange(item)}
              aria-pressed={selected}
            >
              {item}
            </button>
          )
        })}
        {trailingLabel ? (
          <span className="reports-page__pill reports-page__pill--date">
            {trailingLabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function CompareHeaderCard({ title, selectedCount, duration }) {
  return (
    <div className="reports-page__compare-card">
      <div className="reports-page__compare-card-head">
        <strong>{title}</strong>
        <span>Total {selectedCount} Selected</span>
      </div>

      <div className="reports-page__compare-card-body">
        <span className="reports-page__compare-duration-label">Duration</span>
        <div className="reports-page__compare-pills">
          {DURATION_FILTERS.map((item) => (
            <button
              key={`${title}-${item}`}
              type="button"
              className={`reports-page__mini-pill ${item === 'Custom' ? 'reports-page__mini-pill--active' : ''}`}
            >
              {item}
            </button>
          ))}
          <button type="button" className="reports-page__mini-pill reports-page__mini-pill--active reports-page__mini-pill--ghost">
            {duration}
          </button>
        </div>
      </div>

      <button type="button" className="reports-page__export-button reports-page__export-button--wide">
        <span>Export As CSV</span>
        <DownloadIcon />
      </button>
    </div>
  )
}

function getVisibleGroups(category, compareEnabled) {
  if (compareEnabled && category === 'All') {
    return REPORT_GROUPS.filter((group) => DEFAULT_COMPARE_CATEGORIES.includes(group.key))
  }

  if (category === 'All') {
    return REPORT_GROUPS
  }

  return REPORT_GROUPS.filter((group) => group.key === category)
}

function ReportCardGrid({ group, compact = false }) {
  return (
    <div className={`reports-page__cards-grid ${compact ? 'reports-page__cards-grid--compact' : ''}`}>
      {group.cards.map((Card, index) => (
        <div key={`${group.key}-${index}`} className="reports-page__card-shell">
          <Card />
        </div>
      ))}
    </div>
  )
}

function ReportSection({ group, compact = false }) {
  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{group.title}</h2>
          <p className="reports-page__section-subtitle">{group.subtitle}</p>
        </div>
      </div>
      <ReportCardGrid group={group} compact={compact} />
    </section>
  )
}

function ReportSections({ groups, compact = false }) {
  return groups.map((group) => (
    <ReportSection key={group.key} group={group} compact={compact} />
  ))
}

function SingleReportSections({ groups }) {
  const columnGroups = {
    left: groups.filter((group) => REPORT_COLUMN_GROUPS.left.includes(group.key)),
    right: groups.filter((group) => REPORT_COLUMN_GROUPS.right.includes(group.key)),
  }

  if (groups.length === 1) {
    return <ReportSections groups={groups} />
  }

  return (
    <>
      <div className="reports-page__report-column">
        <ReportSections groups={columnGroups.left} />
      </div>
      <div className="reports-page__report-column">
        <ReportSections groups={columnGroups.right} />
      </div>
    </>
  )
}

function CompareReportColumn({ period, groups }) {
  const selectedCount = groups.length

  return (
    <div className="reports-page__compare-column">
      <CompareHeaderCard title={period.title} selectedCount={selectedCount} duration={period.dateLabel} />
      <ReportSections groups={groups} compact />
    </div>
  )
}

export default function ReportsPage({ onNavigate }) {
  const [category, setCategory] = useState('All')
  const [duration, setDuration] = useState('Custom')
  const [compareEnabled, setCompareEnabled] = useState(false)

  const durationLabel = useMemo(() => (duration === 'Custom' ? 'Jan 1 - Jan 31' : duration), [duration])
  const visibleGroups = useMemo(
    () => getVisibleGroups(category, compareEnabled),
    [category, compareEnabled],
  )
  const selectedLabel = category === 'All' ? 'All category' : category

  return (
    <div className="reports-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <div className="reports-page__viewport">
        <main className="reports-page__content">
          <header className="reports-page__header">
            <div>
              <h1 className="reports-page__title">Reports</h1>
              <p className="reports-page__subtitle">
                Review business performance by department, compare time periods side by side, and export structured report data.
              </p>
            </div>
          </header>

          <section className="reports-page__toolbar">
            <div className="reports-page__toolbar-row">
              <FilterRail label="Category" items={CATEGORY_FILTERS} active={category} onChange={setCategory} />
              <FilterRail
                label="Duration"
                items={DURATION_FILTERS}
                active={duration}
                onChange={setDuration}
                align="right"
                trailingLabel={duration === 'Custom' ? durationLabel : null}
              />
            </div>

            <div className="reports-page__toolbar-meta">
              <p className="reports-page__toolbar-note">
                Report cards are generated from the same live feature components used across the Nora map.
              </p>
              <span className="reports-page__toolbar-hint">{selectedLabel} Selected</span>
            </div>

            <div className="reports-page__actions">
              <button
                type="button"
                className={`reports-page__action-button ${compareEnabled ? 'reports-page__action-button--dark' : 'reports-page__action-button--blue'}`}
                onClick={() => setCompareEnabled((current) => !current)}
              >
                <span>{compareEnabled ? 'Disable Compare' : 'Enable Compare'}</span>
                <GridIcon />
              </button>

              <button type="button" className="reports-page__export-button">
                <span>Export As CSV</span>
                <DownloadIcon />
              </button>
            </div>
          </section>

          {compareEnabled ? (
            <section className="reports-page__compare-layout">
              <div className="reports-page__compare-top-filter">
                <FilterRail label="Category" items={CATEGORY_FILTERS} active={category} onChange={setCategory} />
              </div>

              <div className="reports-page__compare-columns">
                {COMPARE_COLUMNS.map((column) => (
                  <CompareReportColumn key={column.title} period={column} groups={visibleGroups} />
                ))}
              </div>
            </section>
          ) : (
            <section className="reports-page__single-layout">
              <SingleReportSections groups={visibleGroups} />
            </section>
          )}
        </main>
      </div>

      <BottomAIStatusTools />
      <div className="reports-page__grain" aria-hidden="true" />
    </div>
  )
}
