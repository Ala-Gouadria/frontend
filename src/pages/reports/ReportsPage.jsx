import { useMemo, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import {
  ActivityRings,
  AreaRevenueChart,
  AutomationArcGauge,
  DottedDataBars,
  MetricGrid,
  MetricItem,
  MiniBarChart,
  MiniLineChart,
  ProgressBars,
  QualityBlocks,
  SegmentedStripedBar,
  SemiCircleGauge,
  StageFlow,
  StackedBars,
  StripedBars,
  WebsiteArcGauge,
} from '../../components/visuals-parts'
import {
  analyticsReportingCardData,
  conversionFunnelCardData,
  performanceSummaryCardData,
  portfolioAnalyticsCardData,
  salesReportCardData,
} from '../../features/Analytics/data/analyticsMockData'
import {
  leadGenerationCardData,
  leadScoringCardData,
  pipelineTrackingCardData,
  revenueFeedbackCardData,
  salesAndLeadsCardData,
} from '../../features/Sales and Leads/data/salesAndLeadsMockData'
import {
  performanceTrackingCardData,
  socialMediaManagerCardData,
  socialMediaStrategyCardData,
} from '../../features/Social Media Stuffs/data/socialMediaStuffsMockData'
import {
  growthStrategyCardData,
  riskDetectionCardData,
  strategyIntelligenceCardData,
} from '../../features/Strategy & Intelligence/data/strategyIntelligenceMockData'
import {
  pagePerformanceCardData,
  trafficQualityCardData,
  userBehaviorCardData,
  websiteTrafficCardData,
  websiteTrafficStatusCardData,
} from '../../features/Website & Traffic/data/websiteTrafficMockData'
import {
  automationExecutionCardData,
  systemMonitoringCardData,
  taskExecutionCardData,
  workflowAutomationCardData,
} from '../../features/Automation & Execution/data/automationExecutionMockData'
import './ReportsPage.css'

const CATEGORY_FILTERS = ['All', 'Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
const DURATION_FILTERS = ['All', 'Today', 'Weekly', 'Monthly', 'Custom']
const COMPARE_COLUMNS = [
  { title: 'Period A', dateLabel: 'Jan 1 - Jan 31' },
  { title: 'Period B', dateLabel: 'Apr 1 - Apr 30' },
]

function parsePercent(value, fallback = 50) {
  const parsed = Number.parseFloat(String(value ?? '').replace('%', ''))
  return Number.isFinite(parsed) ? parsed : fallback
}

function barsToColumns(bars = []) {
  return bars.slice(0, 8).map((bar, index) => ({
    label: `P${index + 1}`,
    value: bar,
    count: Math.max(1, Math.round(bar / 14)),
  }))
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

function FilterRail({ label, items, active, onChange, align = 'left', trailingLabel }) {
  return (
    <div className={`reports-page__filter-rail reports-page__filter-rail--${align}`}>
      <span className="reports-page__filter-label">{label}</span>
      <div className="reports-page__filter-pills" role="tablist" aria-label={label}>
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={`reports-page__pill ${item === active ? 'reports-page__pill--active' : ''}`}
            onClick={() => onChange(item)}
            aria-pressed={item === active}
          >
            {item}
          </button>
        ))}
        {trailingLabel ? <span className="reports-page__pill reports-page__pill--date">{trailingLabel}</span> : null}
      </div>
    </div>
  )
}

function Legend({ items }) {
  return (
    <div className="reports-page__legend">
      {items.map((item) => (
        <span key={item.label} className="reports-page__legend-item">
          <i className={`reports-page__legend-dot reports-page__legend-dot--${item.tone ?? 'green'}`} />
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </span>
      ))}
    </div>
  )
}

function Section({ groupKey, title, subtitle, children }) {
  return (
    <section className="reports-page__section" data-group={groupKey}>
      <header className="reports-page__section-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  )
}

function FlowRows({ rows }) {
  return (
    <div className="reports-page__flow-rows">
      {rows.map((row) => (
        <div key={row.label} className="reports-page__flow-row">
          <div>
            <span>{row.label}</span>
            {row.note ? <small>{row.note}</small> : null}
          </div>
          <strong>{row.value}</strong>
          <ProgressBars value={parsePercent(row.width ?? row.value)} cap={false} />
        </div>
      ))}
    </div>
  )
}

function WorkflowRows({ rows }) {
  return (
    <div className="reports-page__workflow-rows">
      {rows.map((row) => (
        <div key={row.label} className="reports-page__workflow-row">
          <div className="reports-page__workflow-head">
            <span>{row.label}</span>
            <strong>{row.state ?? row.progress}</strong>
          </div>
          <SegmentedStripedBar
            value={row.progress ? parsePercent(row.progress) : (row.blocks?.filter((item) => item === 1).length / (row.blocks?.length || 5)) * 100}
            segments={row.totalBlocks ?? row.blocks?.length ?? 5}
            activeSegments={row.activeBlocks}
            tone={row.tone === 'queued' ? 'blue' : 'blue'}
            label={row.result ?? row.progress}
          />
          {row.result ? <small>{row.result}</small> : null}
        </div>
      ))}
    </div>
  )
}

function RiskRows({ rows }) {
  return (
    <div className="reports-page__risk-rows">
      {rows.map((risk) => (
        <div key={`${risk.title}-${risk.metric}`} className="reports-page__risk-row">
          <div className="reports-page__risk-head">
            <div>
              <strong>{risk.title}</strong>
              <span>{risk.state}</span>
            </div>
            <b>{risk.metric}</b>
          </div>
          <MiniLineChart points={risk.points} fillPoints={`${risk.points} 270,58 0,58`} tone="red" />
        </div>
      ))}
    </div>
  )
}

function AnalyticsReport() {
  const topMetrics = [
    ...analyticsReportingCardData.metrics.slice(0, 2).map((item) => ({ ...item, visual: 'bars' })),
    ...performanceSummaryCardData.results.map((item) => ({ ...item, visual: 'dots' })),
  ]
  const lineMetrics = [
    ...salesReportCardData.results,
    analyticsReportingCardData.metrics[2],
    portfolioAnalyticsCardData.summaryItems[2],
    { label: conversionFunnelCardData.visitsLabel, value: conversionFunnelCardData.visitsValue, ...conversionFunnelCardData.visitsChart },
  ]

  return (
    <Section groupKey="Analytics" title="Analytics & Reporting" subtitle="Performance tracking and insights">
      <div className="reports-page__analytics-top">
        <div>
          <h3>Revenue</h3>
          <AreaRevenueChart {...analyticsReportingCardData.revenueChart} />
        </div>
        <div>
          <h3>{portfolioAnalyticsCardData.gaugeTitle}</h3>
          <SemiCircleGauge {...portfolioAnalyticsCardData.gauge} />
        </div>
      </div>

      <MetricGrid columns={5}>
        {topMetrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            {metric.visual === 'bars'
              ? <MiniBarChart bars={metric.bars} />
              : <DottedDataBars columns={metric.columns} />}
          </MetricItem>
        ))}
      </MetricGrid>

      <MetricGrid columns={5}>
        {lineMetrics.map((metric, index) => (
          <MetricItem key={`${metric.label}-${index}`} label={metric.label} value={metric.value}>
            <MiniLineChart points={metric.points} fillPoints={metric.fillPoints} />
          </MetricItem>
        ))}
      </MetricGrid>
    </Section>
  )
}

function StrategyReport() {
  const stackSegments = growthStrategyCardData.legend.map((item, index) => ({
    label: `${item.label} ${item.value}`,
    value: index === 0 ? 25 : index === 1 ? 35 : 40,
    tone: item.tone,
  }))

  return (
    <Section groupKey="Strategy" title="Strategy & Intelligence" subtitle="Decision making and growth planning">
      <div className="reports-page__sub-block">
        <span>Active Strategy</span>
        <ProgressBars
          value={parsePercent(strategyIntelligenceCardData.activePercent)}
          label={strategyIntelligenceCardData.activeValue}
          endLabel={strategyIntelligenceCardData.activePercent}
        />
      </div>
      <div className="reports-page__sub-block">
        <span>Expected Impact</span>
        <StripedBars
          value={parsePercent(strategyIntelligenceCardData.confidenceWidth)}
          label={strategyIntelligenceCardData.confidenceLabel}
          endLabel={strategyIntelligenceCardData.confidenceValue}
          tone="orange"
        />
        <StripedBars
          value={parsePercent(strategyIntelligenceCardData.opportunityWidth)}
          label={strategyIntelligenceCardData.opportunityLabel}
          endLabel={strategyIntelligenceCardData.opportunityValue}
        />
      </div>
      <div className="reports-page__sub-block">
        <span>Growth Strategy</span>
        <Legend items={growthStrategyCardData.legend} />
        <StackedBars segments={stackSegments} />
      </div>
      <MetricGrid columns={3}>
        {strategyIntelligenceCardData.reasonColumns.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            <MiniBarChart bars={metric.bars} tone="green" />
          </MetricItem>
        ))}
      </MetricGrid>
      <RiskRows rows={riskDetectionCardData.risks} />
    </Section>
  )
}

function SalesReport() {
  return (
    <Section groupKey="Sales" title="Sales and Leads" subtitle="Lead flow and revenue conversion">
      <span className="reports-page__block-label">Issue Area</span>
      <StageFlow stages={salesAndLeadsCardData.stages} activeIndex={2} />
      <Legend items={salesAndLeadsCardData.legend} />
      <QualityBlocks blocks={salesAndLeadsCardData.blocks} />
      <MetricGrid columns={3}>
        {leadGenerationCardData.sources.map((source) => (
          <MetricItem key={source.label} label={source.label} value={source.value}>
            <MiniBarChart bars={source.bars} tone="green" />
          </MetricItem>
        ))}
      </MetricGrid>
      <MetricGrid columns={2}>
        {[leadGenerationCardData, leadScoringCardData, pipelineTrackingCardData, revenueFeedbackCardData].map((item) => (
          <MetricItem key={item.title} label={item.flowLabel ?? item.scoredLabel ?? item.pipelineLabel ?? item.responseLabel} value={item.flowValue ?? item.scoredDelta ?? item.pipelineDelta ?? item.responseValue}>
            <MiniLineChart points={item.topChart.points} fillPoints={item.topChart.fillPoints} />
          </MetricItem>
        ))}
      </MetricGrid>
      <FlowRows rows={revenueFeedbackCardData.sources} />
    </Section>
  )
}

function SocialReport() {
  return (
    <Section groupKey="Social Media" title="Social Media Manager" subtitle="Content, publishing, and engagement">
      <div className="reports-page__rings-row">
        <div>
          <span>Active campaigns</span>
          <strong>5 running</strong>
        </div>
        <ActivityRings />
      </div>
      <MetricGrid columns={3}>
        {socialMediaManagerCardData.engagementCards.map((card) => (
          <MetricItem key={card.icon} label={card.icon} value={card.value}>
            <MiniLineChart points={card.points} fillPoints={`${card.points} 112,58 4,58`} tone={card.tone === 'pink' ? 'pink' : 'blue'} />
          </MetricItem>
        ))}
      </MetricGrid>
      <MetricGrid columns={3}>
        {socialMediaStrategyCardData.reasonColumns.map((metric) => (
          <MetricItem key={metric.title} label={metric.title} value={metric.delta}>
            <MiniBarChart bars={metric.bars} tone={metric.tone === 'red' ? 'red' : 'green'} />
          </MetricItem>
        ))}
      </MetricGrid>
      <FlowRows rows={performanceTrackingCardData.performerRows} />
    </Section>
  )
}

function WebsiteReport() {
  return (
    <Section groupKey="Website" title="Website & Traffic" subtitle="Traffic, behavior, and conversion">
      <span className="reports-page__block-label">Issue Area</span>
      <StageFlow stages={websiteTrafficStatusCardData.stages} activeIndex={2} />
      <Legend items={websiteTrafficStatusCardData.legend} />
      <QualityBlocks blocks={websiteTrafficStatusCardData.blocks} />
      <MetricGrid columns={5}>
        {userBehaviorCardData.metrics.slice(0, 5).map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            <DottedDataBars columns={barsToColumns(metric.bars)} />
          </MetricItem>
        ))}
      </MetricGrid>
      <div className="reports-page__gauge-pair">
        <WebsiteArcGauge
          value={trafficQualityCardData.gauge.current}
          label={trafficQualityCardData.gauge.label}
          progress={trafficQualityCardData.gauge.progress}
          compact
        />
        {pagePerformanceCardData.gauges.map((gauge) => (
          <WebsiteArcGauge key={gauge.label} value={gauge.value} label={gauge.label} progress={gauge.progress} compact />
        ))}
      </div>
      <FlowRows rows={websiteTrafficCardData.sourceMix} />
      <Legend items={websiteTrafficCardData.deviceLegend} />
      <QualityBlocks blocks={websiteTrafficCardData.deviceBlocks} />
    </Section>
  )
}

function AutomationReport() {
  return (
    <Section groupKey="Automation" title="Automation & Execution" subtitle="Workflow execution and system health">
      <div className="reports-page__automation-top">
        <AutomationArcGauge {...automationExecutionCardData.gauge} />
        <div>
          <span>System State</span>
          <strong>{automationExecutionCardData.stateValue}</strong>
          <ActivityRings rings={[
            { id: 'workflow-1', progress: 0.78 },
            { id: 'workflow-2', progress: 0.7 },
            { id: 'workflow-3', progress: 0.82 },
            { id: 'workflow-4', progress: 0.68 },
          ]} />
        </div>
      </div>
      <div className="reports-page__sub-block">
        <span>Execution Lane</span>
        <Legend items={automationExecutionCardData.lanes.map((lane) => ({ label: lane.label, value: lane.value, tone: lane.tone }))} />
        <StackedBars segments={[
          { label: 'Audience Sync +25%', value: 25, tone: 'blue' },
          { label: 'High Intent 35%', value: 35, tone: 'green' },
          { label: 'Campaign Launch +10%', value: 40, tone: 'orange' },
        ]} />
      </div>
      <WorkflowRows rows={workflowAutomationCardData.workflows} />
      <WorkflowRows rows={taskExecutionCardData.tasks} />
      <FlowRows rows={systemMonitoringCardData.services.map((service) => ({
        label: service.label,
        note: service.note,
        value: service.uptime,
        width: service.uptime,
      }))} />
      <MetricGrid columns={3}>
        {systemMonitoringCardData.summaryMetrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            <DottedDataBars columns={metric.columns} />
          </MetricItem>
        ))}
      </MetricGrid>
    </Section>
  )
}

const REPORTS = {
  Analytics: AnalyticsReport,
  Strategy: StrategyReport,
  Sales: SalesReport,
  'Social Media': SocialReport,
  Website: WebsiteReport,
  Automation: AutomationReport,
}

const SINGLE_LAYOUT = ['Analytics', 'Sales', 'Strategy', 'Social Media', 'Automation', 'Website']
const COMPARE_LAYOUT = ['Analytics', 'Strategy']

function getVisibleKeys(category, compareEnabled) {
  if (category !== 'All') {
    return [category]
  }

  return compareEnabled ? COMPARE_LAYOUT : SINGLE_LAYOUT
}

function CompareHeaderCard({ title, selectedCount, dateLabel }) {
  return (
    <div className="reports-page__compare-card">
      <div className="reports-page__compare-card-head">
        <strong>{title}</strong>
        <span>Total {selectedCount} Selected</span>
      </div>
      <span className="reports-page__compare-label">Duration</span>
      <div className="reports-page__compare-pills">
        {DURATION_FILTERS.map((item) => (
          <button key={`${title}-${item}`} type="button" className={`reports-page__mini-pill ${item === 'Custom' ? 'reports-page__mini-pill--active' : ''}`}>
            {item}
          </button>
        ))}
        <span className="reports-page__mini-pill reports-page__mini-pill--active">{dateLabel}</span>
      </div>
      <button type="button" className="reports-page__export-button reports-page__export-button--wide">
        <span>Export As CSV</span>
        <DownloadIcon />
      </button>
    </div>
  )
}

function RenderReports({ keys }) {
  return keys.map((key) => {
    const Report = REPORTS[key]
    return Report ? <Report key={key} /> : null
  })
}

export default function ReportsPage({ onNavigate }) {
  const [category, setCategory] = useState('All')
  const [duration, setDuration] = useState('Custom')
  const [compareEnabled, setCompareEnabled] = useState(false)
  const durationLabel = useMemo(() => (duration === 'Custom' ? 'Jan 1 - Jan 31' : duration), [duration])
  const visibleKeys = useMemo(() => getVisibleKeys(category, compareEnabled), [category, compareEnabled])
  const selectedLabel = category === 'All' ? 'All category' : category

  return (
    <div className="reports-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="reports-page__viewport">
        <div className="reports-page__content">
          <header className="reports-page__header">
            <h1>Reports</h1>
            <p>Review business performance by department, compare time periods side by side, and export structured report data.</p>
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
              <p>Review business performance by department, compare time periods side by side, and export structured report data.</p>
              <span>{selectedLabel} Selected</span>
            </div>
            <div className="reports-page__actions">
              <button
                type="button"
                className="reports-page__action-button reports-page__action-button--dark"
                onClick={() => onNavigate?.('events')}
              >
                <span>Events</span>
                <GridIcon />
              </button>
              <button
                type="button"
                className="reports-page__action-button reports-page__action-button--dark"
                onClick={() => onNavigate?.('memory')}
              >
                <span>Memory</span>
                <GridIcon />
              </button>
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
              <div className="reports-page__compare-category">
                <FilterRail label="Category" items={CATEGORY_FILTERS} active={category} onChange={setCategory} />
              </div>
              <div className="reports-page__compare-columns">
                {COMPARE_COLUMNS.map((period) => (
                  <div key={period.title} className="reports-page__compare-column">
                    <CompareHeaderCard title={period.title} selectedCount={visibleKeys.length} dateLabel={period.dateLabel} />
                    <RenderReports keys={visibleKeys} />
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="reports-page__single-layout">
              <RenderReports keys={visibleKeys} />
            </section>
          )}
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
