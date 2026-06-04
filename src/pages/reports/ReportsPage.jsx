import { useMemo, useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { reportsApi } from '../../api/reports.js'
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
} from '../../api/analyticsMockData'
import {
  leadGenerationCardData,
  leadScoringCardData,
  pipelineTrackingCardData,
  revenueFeedbackCardData,
  salesAndLeadsCardData,
} from '../../api/salesAndLeadsMockData'
import {
  performanceTrackingCardData,
  socialMediaManagerCardData,
  socialMediaStrategyCardData,
} from '../../api/socialMediaStuffsMockData'
import {
  growthStrategyCardData,
  riskDetectionCardData,
  strategyIntelligenceCardData,
} from '../../api/strategyIntelligenceMockData'
import {
  pagePerformanceCardData,
  trafficQualityCardData,
  userBehaviorCardData,
  websiteTrafficCardData,
  websiteTrafficStatusCardData,
} from '../../api/websiteTrafficMockData'
import {
  automationExecutionCardData,
  systemMonitoringCardData,
  taskExecutionCardData,
  workflowAutomationCardData,
} from '../../api/automationExecutionMockData'
import downloadIconUrl from '../../assets/icons/Reports-Icon/download-icon.svg'
import tableIconUrl from '../../assets/icons/Reports-Icon/table-icon.svg'
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

function barsToDenseDotColumns(bars = []) {
  return bars.map((bar, index) => ({
    label: `P${index + 1}`,
    value: bar,
    count: Math.max(1, Math.round(bar / 9)),
  }))
}

function expandDotColumns(columns = []) {
  if (columns.length >= 10) {
    return columns
  }

  return columns.flatMap((column, index) => {
    const nextColumn = columns[index + 1]

    if (!nextColumn || columns.length + index >= 10) {
      return [column]
    }

    return [
      column,
      {
        label: `${column.label}-${nextColumn.label}`,
        value: column.value,
        count: Math.max(1, Math.round((column.count + nextColumn.count) / 2)),
      },
    ]
  }).slice(0, 10)
}

function metricToDotColumns(metric) {
  if (metric.bars) {
    return barsToDenseDotColumns(metric.bars)
  }

  return expandDotColumns(metric.columns ?? [])
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
            className={[
              'reports-page__pill',
              item === active ? 'reports-page__pill--active' : '',
              label === 'Category' && active === 'All' && (item === 'Strategy' || item === 'Website') ? 'reports-page__pill--active' : '',
            ].filter(Boolean).join(' ')}
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
  const { t } = useTranslation()
  const topMetrics = [
    ...analyticsReportingCardData.metrics.slice(0, 2),
    ...performanceSummaryCardData.results,
  ]
  const lineMetrics = [
    ...salesReportCardData.results,
    analyticsReportingCardData.metrics[2],
    portfolioAnalyticsCardData.summaryItems[2],
    { label: conversionFunnelCardData.visitsLabel, value: conversionFunnelCardData.visitsValue, ...conversionFunnelCardData.visitsChart },
  ]

  return (
    <Section groupKey="Analytics" title={t('reports.sectionAnalyticsTitle')} subtitle={t('reports.sectionAnalyticsSubtitle')}>
      <div className="reports-page__analytics-top">
        <div>
          <h3>{t('reports.revenue')}</h3>
          <AreaRevenueChart {...analyticsReportingCardData.revenueChart} />
        </div>
        <div>
          <h3>{portfolioAnalyticsCardData.gaugeTitle}</h3>
          <SemiCircleGauge {...portfolioAnalyticsCardData.gauge} />
        </div>
      </div>

      <MetricGrid columns={5} className="reports-page__analytics-metrics">
        {topMetrics.map((metric) => (
          <MetricItem key={metric.label} label={metric.label} value={metric.value}>
            <DottedDataBars columns={metricToDotColumns(metric)} className="reports-page__analytics-dots" />
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
  const { t } = useTranslation()
  const stackSegments = growthStrategyCardData.legend.map((item, index) => ({
    label: `${item.label} ${item.value}`,
    value: index === 0 ? 25 : index === 1 ? 35 : 40,
    tone: item.tone,
  }))

  return (
    <Section groupKey="Strategy" title={t('reports.sectionStrategyTitle')} subtitle={t('reports.sectionStrategySubtitle')}>
      <div className="reports-page__sub-block">
        <span>{t('reports.activeStrategy')}</span>
        <ProgressBars
          value={parsePercent(strategyIntelligenceCardData.activePercent)}
          label={strategyIntelligenceCardData.activeValue}
          endLabel={strategyIntelligenceCardData.activePercent}
        />
      </div>
      <div className="reports-page__sub-block">
        <span>{t('reports.expectedImpact')}</span>
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
        <span>{t('reports.growthStrategy')}</span>
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
  const { t } = useTranslation()
  return (
    <Section groupKey="Sales" title={t('reports.sectionSalesTitle')} subtitle={t('reports.sectionSalesSubtitle')}>
      <span className="reports-page__block-label">{t('reports.issueArea')}</span>
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
  const { t } = useTranslation()
  return (
    <Section groupKey="Social Media" title={t('reports.sectionSocialTitle')} subtitle={t('reports.sectionSocialSubtitle')}>
      <div className="reports-page__rings-row">
        <div>
          <span>{t('reports.activeCampaigns')}</span>
          <strong>{t('reports.fiveRunning')}</strong>
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
  const { t } = useTranslation()
  return (
    <Section groupKey="Website" title={t('reports.sectionWebsiteTitle')} subtitle={t('reports.sectionWebsiteSubtitle')}>
      <span className="reports-page__block-label">{t('reports.issueArea')}</span>
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
  const { t } = useTranslation()
  return (
    <Section groupKey="Automation" title={t('reports.sectionAutomationTitle')} subtitle={t('reports.sectionAutomationSubtitle')}>
      <div className="reports-page__automation-top">
        <AutomationArcGauge {...automationExecutionCardData.gauge} />
        <div>
          <span>{t('reports.systemState')}</span>
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
        <span>{t('reports.executionLane')}</span>
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
  const { t } = useTranslation()
  return (
    <div className="reports-page__compare-card">
      <div className="reports-page__compare-card-head">
        <strong>{title}</strong>
        <span>{t('reports.totalSelected', { count: selectedCount })}</span>
      </div>
      <span className="reports-page__compare-label">{t('reports.durationLabel')}</span>
      <div className="reports-page__compare-pills">
        {DURATION_FILTERS.map((item) => (
          <button key={`${title}-${item}`} type="button" className={`reports-page__mini-pill ${item === 'Custom' ? 'reports-page__mini-pill--active' : ''}`}>
            {item}
          </button>
        ))}
        <span className="reports-page__mini-pill reports-page__mini-pill--active">{dateLabel}</span>
      </div>
      <button type="button" className="reports-page__export-button reports-page__export-button--wide">
        <span>{t('reports.exportCsv')}</span>
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

function AIReportsPanel() {
  const { t } = useTranslation()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(null) // 'daily' | 'weekly' | null
  const [error, setError] = useState('')

  const loadReports = useCallback(() => {
    setLoading(true)
    return reportsApi.list({ pageSize: 10 }).then(({ items }) => {
      setReports(items)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let cancelled = false

    reportsApi.list({ pageSize: 10 }).then(({ items }) => {
      if (!cancelled) {
        setReports(items)
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) {
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const handleGenerate = async (type) => {
    setError('')
    setGenerating(type)
    try {
      await (type === 'daily' ? reportsApi.generateDaily() : reportsApi.generateWeekly())
      await loadReports()
    } catch (err) {
      setError(err.message ?? 'Generation failed.')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <section className="reports-page__ai-panel">
      <div className="reports-page__ai-header">
        <h2>{t('reports.aiReports')}</h2>
        <div className="reports-page__ai-actions">
          <button
            type="button"
            className="reports-page__action-button reports-page__action-button--blue"
            onClick={() => handleGenerate('daily')}
            disabled={generating !== null}
          >
            {generating === 'daily' ? t('reports.generating') : t('reports.generateDaily')}
          </button>
          <button
            type="button"
            className="reports-page__action-button reports-page__action-button--dark"
            onClick={() => handleGenerate('weekly')}
            disabled={generating !== null}
          >
            {generating === 'weekly' ? t('reports.generating') : t('reports.generateWeekly')}
          </button>
        </div>
      </div>
      {error ? <p className="reports-page__ai-error">{error}</p> : null}
      {loading ? (
        <p className="reports-page__ai-empty">{t('reports.loading')}</p>
      ) : reports.length === 0 ? (
        <p className="reports-page__ai-empty">{t('reports.noReports')}</p>
      ) : (
        <ul className="reports-page__ai-list">
          {reports.map((report) => (
            <li key={report.id} className="reports-page__ai-item">
              <span className={`reports-page__ai-badge reports-page__ai-badge--${report.type ?? 'daily'}`}>
                {report.type ?? 'daily'}
              </span>
              <span className="reports-page__ai-date">{report.periodDate ?? report.createdAt?.slice(0, 10)}</span>
              <span className="reports-page__ai-title">{report.title ?? 'Report'}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function ReportsPage({ onNavigate }) {
  const { t } = useTranslation()
  const [category, setCategory] = useState('All')
  const [duration, setDuration] = useState('Custom')
  const [compareEnabled, setCompareEnabled] = useState(false)
  const durationLabel = useMemo(() => (duration === 'Custom' ? 'Jan 1 - Jan 31' : duration), [duration])
  const visibleKeys = useMemo(() => getVisibleKeys(category, compareEnabled), [category, compareEnabled])
  const selectedLabel = category === 'All' ? t('reports.allCategory') : category

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
                active={duration}
                onChange={setDuration}
                align="right"
                trailingLabel={duration === 'Custom' ? durationLabel : null}
              />
            </div>
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
              <button type="button" className="reports-page__export-button">
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
