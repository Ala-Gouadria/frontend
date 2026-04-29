import { useMemo, useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './ReportsPage.css'
import {
  analyticsReportingCardData,
  campaignPerformanceCardData,
  conversionFunnelCardData,
  performanceSummaryCardData,
  portfolioAnalyticsCardData,
  salesReportCardData,
  trafficSourceBreakdownCardData,
} from '../../features/Analytics/data/analyticsMockData'
import {
  competitorTrackingCardData,
  growthStrategyCardData,
  marketInsightsCardData,
  opportunityDetectionCardData,
  riskDetectionCardData,
  strategyIntelligenceCardData,
} from '../../features/Strategy & Intelligence/data/strategyIntelligenceMockData'
import {
  leadGenerationCardData,
  leadScoringCardData,
  pipelineTrackingCardData,
  revenueFeedbackCardData,
  salesAndLeadsCardData,
} from '../../features/Sales and Leads/data/salesAndLeadsMockData'
import {
  captionGenerationCardData,
  imageGenerationCardData,
  performanceTrackingCardData,
  socialMediaManagerCardData,
  socialMediaPublishingCardData,
  socialMediaStrategyCardData,
} from '../../features/Social Media Stuffs/data/socialMediaStuffsMockData'
import {
  automationExecutionCardData,
  systemMonitoringCardData,
  taskExecutionCardData,
  workflowAutomationCardData,
} from '../../features/Automation & Execution/data/automationExecutionMockData'
import {
  conversionSignalsCardData,
  pagePerformanceCardData,
  seoInsightsCardData,
  trafficQualityCardData,
  userBehaviorCardData,
  websiteTrafficCardData,
  websiteTrafficStatusCardData,
} from '../../features/Website & Traffic/data/websiteTrafficMockData'

const CATEGORY_FILTERS = ['All', 'Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
const DURATION_FILTERS = ['All', 'Today', 'Weekly', 'Monthly', 'Custom']

const COMPARE_COLUMNS = [
  {
    title: 'Period A',
    selected: 'Total 2 Selected',
    dateLabel: 'Jan 1 - Jan 31',
  },
  {
    title: 'Period B',
    selected: 'Total 2 Selected',
    dateLabel: 'Apr 1 - Apr 31',
  },
]

function parsePoints(value = '') {
  return String(value)
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number)
      return { x, y }
    })
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
}

function pointsToString(points) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

function buildAreaPoints(points, baseY) {
  if (!points.length) {
    return ''
  }

  return [`${points[0].x},${baseY}`, ...points.map((point) => `${point.x},${point.y}`), `${points.at(-1).x},${baseY}`].join(' ')
}

function buildDualAreaPoints(upperSeries, lowerSeries) {
  return [...upperSeries, ...[...lowerSeries].reverse()].map((point) => `${point.x},${point.y}`).join(' ')
}

function buildArcPath(cx, cy, radius) {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`
}

function getArcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

function FilterRail({ label, items, active, onChange, align = 'left' }) {
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
      </div>
    </div>
  )
}

function CompareHeaderCard({ title, selected, duration }) {
  return (
    <div className="reports-page__compare-card">
      <div className="reports-page__compare-card-head">
        <strong>{title}</strong>
        <span>{selected}</span>
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
        Export As CSV
      </button>
    </div>
  )
}

function MiniBarChart({ bars, tone = 'ink' }) {
  return (
    <svg className="reports-page__mini-bars" viewBox="0 0 120 42" aria-hidden="true">
      {bars.map((bar, index) => (
        <rect
          key={`${tone}-${bar}-${index}`}
          x={index * 8.4}
          y={40 - bar / 2}
          width="2.4"
          height={bar / 2}
          rx="1.2"
          className={`reports-page__mini-bar reports-page__mini-bar--${tone}`}
          style={{ '--bar-index': index }}
        />
      ))}
    </svg>
  )
}

function MiniLineChart({ points, tone = 'green' }) {
  const parsed = parsePoints(points)
  const areaPoints = buildAreaPoints(parsed, 42)

  return (
    <svg className="reports-page__mini-line" viewBox="0 0 194 42" aria-hidden="true">
      <defs>
        <linearGradient id={`mini-line-fill-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone === 'red' ? 'rgba(255, 140, 140, 0.28)' : 'rgba(201, 228, 91, 0.34)'} />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#mini-line-fill-${tone})`} />
      <polyline points={pointsToString(parsed)} className={`reports-page__mini-line-stroke reports-page__mini-line-stroke--${tone}`} />
    </svg>
  )
}

function HalfGauge({ value, label, progress, tone = 'green' }) {
  const ringPath = buildArcPath(120, 118, 90)
  const cap = getArcPoint(120, 118, 90, progress)
  const pathLength = 100

  return (
    <div className="reports-page__gauge-block">
      <div className="reports-page__section-caption">{label}</div>
      <svg className="reports-page__gauge" viewBox="0 0 240 132" aria-hidden="true">
        <path d={ringPath} className="reports-page__gauge-glow" />
        <path d={ringPath} className="reports-page__gauge-base" />
        <path
          d={ringPath}
          pathLength={pathLength}
          strokeDasharray={`${progress * pathLength} ${pathLength}`}
          className={`reports-page__gauge-progress reports-page__gauge-progress--${tone}`}
        />
        <circle cx={cap.x} cy={cap.y} r="10" className="reports-page__gauge-cap" />
      </svg>
      <div className="reports-page__gauge-value">{value}</div>
    </div>
  )
}

function AnalyticsReportSection() {
  const firstRow = [
    analyticsReportingCardData.metrics[0],
    analyticsReportingCardData.metrics[1],
    {
      label: 'Reach',
      value: performanceSummaryCardData.results[0].value,
      bars: performanceSummaryCardData.results[0].columns.map((column) => column.count * 10 + 10),
    },
    {
      label: 'Engagement',
      value: performanceSummaryCardData.results[1].value,
      bars: performanceSummaryCardData.results[1].columns.map((column) => column.count * 9 + 12),
    },
    {
      label: 'Leads',
      value: performanceSummaryCardData.results[2].value,
      bars: performanceSummaryCardData.results[2].columns.map((column) => column.count * 9 + 14),
    },
  ]

  const secondRow = [
    {
      label: salesReportCardData.results[0].label,
      value: salesReportCardData.results[0].value,
      points: salesReportCardData.results[0].points,
    },
    {
      label: salesReportCardData.results[1].label,
      value: salesReportCardData.results[1].value,
      points: salesReportCardData.results[1].points,
    },
    {
      label: analyticsReportingCardData.metrics[2].label,
      value: analyticsReportingCardData.metrics[2].value,
      points: analyticsReportingCardData.metrics[2].points,
    },
    {
      label: 'Growth',
      value: portfolioAnalyticsCardData.growthValue,
      points: portfolioAnalyticsCardData.growthChart.points,
    },
    {
      label: 'Total Visit',
      value: '126750',
      points: performanceSummaryCardData.snapshotChart.points,
    },
  ]

  const upperSeries = analyticsReportingCardData.revenueChart.upperSeries
  const lowerSeries = analyticsReportingCardData.revenueChart.lowerSeries
  const activePoint = upperSeries[analyticsReportingCardData.revenueChart.activeIndex]
  const areaPoints = buildDualAreaPoints(upperSeries, lowerSeries)

  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{analyticsReportingCardData.title}</h2>
          <p className="reports-page__section-subtitle">{analyticsReportingCardData.subtitle}</p>
        </div>
      </div>

      <div className="reports-page__analytics-top">
        <div className="reports-page__analytics-chart-block">
          <div className="reports-page__section-caption">{analyticsReportingCardData.chartTitle}</div>
          <svg className="reports-page__analytics-chart" viewBox="0 0 372 140" aria-hidden="true">
            <defs>
              <linearGradient id="reports-analytics-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4ed3f" />
                <stop offset="100%" stopColor="#78a10d" />
              </linearGradient>
              <filter id="reports-analytics-glow" x="-12%" y="-22%" width="124%" height="144%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon points={areaPoints} className="reports-page__analytics-area reports-page__analytics-area--glow" />
            <polygon points={areaPoints} className="reports-page__analytics-area" />
            <polyline points={pointsToString(upperSeries)} className="reports-page__analytics-line" />
            <polyline points={pointsToString(lowerSeries)} className="reports-page__analytics-line reports-page__analytics-line--soft" />
            <line x1={activePoint.x} x2={activePoint.x} y1="18" y2="128" className="reports-page__analytics-focus" />
            {upperSeries.map((point, index) => (
              <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r="3.3" className="reports-page__analytics-dot" />
            ))}
            <g transform={`translate(${activePoint.x}, ${activePoint.y + 34})`}>
              <rect x="-22" y="-12" width="44" height="24" rx="12" className="reports-page__analytics-badge" />
              <text textAnchor="middle" dy="4" className="reports-page__analytics-badge-text">
                {activePoint.tooltip}
              </text>
            </g>
          </svg>
        </div>

        <HalfGauge
          value={`${portfolioAnalyticsCardData.gauge.current}/${portfolioAnalyticsCardData.gauge.target}`}
          label={portfolioAnalyticsCardData.gaugeTitle}
          progress={portfolioAnalyticsCardData.gauge.progress}
        />
      </div>

      <div className="reports-page__metric-grid reports-page__metric-grid--five">
        {firstRow.map((metric) => (
          <div key={metric.label} className="reports-page__metric-card">
            <span className="reports-page__metric-label">{metric.label}</span>
            <strong className="reports-page__metric-value">{metric.value}</strong>
            <MiniBarChart bars={metric.bars} />
          </div>
        ))}
      </div>

      <div className="reports-page__metric-grid reports-page__metric-grid--five">
        {secondRow.map((metric) => (
          <div key={`${metric.label}-${metric.value}`} className="reports-page__metric-card">
            <span className="reports-page__metric-label">{metric.label}</span>
            <strong className="reports-page__metric-value">{metric.value}</strong>
            <MiniLineChart points={metric.points} />
          </div>
        ))}
      </div>

      <FeaturePulseGrid
        items={[
          performanceSummaryCardData,
          campaignPerformanceCardData,
          portfolioAnalyticsCardData,
          salesReportCardData,
          conversionFunnelCardData,
          trafficSourceBreakdownCardData,
        ]}
      />
    </section>
  )
}

function StackedStrategyBar({ items }) {
  const total = items.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="reports-page__stacked-bar">
      {items.map((item, index) => (
        <span
          key={`${item.tone}-${index}`}
          className={`reports-page__stacked-segment reports-page__stacked-segment--${item.tone}`}
          style={{ width: `${(item.count / total) * 100}%` }}
        />
      ))}
    </div>
  )
}

function RiskTrendRow({ risk }) {
  const points = parsePoints(risk.points)
  const areaPoints = buildAreaPoints(points, 42)

  return (
    <div className="reports-page__risk-row">
      <div className="reports-page__risk-head">
        <div>
          <strong>{risk.title}</strong>
          <span>{risk.state}</span>
        </div>
        <strong>{risk.metric}</strong>
      </div>
      <svg className="reports-page__risk-chart" viewBox="0 0 270 42" aria-hidden="true">
        <defs>
          <linearGradient id="reports-risk-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 126, 126, 0.26)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#reports-risk-fill)" />
        <polyline points={pointsToString(points)} className="reports-page__risk-line" />
      </svg>
    </div>
  )
}

function StrategyReportSection() {
  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{strategyIntelligenceCardData.title}</h2>
          <p className="reports-page__section-subtitle">{strategyIntelligenceCardData.subtitle}</p>
        </div>
      </div>

      <div className="reports-page__strategy-block">
        <div className="reports-page__label-row">
          <span>{strategyIntelligenceCardData.activeLabel}</span>
          <strong>{strategyIntelligenceCardData.activePercent}</strong>
        </div>
        <strong className="reports-page__strategy-highlight">{strategyIntelligenceCardData.activeValue}</strong>
        <div className="reports-page__progress-track">
          <div className="reports-page__progress-fill" style={{ width: `${strategyIntelligenceCardData.activeProgress * 100}%` }} />
          <span className="reports-page__progress-cap" style={{ left: `calc(${strategyIntelligenceCardData.activeProgress * 100}% - 7px)` }} />
        </div>
      </div>

      <div className="reports-page__strip-metrics">
        <div className="reports-page__strip">
          <div className="reports-page__label-row">
            <span className="reports-page__accent reports-page__accent--orange">{strategyIntelligenceCardData.confidenceLabel}</span>
            <strong className="reports-page__accent reports-page__accent--orange">{strategyIntelligenceCardData.confidenceValue}</strong>
          </div>
          <div className="reports-page__strip-track">
            <div className="reports-page__strip-fill reports-page__strip-fill--orange" style={{ width: strategyIntelligenceCardData.confidenceWidth }} />
          </div>
        </div>

        <div className="reports-page__strip">
          <div className="reports-page__label-row">
            <span className="reports-page__accent reports-page__accent--green">{strategyIntelligenceCardData.opportunityLabel}</span>
            <strong className="reports-page__accent reports-page__accent--green">{strategyIntelligenceCardData.opportunityValue}</strong>
          </div>
          <div className="reports-page__strip-track">
            <div className="reports-page__strip-fill reports-page__strip-fill--green" style={{ width: strategyIntelligenceCardData.opportunityWidth }} />
          </div>
        </div>
      </div>

      <div className="reports-page__growth-block">
        <div className="reports-page__section-caption">{growthStrategyCardData.title}</div>
        <div className="reports-page__legend-row">
          {growthStrategyCardData.legend.map((item) => (
            <span key={item.label} className="reports-page__legend-chip">
              <span className={`reports-page__legend-dot reports-page__legend-dot--${item.tone}`} />
              {item.label} {item.value}
            </span>
          ))}
        </div>
        <StackedStrategyBar items={growthStrategyCardData.stack} />
      </div>

      <div className="reports-page__impact-block">
        <div className="reports-page__section-caption">{strategyIntelligenceCardData.reasonsTitle}</div>
        <div className="reports-page__metric-grid reports-page__metric-grid--three">
          {strategyIntelligenceCardData.reasonColumns.map((item) => (
            <div key={item.label} className="reports-page__metric-card">
              <span className="reports-page__metric-label">{item.label}</span>
              <strong className="reports-page__metric-value reports-page__metric-value--green">{item.value}</strong>
              <MiniBarChart bars={item.bars} tone="green" />
            </div>
          ))}
        </div>
      </div>

      <div className="reports-page__risk-block">
        <div className="reports-page__section-caption">Active Risks</div>
        {riskDetectionCardData.risks.map((risk) => (
          <RiskTrendRow key={`${risk.title}-${risk.metric}`} risk={risk} />
        ))}
      </div>

      <FeaturePulseGrid
        items={[
          marketInsightsCardData,
          growthStrategyCardData,
          opportunityDetectionCardData,
          competitorTrackingCardData,
          riskDetectionCardData,
        ]}
      />
    </section>
  )
}

function QualityBlocks({ blocks }) {
  const expanded = blocks.flatMap((block) => Array.from({ length: block.count }, (_, index) => `${block.tone}-${index}`))

  return (
    <div className="reports-page__quality-blocks">
      {expanded.map((key) => {
        const tone = key.split('-')[0]
        return <span key={key} className={`reports-page__quality-block reports-page__quality-block--${tone}`} />
      })}
    </div>
  )
}

function StageFlow({ stages }) {
  return (
    <div className="reports-page__stage-flow">
      {stages.map((stage, index) => (
        <div key={stage} className="reports-page__stage-wrap">
          <span className={`reports-page__stage-pill ${index === stages.length - 1 ? 'reports-page__stage-pill--orange' : ''}`}>
            {stage}
          </span>
          {index < stages.length - 1 && <span className="reports-page__stage-arrow">›</span>}
        </div>
      ))}
    </div>
  )
}

function ProgressRows({ rows }) {
  return (
    <div className="reports-page__progress-rows">
      {rows.map((row) => (
        <div key={row.label} className="reports-page__progress-row">
          <div className="reports-page__label-row">
            <strong>{row.label}</strong>
            <span>{row.value || row.score || row.tag || row.state}</span>
          </div>
          {row.note && <span className="reports-page__progress-note">{row.note}</span>}
          <div className="reports-page__strip-track">
            <div className={`reports-page__strip-fill reports-page__strip-fill--${row.tone || 'green'}`} style={{ width: row.width || row.progress || '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ReportMetricCard({ metric, tone = 'green' }) {
  return (
    <div className="reports-page__metric-card">
      <span className="reports-page__metric-label">{metric.label || metric.title}</span>
      <strong className={`reports-page__metric-value ${String(metric.value || metric.delta || '').startsWith('-') ? '' : 'reports-page__metric-value--green'}`}>
        {metric.value || metric.delta}
      </strong>
      {metric.points ? <MiniLineChart points={metric.points} tone={String(metric.value || metric.delta || '').startsWith('-') ? 'red' : tone} /> : <MiniBarChart bars={metric.bars || metric.columns?.map((column) => column.count * 10 + 10) || []} tone={tone} />}
    </div>
  )
}

function getFeatureValue(card) {
  return (
    card.activeValue ||
    card.flowValue ||
    card.scoredDelta ||
    card.pipelineDelta ||
    card.responseValue ||
    card.trendDelta ||
    card.growthValue ||
    card.visitsValue ||
    card.topSourceValue ||
    card.currentActivity?.progress ||
    card.currentBatch?.completed && `${card.currentBatch.completed}/${card.currentBatch.total}` ||
    card.stateValue ||
    card.pulseValue ||
    card.snapshotState ||
    card.status ||
    'Active'
  )
}

function getFeaturePoints(card) {
  return (
    card.topChart?.points ||
    card.growthChart?.points ||
    card.visitsChart?.points ||
    card.topSourceChart?.points ||
    card.trend?.points ||
    card.snapshotChart?.points ||
    card.revenueChart?.points ||
    card.bottomChart?.points ||
    card.campaigns?.[0]?.points ||
    card.results?.[0]?.points ||
    card.reasonColumns?.[0]?.bars ||
    null
  )
}

function FeaturePulseGrid({ items }) {
  return (
    <div className="reports-page__feature-pulses">
      {items.map((item) => {
        const points = getFeaturePoints(item)

        return (
          <div key={item.title} className="reports-page__feature-pulse">
            <div className="reports-page__label-row">
              <div>
                <strong>{item.title}</strong>
                <span className="reports-page__progress-note">{item.subtitle}</span>
              </div>
              <span>{getFeatureValue(item)}</span>
            </div>
            {typeof points === 'string' ? <MiniLineChart points={points} /> : <MiniBarChart bars={Array.isArray(points) ? points : [18, 34, 28, 42, 22, 46, 30, 38, 26, 44, 32, 40]} tone="green" />}
          </div>
        )
      })}
    </div>
  )
}

function SalesReportSection() {
  const leadFlowCards = [
    { label: leadGenerationCardData.flowLabel, value: leadGenerationCardData.flowValue, points: leadGenerationCardData.topChart.points },
    { label: 'Scored leads', value: '+12%', points: leadGenerationCardData.topChart.points },
    { label: 'Open pipeline', value: '+12%', points: leadGenerationCardData.topChart.points },
    { label: 'Revenue response', value: '+16%', points: leadGenerationCardData.topChart.points },
  ]

  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{salesAndLeadsCardData.title}</h2>
          <p className="reports-page__section-subtitle">{salesAndLeadsCardData.subtitle}</p>
        </div>
      </div>

      <StageFlow stages={salesAndLeadsCardData.stages} />

      <div className="reports-page__legend-row">
        {salesAndLeadsCardData.legend.map((item) => (
          <span key={item.label} className="reports-page__legend-chip">
            <span className={`reports-page__legend-dot reports-page__legend-dot--${item.tone}`} />
            {item.label} {item.value}
          </span>
        ))}
      </div>
      <QualityBlocks blocks={salesAndLeadsCardData.blocks} />

      <div className="reports-page__metric-grid reports-page__metric-grid--three">
        {leadGenerationCardData.sources.map((source) => (
          <ReportMetricCard key={source.label} metric={{ ...source, value: source.value }} />
        ))}
      </div>

      <div className="reports-page__metric-grid reports-page__metric-grid--two">
        {leadFlowCards.map((metric) => (
          <ReportMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <ProgressRows
        rows={[
          { label: 'Instagram', value: '45%', width: '45%' },
          { label: 'Website', value: '30%', width: '30%' },
          { label: 'Ads', value: '25%', width: '25%' },
        ]}
      />
      <FeaturePulseGrid items={[leadScoringCardData, pipelineTrackingCardData, revenueFeedbackCardData]} />
    </section>
  )
}

function SocialReportSection() {
  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{socialMediaManagerCardData.title}</h2>
          <p className="reports-page__section-subtitle">{socialMediaManagerCardData.subtitle}</p>
        </div>
      </div>

      <div className="reports-page__social-row">
        <div>
          <span className="reports-page__metric-label">Active campaigns</span>
          <strong className="reports-page__metric-value reports-page__metric-value--green">{socialMediaManagerCardData.currentActivity.progress} running</strong>
        </div>
        <div className="reports-page__ring-row">
          {socialMediaManagerCardData.engagementCards.map((card) => (
            <span key={card.icon} className={`reports-page__activity-ring reports-page__activity-ring--${card.tone}`} />
          ))}
          <span className="reports-page__activity-ring reports-page__activity-ring--soft" />
          <span className="reports-page__activity-ring reports-page__activity-ring--soft" />
        </div>
      </div>

      <div className="reports-page__platform-grid">
        {socialMediaManagerCardData.engagementCards.map((card) => (
          <div key={card.icon} className={`reports-page__platform-card reports-page__platform-card--${card.tone}`}>
            <div className="reports-page__label-row">
              <strong>{card.icon}</strong>
              <span>{card.value}</span>
            </div>
            <MiniLineChart points={card.points} tone={card.tone === 'pink' ? 'red' : 'green'} />
          </div>
        ))}
      </div>

      <div className="reports-page__metric-grid reports-page__metric-grid--three">
        {performanceTrackingCardData.reasons.map((reason) => (
          <ReportMetricCard key={reason.title} metric={{ label: reason.title, value: reason.value, bars: reason.bars }} tone={reason.tone === 'red' ? 'ink' : 'green'} />
        ))}
      </div>
      <FeaturePulseGrid
        items={[
          socialMediaPublishingCardData,
          captionGenerationCardData,
          imageGenerationCardData,
          socialMediaStrategyCardData,
          performanceTrackingCardData,
        ]}
      />
    </section>
  )
}

function WebsiteReportSection() {
  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{websiteTrafficStatusCardData.title}</h2>
          <p className="reports-page__section-subtitle">{websiteTrafficStatusCardData.subtitle}</p>
        </div>
      </div>

      <StageFlow stages={websiteTrafficStatusCardData.stages} />

      <div className="reports-page__legend-row">
        {websiteTrafficStatusCardData.legend.map((item) => (
          <span key={item.label} className="reports-page__legend-chip">
            <span className={`reports-page__legend-dot reports-page__legend-dot--${item.tone}`} />
            {item.label} {item.value}
          </span>
        ))}
      </div>
      <QualityBlocks blocks={websiteTrafficStatusCardData.blocks} />

      <div className="reports-page__metric-grid reports-page__metric-grid--five">
        {websiteTrafficCardData.reasonMetrics.slice(0, 5).map((metric) => (
          <ReportMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="reports-page__gauge-pair">
        {pagePerformanceCardData.gauges.map((gauge) => (
          <HalfGauge key={gauge.label} value={gauge.value} label={gauge.label} progress={gauge.progress} />
        ))}
      </div>

      <ProgressRows rows={websiteTrafficCardData.sourceMix} />
      <QualityBlocks blocks={websiteTrafficCardData.deviceBlocks} />
      <FeaturePulseGrid
        items={[
          seoInsightsCardData,
          trafficQualityCardData,
          websiteTrafficCardData,
          userBehaviorCardData,
          pagePerformanceCardData,
          conversionSignalsCardData,
        ]}
      />
    </section>
  )
}

function AutomationReportSection() {
  return (
    <section className="reports-page__report-section">
      <div className="reports-page__section-header">
        <div>
          <h2 className="reports-page__section-title">{automationExecutionCardData.title}</h2>
          <p className="reports-page__section-subtitle">{automationExecutionCardData.subtitle}</p>
        </div>
      </div>

      <div className="reports-page__automation-head">
        <HalfGauge value={automationExecutionCardData.gauge.label} label={automationExecutionCardData.gauge.sublabel} progress={automationExecutionCardData.gauge.progress} />
        <ProgressRows rows={automationExecutionCardData.lanes.map((lane) => ({ label: lane.label, value: lane.value, width: lane.value, tone: lane.tone }))} />
      </div>

      <div className="reports-page__workflow-list">
        {workflowAutomationCardData.workflows.map((workflow) => (
          <div key={workflow.label} className="reports-page__workflow-row">
            <div className="reports-page__label-row">
              <div>
                <strong>{workflow.label}</strong>
                <span className="reports-page__progress-note">{workflow.note}</span>
              </div>
              <span>{workflow.state}</span>
            </div>
            <div className="reports-page__workflow-blocks">
              {workflow.blocks.map((block, index) => (
                <span key={`${workflow.label}-${index}`} style={{ opacity: block }} />
              ))}
            </div>
            <span className="reports-page__progress-note">{workflow.result}</span>
          </div>
        ))}
      </div>

      <div className="reports-page__metric-grid reports-page__metric-grid--three">
        {systemMonitoringCardData.summaryMetrics.map((metric) => (
          <ReportMetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <FeaturePulseGrid items={[taskExecutionCardData, workflowAutomationCardData, systemMonitoringCardData]} />
    </section>
  )
}

function ReportSections({ category }) {
  const sections = [
    { key: 'Analytics', component: <AnalyticsReportSection /> },
    { key: 'Strategy', component: <StrategyReportSection /> },
    { key: 'Sales', component: <SalesReportSection /> },
    { key: 'Social Media', component: <SocialReportSection /> },
    { key: 'Website', component: <WebsiteReportSection /> },
    { key: 'Automation', component: <AutomationReportSection /> },
  ]

  return sections
    .filter((section) => category === 'All' || section.key === category)
    .map((section) => <div key={section.key}>{section.component}</div>)
}

function CompareReportColumn({ period, category }) {
  return (
    <div className="reports-page__compare-column">
      <CompareHeaderCard title={period.title} selected={period.selected} duration={period.dateLabel} />
      <ReportSections category={category} />
    </div>
  )
}

export default function ReportsPage({ onNavigate }) {
  const [category, setCategory] = useState('All')
  const [duration, setDuration] = useState('Custom')
  const [compareEnabled, setCompareEnabled] = useState(true)

  const durationLabel = useMemo(() => (duration === 'Custom' ? 'Jan 1 - Jan 31' : duration), [duration])

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
              <FilterRail label="Duration" items={DURATION_FILTERS} active={duration} onChange={setDuration} align="right" />
            </div>

            <div className="reports-page__toolbar-meta">
              <p className="reports-page__toolbar-note">
                Review business performance by department, compare time periods side by side, and export structured report data.
              </p>
              <span className="reports-page__toolbar-hint">All category Selected</span>
            </div>

            <div className="reports-page__actions">
              <button
                type="button"
                className={`reports-page__action-button ${compareEnabled ? 'reports-page__action-button--dark' : 'reports-page__action-button--blue'}`}
                onClick={() => setCompareEnabled((current) => !current)}
              >
                {compareEnabled ? 'Disable Compare' : 'Enable Compare'}
              </button>

              <button type="button" className="reports-page__export-button">
                Export As CSV
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
                  <CompareReportColumn key={column.title} period={column} category={category} />
                ))}
              </div>
            </section>
          ) : (
            <section className="reports-page__single-layout">
              <ReportSections category={category} />
            </section>
          )}
        </main>
      </div>

      <BottomAIStatusTools />
      <div className="reports-page__ambient reports-page__ambient--left" aria-hidden="true" />
      <div className="reports-page__ambient reports-page__ambient--right" aria-hidden="true" />
      <div className="reports-page__ambient reports-page__ambient--bottom" aria-hidden="true" />
      <div className="reports-page__grain" aria-hidden="true" />
      <div className="reports-page__date-chip" aria-hidden="true">
        {durationLabel}
      </div>
    </div>
  )
}
