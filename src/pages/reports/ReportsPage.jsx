import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
} from '../../components/visuals-parts'
import { PlatformEngagementCard } from '../../components/visuals-parts/PlatformEngagementCard'
import fbIconUrl from '../../assets/icons/Social-Media-Card-Icon/fb.svg'
import inIconUrl from '../../assets/icons/Social-Media-Card-Icon/in.svg'
import igIconUrl from '../../assets/icons/Social-Media-Card-Icon/instagram.svg'
import tiktokIconUrl from '../../assets/icons/Patch-Icon/Tiktok-icon.png'
import downloadIconUrl from '../../assets/icons/Reports-Icon/download-icon.svg'
import tableIconUrl from '../../assets/icons/Reports-Icon/table-icon.svg'
import {
  CATEGORY_FILTERS,
  DURATION_FILTERS,
  buildCompareCsv,
  buildReportCsv,
  buildReportModel,
  csvFileName,
  downloadCsv,
  getPeriodSpec,
} from './reportsData.js'
import './ReportsPage.css'

const DEFAULT_PERIOD_A = { duration: 'Custom', from: '2026-01-01', to: '2026-01-31' }
const DEFAULT_PERIOD_B = { duration: 'Custom', from: '2026-04-01', to: '2026-04-30' }

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

// Bars for MiniBarChart — use the raw bar series when present, otherwise
// interpolate the sparse dot columns up to a denser, consistent run.
function metricToBars(metric, target = 12) {
  if (metric.bars) {
    return metric.bars
  }

  const counts = (metric.columns ?? []).map((col) =>
    typeof col === 'number' ? col : col.count ?? 0,
  )

  if (counts.length === 0 || counts.length >= target) {
    return counts
  }

  return Array.from({ length: target }, (_, index) => {
    const position = (index / (target - 1)) * (counts.length - 1)
    const leftIndex = Math.floor(position)
    const rightIndex = Math.min(counts.length - 1, leftIndex + 1)
    const ratio = position - leftIndex
    return counts[leftIndex] + (counts[rightIndex] - counts[leftIndex]) * ratio
  })
}

// Normalize legend-style shares (25 / 35 / 10) so the stacked bar fills 100%.
function legendToStack(items) {
  const weights = items.map((item) => Math.max(5, parsePercent(item.value, 20)))
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  return items.map((item, index) => ({
    label: `${item.label} ${item.value}`,
    value: Math.round((weights[index] / total) * 100),
    tone: item.tone,
  }))
}

function DownloadIcon() {
  return <img src={downloadIconUrl} alt="" aria-hidden="true" className="reports-page__button-icon" />
}

function GridIcon() {
  return <img src={tableIconUrl} alt="" aria-hidden="true" className="reports-page__button-icon" />
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
            className={['reports-page__pill', item === active ? 'reports-page__pill--active' : '']
              .filter(Boolean)
              .join(' ')}
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

function DateRangeInputs({ period, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="reports-page__date-range">
      <label>
        <span>{t('reports.from')}</span>
        <input
          type="date"
          value={period.from}
          max={period.to}
          onChange={(event) => onChange({ ...period, from: event.target.value })}
        />
      </label>
      <label>
        <span>{t('reports.to')}</span>
        <input
          type="date"
          value={period.to}
          min={period.from}
          onChange={(event) => onChange({ ...period, to: event.target.value })}
        />
      </label>
    </div>
  )
}

function Legend({ items }) {
  return (
    <div className="reports-page__legend">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="reports-page__legend-item">
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

function SubBlock({ label, children }) {
  return (
    <div className="reports-page__sub-block">
      <span>{label}</span>
      {children}
    </div>
  )
}

function FlowRows({ rows }) {
  return (
    <div className="reports-page__flow-rows">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`} className="reports-page__flow-row">
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
            value={
              row.progress
                ? parsePercent(row.progress)
                : ((row.blocks?.filter((item) => item === 1).length ?? 0) / (row.blocks?.length || 5)) * 100
            }
            segments={row.totalBlocks ?? row.blocks?.length ?? 5}
            activeSegments={row.activeBlocks}
            tone="blue"
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
      {rows.map((risk, index) => (
        <div key={`${risk.title}-${index}`} className="reports-page__risk-row">
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

// --- category sections ------------------------------------------------------

function AnalyticsReport({ data }) {
  const { t } = useTranslation()
  const {
    analyticsReporting,
    performanceSummary,
    campaignPerformance,
    portfolioAnalytics,
    salesReport,
    conversionFunnel,
    trafficSourceBreakdown,
  } = data

  const topMetrics = [...analyticsReporting.metrics.slice(0, 2), ...performanceSummary.results]
  const lineMetrics = [
    ...salesReport.results,
    analyticsReporting.metrics[2],
    portfolioAnalytics.summaryItems[2],
    { label: conversionFunnel.visitsLabel, value: conversionFunnel.visitsValue, ...conversionFunnel.visitsChart },
  ]

  return (
    <Section groupKey="Analytics" title={t('reports.sectionAnalyticsTitle')} subtitle={t('reports.sectionAnalyticsSubtitle')}>
      <div className="reports-page__analytics-top">
        <div>
          <h3>{t('reports.revenue')}</h3>
          <AreaRevenueChart {...analyticsReporting.revenueChart} tone="blue" />
        </div>
        <div>
          <h3>{portfolioAnalytics.gaugeTitle}</h3>
          <SemiCircleGauge {...portfolioAnalytics.gauge} tone="blue" />
        </div>
      </div>

      <MetricGrid columns={5} className="reports-page__analytics-metrics">
        {topMetrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            <MiniBarChart bars={metricToBars(metric)} tone="green" className="reports-page__analytics-dots" />
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

      <SubBlock label={t('reports.campaignPerformance')}>
        <div className="reports-page__rings-row">
          <div>
            <span>{campaignPerformance.activeLabel}</span>
            <strong>{campaignPerformance.activeValue}</strong>
          </div>
          <ActivityRings rings={campaignPerformance.campaignRings} />
        </div>
        <MetricGrid columns={2}>
          {campaignPerformance.campaigns.map((campaign) => (
            <MetricItem key={campaign.label} label={campaign.label} value={campaign.value}>
              <MiniLineChart points={campaign.points} fillPoints={campaign.fillPoints} />
            </MetricItem>
          ))}
        </MetricGrid>
      </SubBlock>

      <SubBlock label={t('reports.conversionFunnel')}>
        <FlowRows
          rows={conversionFunnel.stages.map((stage) => ({
            label: stage.label,
            value: stage.percent,
            width: stage.width,
          }))}
        />
      </SubBlock>

      <SubBlock label={t('reports.trafficSources')}>
        <FlowRows
          rows={trafficSourceBreakdown.sources.map((source) => ({
            label: source.label,
            note: source.delta,
            value: source.percent,
            width: source.width,
          }))}
        />
      </SubBlock>
    </Section>
  )
}

function StrategyReport({ data }) {
  const { t } = useTranslation()
  const {
    strategyIntelligence,
    growthStrategy,
    marketInsights,
    opportunityDetection,
    competitorTracking,
    riskDetection,
  } = data

  return (
    <Section groupKey="Strategy" title={t('reports.sectionStrategyTitle')} subtitle={t('reports.sectionStrategySubtitle')}>
      <SubBlock label={t('reports.activeStrategy')}>
        <ProgressBars
          value={parsePercent(strategyIntelligence.activePercent)}
          label={strategyIntelligence.activeValue}
          endLabel={strategyIntelligence.activePercent}
        />
      </SubBlock>

      <SubBlock label={t('reports.expectedImpact')}>
        <StripedBars
          value={parsePercent(strategyIntelligence.confidenceWidth)}
          label={strategyIntelligence.confidenceLabel}
          endLabel={strategyIntelligence.confidenceValue}
          tone="orange"
        />
        <StripedBars
          value={parsePercent(strategyIntelligence.opportunityWidth)}
          label={strategyIntelligence.opportunityLabel}
          endLabel={strategyIntelligence.opportunityValue}
        />
      </SubBlock>

      <SubBlock label={t('reports.growthStrategy')}>
        <Legend items={growthStrategy.legend} />
        <StackedBars segments={legendToStack(growthStrategy.legend)} />
      </SubBlock>

      <SubBlock label={t('reports.strategyImpact')}>
        <MetricGrid columns={3}>
          {strategyIntelligence.reasonColumns.map((metric) => (
            <MetricItem key={metric.label} label={metric.label} value={metric.value}>
              <MiniBarChart bars={metric.bars} tone="green" />
            </MetricItem>
          ))}
        </MetricGrid>
      </SubBlock>

      <SubBlock label={t('reports.risingTrends')}>
        <MetricGrid columns={3}>
          {marketInsights.items.map((item) => (
            <MetricItem key={item.label} label={item.label} value={item.metric}>
              <MiniLineChart points={item.points} fillPoints={item.fillPoints} />
            </MetricItem>
          ))}
        </MetricGrid>
      </SubBlock>

      <SubBlock label={t('reports.topOpportunities')}>
        <MetricGrid columns={3}>
          {opportunityDetection.opportunities.map((item) => (
            <MetricItem key={item.label} label={item.label} value={item.metric}>
              <MiniLineChart points={item.points} fillPoints={item.fillPoints} />
            </MetricItem>
          ))}
        </MetricGrid>
      </SubBlock>

      <SubBlock label={t('reports.competitorTracking')}>
        <FlowRows
          rows={competitorTracking.competitors.map((competitor) => ({
            label: competitor.name,
            note: `${competitor.platform} — ${competitor.note}`,
            value: competitor.delta,
            width: `${Math.min(90, 30 + parsePercent(competitor.delta, 10) * 4)}%`,
          }))}
        />
      </SubBlock>

      <SubBlock label={t('reports.activeRisks')}>
        <RiskRows rows={riskDetection.risks} />
      </SubBlock>
    </Section>
  )
}

function SalesReport({ data }) {
  const { t } = useTranslation()
  const { salesAndLeads, leadGeneration, leadScoring, pipelineTracking, revenueFeedback } = data

  return (
    <Section groupKey="Sales" title={t('reports.sectionSalesTitle')} subtitle={t('reports.sectionSalesSubtitle')}>
      <span className="reports-page__block-label">{t('reports.issueArea')}</span>
      <StageFlow stages={salesAndLeads.stages} activeIndex={2} />
      <Legend items={salesAndLeads.legend} />
      <QualityBlocks blocks={salesAndLeads.blocks} />

      <MetricGrid columns={3}>
        {leadGeneration.sources.map((source) => (
          <MetricItem key={source.label} label={source.label} value={source.value}>
            <MiniBarChart bars={source.bars} tone="green" />
          </MetricItem>
        ))}
      </MetricGrid>

      <MetricGrid columns={2}>
        {[
          { label: leadGeneration.flowLabel, value: leadGeneration.flowValue, chart: leadGeneration.topChart },
          { label: leadScoring.scoredLabel, value: leadScoring.scoredDelta, note: leadScoring.scoredValue, chart: leadScoring.topChart },
          { label: pipelineTracking.pipelineLabel, value: pipelineTracking.pipelineDelta, note: pipelineTracking.pipelineValue, chart: pipelineTracking.topChart },
          { label: revenueFeedback.responseLabel, value: revenueFeedback.responseValue, chart: revenueFeedback.topChart },
        ].map((item) => (
          <MetricItem key={item.label} label={item.label} value={item.value}>
            <MiniLineChart points={item.chart.points} fillPoints={item.chart.fillPoints} />
          </MetricItem>
        ))}
      </MetricGrid>

      <SubBlock label={t('reports.pipelineStages')}>
        <Legend items={pipelineTracking.stages} />
        <ProgressBars
          value={parsePercent(pipelineTracking.winRateValue)}
          label={pipelineTracking.winRateLabel}
          endLabel={pipelineTracking.winRateValue}
        />
      </SubBlock>

      <SubBlock label={t('reports.topLeads')}>
        <FlowRows
          rows={leadScoring.leads.map((lead) => ({
            label: lead.name,
            note: `${lead.note} — ${lead.intent}`,
            value: lead.score,
            width: lead.score,
          }))}
        />
      </SubBlock>

      <SubBlock label={t('reports.revenueBySource')}>
        <FlowRows
          rows={revenueFeedback.sources.map((source) => ({
            label: source.label,
            value: source.value,
            width: source.value,
          }))}
        />
      </SubBlock>
    </Section>
  )
}

const PLATFORM_ICONS = {
  facebook: { src: fbIconUrl, alt: 'Facebook' },
  linkedin: { src: inIconUrl, alt: 'LinkedIn' },
  instagram: { src: igIconUrl, alt: 'Instagram' },
  tiktok: { src: tiktokIconUrl, alt: 'TikTok' },
}

const PLATFORM_NAMES = { f: 'Facebook', in: 'LinkedIn', ig: 'Instagram' }

function SocialReport({ data }) {
  const { t } = useTranslation()
  const { manager, strategy, performanceTracking, publishing } = data
  const executionStats = strategy.stats.map((stat) => {
    const [value, ...rest] = stat.split(' ')
    return { label: rest.join(' '), value, tone: 'blue' }
  })

  return (
    <Section groupKey="Social Media" title={t('reports.sectionSocialTitle')} subtitle={t('reports.sectionSocialSubtitle')}>
      <div className="reports-page__rings-row">
        <div>
          <span>{manager.activityLabel}</span>
          <strong>{manager.currentActivity.name}</strong>
        </div>
        <ActivityRings />
      </div>
      <ProgressBars
        value={parsePercent(manager.currentActivity.progress)}
        label={t('reports.activeCampaigns')}
        endLabel={manager.currentActivity.progress}
      />

      <SubBlock label={manager.breakdownLabel}>
        <MetricGrid columns={4}>
          {manager.engagementCards.map((card) => {
            const icon = PLATFORM_ICONS[card.iconKey] ?? {}
            return (
              <PlatformEngagementCard
                key={card.id}
                iconSrc={icon.src}
                iconAlt={icon.alt}
                delta={card.value}
                points={card.points}
                tone={card.tone}
              />
            )
          })}
        </MetricGrid>
      </SubBlock>

      <MetricGrid columns={2}>
        <MetricItem label={manager.metrics.primary.label} value={manager.metrics.primary.value}>
          <MiniBarChart bars={manager.metrics.primary.bars} tone="green" />
        </MetricItem>
        <MetricItem label={manager.metrics.secondary.label} value={manager.metrics.secondary.value}>
          <MiniLineChart points={manager.metrics.secondary.points} fillPoints={manager.metrics.secondary.fillPoints} />
        </MetricItem>
      </MetricGrid>

      <SubBlock label={t('reports.contentTypeBreakdown')}>
        <MetricGrid columns={3}>
          {strategy.reasonColumns.map((metric) => (
            <MetricItem key={metric.title} label={metric.title} value={metric.delta}>
              <MiniBarChart bars={metric.bars} tone={metric.tone === 'red' ? 'red' : 'green'} />
            </MetricItem>
          ))}
        </MetricGrid>
      </SubBlock>

      <SubBlock label={t('reports.topPerformers')}>
        <FlowRows rows={performanceTracking.performerRows} />
      </SubBlock>

      <SubBlock label={t('reports.platformPerformance')}>
        <Legend
          items={performanceTracking.platforms.map((platform) => ({
            label: PLATFORM_NAMES[platform.label] ?? platform.label,
            value: platform.value,
            tone: platform.tone === 'pink' ? 'purple' : 'blue',
          }))}
        />
        <Legend items={executionStats} />
      </SubBlock>

      <SubBlock label={t('reports.contentProduction')}>
        <div className="reports-page__workflow-rows">
          <div className="reports-page__workflow-row">
            <div className="reports-page__workflow-head">
              <span>{publishing.currentBatch.name}</span>
              <strong>{`${publishing.currentBatch.completed}/${publishing.currentBatch.total}`}</strong>
            </div>
            <SegmentedStripedBar
              value={(publishing.currentBatch.completed / publishing.currentBatch.total) * 100}
              segments={publishing.currentBatch.total}
              activeSegments={publishing.currentBatch.completed}
              tone="blue"
            />
          </div>
        </div>
        <FlowRows
          rows={publishing.upcomingBatch.map((batch) => ({
            label: batch.label,
            value: batch.value,
            width: `${Math.min(92, parsePercent(batch.value, 10) * 6)}%`,
          }))}
        />
      </SubBlock>
    </Section>
  )
}

function WebsiteReport({ data }) {
  const { t } = useTranslation()
  const { status, userBehavior, trafficQuality, pagePerformance, traffic, conversionSignals, seoInsights } = data

  return (
    <Section groupKey="Website" title={t('reports.sectionWebsiteTitle')} subtitle={t('reports.sectionWebsiteSubtitle')}>
      <span className="reports-page__block-label">{t('reports.issueArea')}</span>
      <StageFlow stages={status.stages} activeIndex={2} />
      <Legend items={status.legend} />
      <QualityBlocks blocks={status.blocks} />

      <SubBlock label={t('reports.userBehavior')}>
        <MetricGrid columns={3}>
          {userBehavior.metrics.map((metric) => (
            <MetricItem key={metric.label} label={metric.label} value={metric.value}>
              <DottedDataBars columns={barsToColumns(metric.bars)} />
            </MetricItem>
          ))}
        </MetricGrid>
      </SubBlock>

      <div className="reports-page__gauge-pair">
        {[trafficQuality.gauge, ...pagePerformance.gauges].map((gauge) => (
          <div key={gauge.label} className="reports-page__gauge-item">
            <SemiCircleGauge label={String(gauge.value ?? gauge.current)} progress={gauge.progress} tone="blue" />
            <span className="reports-page__gauge-caption">{gauge.label}</span>
          </div>
        ))}
      </div>

      <SubBlock label={t('reports.conversionHealth')}>
        <MetricGrid columns={3}>
          {conversionSignals.metrics.map((metric) => (
            <MetricItem key={metric.label} label={metric.label} value={`${metric.value} (${metric.delta})`}>
              <MiniBarChart bars={metric.bars} tone="green" />
            </MetricItem>
          ))}
        </MetricGrid>
        <FlowRows rows={conversionSignals.ladder} />
      </SubBlock>

      <SubBlock label={t('reports.seoKeywords')}>
        <FlowRows
          rows={seoInsights.keywords.map((keyword) => ({
            label: keyword.label,
            note: keyword.note,
            value: `${keyword.rank} (${keyword.delta})`,
            width: keyword.width,
          }))}
        />
      </SubBlock>

      <SubBlock label={t('reports.pagePerformance')}>
        <FlowRows
          rows={pagePerformance.pages.map((page) => ({
            label: page.label,
            note: page.note,
            value: `${page.value} · ${page.tag}`,
            width: page.width,
          }))}
        />
      </SubBlock>

      <SubBlock label={t('reports.sourceMix')}>
        <FlowRows rows={traffic.sourceMix} />
      </SubBlock>

      <Legend items={traffic.deviceLegend} />
      <QualityBlocks blocks={traffic.deviceBlocks} />

      <SubBlock label={t('reports.userflow')}>
        <FlowRows rows={userBehavior.userflow} />
      </SubBlock>

      <SubBlock label={t('reports.topCountries')}>
        <FlowRows
          rows={traffic.countries.map((country, index) => ({
            label: country.label,
            value: country.value,
            width: `${Math.max(24, 82 - index * 26)}%`,
          }))}
        />
      </SubBlock>
    </Section>
  )
}

function AutomationReport({ data }) {
  const { t } = useTranslation()
  const { execution, workflows, tasks, monitoring } = data

  return (
    <Section groupKey="Automation" title={t('reports.sectionAutomationTitle')} subtitle={t('reports.sectionAutomationSubtitle')}>
      <div className="reports-page__automation-top">
        <AutomationArcGauge {...execution.gauge} />
        <div>
          <span>{t('reports.systemState')}</span>
          <strong>{execution.stateValue}</strong>
          <ActivityRings
            rings={execution.lanes.map((lane) => ({
              id: lane.label,
              progress: parsePercent(lane.value, 50) / 100,
            }))}
          />
        </div>
      </div>

      <SubBlock label={t('reports.executionLane')}>
        <Legend items={execution.lanes.map((lane) => ({ label: lane.label, value: lane.value, tone: lane.tone }))} />
        <StackedBars segments={legendToStack(execution.lanes)} />
      </SubBlock>

      <SubBlock label={t('reports.taskQueue')}>
        <Legend items={tasks.stats} />
      </SubBlock>

      <SubBlock label={t('reports.workflowChains')}>
        <WorkflowRows rows={workflows.workflows} />
      </SubBlock>

      <SubBlock label={t('reports.activeTasks')}>
        <WorkflowRows rows={tasks.tasks} />
      </SubBlock>

      <SubBlock label={t('reports.serviceHealth')}>
        <FlowRows
          rows={monitoring.services.map((service) => ({
            label: service.label,
            note: `${service.note} · ${service.latency}`,
            value: service.uptime,
            width: service.uptime,
          }))}
        />
      </SubBlock>

      <MetricGrid columns={3}>
        {monitoring.summaryMetrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            <DottedDataBars columns={metric.columns} />
          </MetricItem>
        ))}
      </MetricGrid>
    </Section>
  )
}

// --- page ---------------------------------------------------------------------

const SECTION_COMPONENTS = {
  Analytics: AnalyticsReport,
  Strategy: StrategyReport,
  Sales: SalesReport,
  'Social Media': SocialReport,
  Website: WebsiteReport,
  Automation: AutomationReport,
}

const SECTION_GROUPS = {
  Analytics: 'analytics',
  Strategy: 'strategy',
  Sales: 'sales',
  'Social Media': 'social',
  Website: 'website',
  Automation: 'automation',
}

const SECTION_ORDER = ['Analytics', 'Sales', 'Strategy', 'Social Media', 'Automation', 'Website']

function getVisibleKeys(category) {
  return category === 'All' ? SECTION_ORDER : [category]
}

function RenderReports({ keys, model }) {
  return keys.map((key) => {
    const Report = SECTION_COMPONENTS[key]
    return Report ? <Report key={key} data={model[SECTION_GROUPS[key]]} /> : null
  })
}

function CompareHeaderCard({ title, selectedCount, period, onChange, onExport }) {
  const { t } = useTranslation()
  const spec = getPeriodSpec(period)

  return (
    <div className="reports-page__compare-card">
      <div className="reports-page__compare-card-head">
        <strong>{title}</strong>
        <span>{t('reports.totalSelected', { count: selectedCount })}</span>
      </div>
      <span className="reports-page__compare-label">{t('reports.durationLabel')}</span>
      <div className="reports-page__compare-pills">
        {DURATION_FILTERS.map((item) => (
          <button
            key={`${title}-${item}`}
            type="button"
            className={`reports-page__mini-pill ${item === period.duration ? 'reports-page__mini-pill--active' : ''}`}
            onClick={() => onChange({ ...period, duration: item })}
          >
            {item}
          </button>
        ))}
        {period.duration === 'Custom' ? (
          <span className="reports-page__mini-pill reports-page__mini-pill--active">{spec.label}</span>
        ) : null}
      </div>
      {period.duration === 'Custom' ? <DateRangeInputs period={period} onChange={onChange} /> : null}
      <button type="button" className="reports-page__export-button reports-page__export-button--wide" onClick={onExport}>
        <span>{t('reports.exportCsv')}</span>
        <DownloadIcon />
      </button>
    </div>
  )
}

export default function ReportsPage({ onNavigate }) {
  const { t } = useTranslation()
  const [category, setCategory] = useState('All')
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [periodA, setPeriodA] = useState(DEFAULT_PERIOD_A)
  const [periodB, setPeriodB] = useState(DEFAULT_PERIOD_B)

  const modelA = useMemo(() => buildReportModel(periodA), [periodA])
  const modelB = useMemo(() => buildReportModel(periodB), [periodB])
  const specA = modelA.spec
  const specB = modelB.spec

  const visibleKeys = useMemo(() => getVisibleKeys(category), [category])
  const selectedLabel = category === 'All' ? t('reports.allCategory') : category

  const exportSingle = (model) => {
    downloadCsv(csvFileName('nora-report', category, model.spec), buildReportCsv(model, { category }))
  }

  const handleToolbarExport = () => {
    if (compareEnabled) {
      downloadCsv(
        `nora-report-compare-${specA.label}-vs-${specB.label}.csv`.toLowerCase().replace(/\s+/g, ''),
        buildCompareCsv(modelA, modelB, { category }),
      )
    } else {
      exportSingle(modelA)
    }
  }

  return (
    <div className="reports-page">
      <Photo />
      <MainNav activeId="layers" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <main className="reports-page__viewport">
        <div className="reports-page__content">
          <header className="reports-page__header">
            <h1>{t('reports.title')}</h1>
            <p>{t('reports.subtitle')}</p>
          </header>

          <section className="reports-page__toolbar">
            <div className="reports-page__toolbar-row">
              <FilterRail label={t('reports.category')} items={CATEGORY_FILTERS} active={category} onChange={setCategory} />
              <FilterRail
                label={t('reports.duration')}
                items={DURATION_FILTERS}
                active={periodA.duration}
                onChange={(duration) => setPeriodA((current) => ({ ...current, duration }))}
                align="right"
                trailingLabel={periodA.duration === 'Custom' ? specA.label : null}
              />
            </div>
            {!compareEnabled && periodA.duration === 'Custom' ? (
              <div className="reports-page__toolbar-dates">
                <DateRangeInputs period={periodA} onChange={setPeriodA} />
              </div>
            ) : null}
            <div className="reports-page__toolbar-meta">
              <p>{t('reports.subtitle')}</p>
              <span>{t('reports.selected', { label: selectedLabel })}</span>
            </div>
            <div className="reports-page__actions">
              <button
                type="button"
                className={`reports-page__action-button ${compareEnabled ? 'reports-page__action-button--dark' : 'reports-page__action-button--blue'}`}
                onClick={() => setCompareEnabled((current) => !current)}
              >
                <span>{compareEnabled ? t('reports.disableCompare') : t('reports.enableCompare')}</span>
                <GridIcon />
              </button>
              <button type="button" className="reports-page__export-button" onClick={handleToolbarExport}>
                <span>{t('reports.exportCsv')}</span>
                <DownloadIcon />
              </button>
            </div>
          </section>

          {compareEnabled ? (
            <section className="reports-page__compare-layout">
              <div className="reports-page__compare-category">
                <FilterRail label={t('reports.category')} items={CATEGORY_FILTERS} active={category} onChange={setCategory} />
              </div>
              <div className="reports-page__compare-headers">
                <CompareHeaderCard
                  title={t('reports.periodA')}
                  selectedCount={visibleKeys.length}
                  period={periodA}
                  onChange={setPeriodA}
                  onExport={() => exportSingle(modelA)}
                />
                <CompareHeaderCard
                  title={t('reports.periodB')}
                  selectedCount={visibleKeys.length}
                  period={periodB}
                  onChange={setPeriodB}
                  onExport={() => exportSingle(modelB)}
                />
              </div>
              <div className="reports-page__compare-columns">
                <div className="reports-page__compare-column">
                  <RenderReports keys={visibleKeys} model={modelA} />
                </div>
                <div className="reports-page__compare-column">
                  <RenderReports keys={visibleKeys} model={modelB} />
                </div>
              </div>
            </section>
          ) : (
            <section className="reports-page__single-layout">
              <RenderReports keys={visibleKeys} model={modelA} />
            </section>
          )}
        </div>
      </main>

      <BottomAIStatusTools />
    </div>
  )
}
