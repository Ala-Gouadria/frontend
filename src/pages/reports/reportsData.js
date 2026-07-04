// Data layer for ReportsPage.
//
// Takes the mock data behind every dashboard card (all six category modules)
// and derives a duration-aware view model from it: each duration (Today /
// Weekly / Monthly / All / Custom range) gets its own deterministic variation
// of every value, chart series and gauge, so the page re-renders with real
// differences when the period changes — same period always yields the same
// numbers. The same model also feeds the CSV export so what you download is
// exactly what you see.

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
  leadGenerationCardData,
  leadScoringCardData,
  pipelineTrackingCardData,
  revenueFeedbackCardData,
  salesAndLeadsCardData,
} from '../../api/salesAndLeadsMockData'
import {
  performanceTrackingCardData,
  socialMediaManagerCardData,
  socialMediaPublishingCardData,
  socialMediaStrategyCardData,
} from '../../api/socialMediaStuffsMockData'
import {
  competitorTrackingCardData,
  growthStrategyCardData,
  marketInsightsCardData,
  opportunityDetectionCardData,
  riskDetectionCardData,
  strategyIntelligenceCardData,
} from '../../api/strategyIntelligenceMockData'
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
  automationExecutionCardData,
  systemMonitoringCardData,
  taskExecutionCardData,
  workflowAutomationCardData,
} from '../../api/automationExecutionMockData'

export const CATEGORY_FILTERS = ['All', 'Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
export const DURATION_FILTERS = ['All', 'Today', 'Weekly', 'Monthly', 'Custom']

// Base data is mostly "this week", so Weekly is the 1x reference scale.
const DURATION_SCALES = { All: 12, Today: 0.15, Weekly: 1, Monthly: 4.3 }

// --- deterministic randomness -------------------------------------------

function hashString(input) {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed) {
  let state = seed
  return function next() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rngFor(ctx, path) {
  return mulberry32(hashString(`${ctx.seedKey}|${path}`))
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function clampInt(value, min, max) {
  return Math.round(clampNumber(value, min, max))
}

// --- period spec ----------------------------------------------------------

export function formatRangeLabel(from, to) {
  const options = { month: 'short', day: 'numeric' }
  const fromDate = new Date(from)
  const toDate = new Date(to)
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return 'Custom range'
  }
  return `${fromDate.toLocaleDateString('en-US', options)} - ${toDate.toLocaleDateString('en-US', options)}`
}

// period: { duration: 'All'|'Today'|'Weekly'|'Monthly'|'Custom', from, to }
export function getPeriodSpec(period) {
  if (period.duration === 'Custom') {
    const from = period.from || '2026-01-01'
    const to = period.to || '2026-01-31'
    const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1)
    return {
      key: 'Custom',
      scale: days / 7,
      seedKey: `custom:${from}:${to}`,
      label: formatRangeLabel(from, to),
    }
  }
  return {
    key: period.duration,
    scale: DURATION_SCALES[period.duration] ?? 1,
    seedKey: `duration:${period.duration}`,
    label: period.duration,
  }
}

// --- value transformation --------------------------------------------------

// Keys whose string values carry the numbers shown in the UI.
const VALUE_KEY_REGEX = /(value|delta|percent|width|metric|score|rank|uptime|latency|summary|stats|progress|current|tooltip)/i
// Keys that are rates/scores: they wobble with the period but never scale with its length.
const RATE_KEY_REGEX = /(score|rank|uptime|latency|width|percent|progress)/i

const NUM_TOKEN_REGEX = /^([+-]?)(\$?)(\d+(?:\.\d+)?)(ms|k|K|M|m|s|%)?$/

function formatCount(value, suffix, hadDecimals, original) {
  if (suffix === 'k' || suffix === 'K') {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}M`
    if (value < 10) return `${value.toFixed(1)}${suffix}`
    return `${Math.round(value)}${suffix}`
  }
  if (suffix === 'M') {
    return value < 10 ? `${value.toFixed(1)}M` : `${Math.round(value)}M`
  }
  if (value < 10 && hadDecimals) return value.toFixed(1)
  const rounded = Math.round(value)
  // A non-zero base count never collapses to zero on short durations.
  return String(original >= 1 && rounded < 1 ? 1 : rounded)
}

function transformToken(token, rng, scale, forceRate) {
  const match = token.match(NUM_TOKEN_REGEX)
  if (!match) return token

  const [, sign, currency, numText, suffix = ''] = match
  const num = Number.parseFloat(numText)
  const decimals = numText.includes('.') ? 1 : 0
  const isRate =
    forceRate ||
    suffix === '%' ||
    suffix === 's' ||
    suffix === 'ms' ||
    suffix === 'm' ||
    (decimals > 0 && num < 20 && suffix === '') ||
    (sign !== '' && suffix === '' && num <= 10)

  if (isRate) {
    let next
    let digits = decimals
    if (suffix === '%' && num >= 95) {
      // Uptime-style figures stay in the high nineties.
      next = Math.min(99.9, num - 1.2 + rng() * 1.9)
      digits = 1
    } else {
      next = num * (0.86 + rng() * 0.3)
      if (suffix === '%' && sign === '' && num <= 100) next = Math.min(next, 99.5)
    }
    const text = digits > 0 ? next.toFixed(digits) : String(Math.round(next))
    return `${sign}${currency}${text}${suffix}`
  }

  const next = num * scale * (0.9 + rng() * 0.2)
  return `${sign}${currency}${formatCount(next, suffix, decimals > 0, num)}`
}

function transformValueString(value, rng, scale, forceRate) {
  return value
    .split(/(\s+)/)
    .map((token) => transformToken(token, rng, scale, forceRate))
    .join('')
}

function jitterPoints(points, ctx, path) {
  const rng = rngFor(ctx, path)
  const pairs = String(points)
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(',').map(Number))
  const maxY = Math.max(...pairs.map(([, y]) => y), 1)

  return pairs
    .map(([x, y]) => {
      const nextY = clampNumber(y * (0.8 + rng() * 0.4), 2, maxY * 1.15)
      return `${x},${Math.round(nextY * 10) / 10}`
    })
    .join(' ')
}

function rebuildFillPoints(points, originalFill) {
  const baseline = String(originalFill).trim().split(/\s+/)[0]?.split(',')[1]
  if (baseline == null) return originalFill
  const pairs = points.trim().split(/\s+/)
  const firstX = pairs[0].split(',')[0]
  const lastX = pairs[pairs.length - 1].split(',')[0]
  return `${firstX},${baseline} ${points} ${lastX},${baseline}`
}

const SKIP_KEYS = new Set(['api', 'tooltips'])

function deriveNumber(value, ctx, path, key) {
  const rng = rngFor(ctx, path)
  switch (key) {
    case 'progress':
      return clampNumber(value * (0.85 + rng() * 0.3), 0.05, 0.98)
    case 'y':
      return Math.round(value * (0.85 + rng() * 0.3))
    case 'count':
      return clampInt(value * (0.7 + rng() * 0.6), 1, value <= 7 ? 7 : 18)
    case 'bars':
      return clampInt(value * (0.65 + rng() * 0.7), 4, 96)
    case 'blocks':
      // Workflow-chain block arrays: full blocks stay full, partials wobble.
      return value >= 1 ? 1 : clampNumber(value * (0.7 + rng() * 0.6), 0.12, 0.95)
    case 'healthScore':
      return clampInt(value * (0.8 + rng() * 0.5), 2, 5)
    case 'activeBlocks':
      return Math.round(value * (0.7 + rng() * 0.6))
    default:
      return value
  }
}

function deriveString(value, ctx, path, key) {
  if (!VALUE_KEY_REGEX.test(key) || !/\d/.test(value)) return value
  const rng = rngFor(ctx, path)
  return transformValueString(value, rng, ctx.scale, RATE_KEY_REGEX.test(key))
}

function deriveNode(node, ctx, path, key = '') {
  if (Array.isArray(node)) {
    return node.map((item, index) => deriveNode(item, ctx, `${path}[${index}]`, key))
  }

  if (node && typeof node === 'object') {
    const out = {}
    for (const [childKey, childValue] of Object.entries(node)) {
      if (SKIP_KEYS.has(childKey)) {
        out[childKey] = childValue
        continue
      }
      if (childKey === 'fillPoints') continue // rebuilt from the derived points below
      if (childKey === 'points' && typeof childValue === 'string') {
        const derivedPoints = jitterPoints(childValue, ctx, `${path}.points`)
        out.points = derivedPoints
        if (typeof node.fillPoints === 'string') {
          out.fillPoints = rebuildFillPoints(derivedPoints, node.fillPoints)
        }
        continue
      }
      out[childKey] = deriveNode(childValue, ctx, `${path}.${childKey}`, childKey)
    }

    // Progress ratios shown as "7/12" style pairs: vary within the total.
    if (typeof node.total === 'number') {
      const rng = rngFor(ctx, `${path}.__ratio`)
      if (typeof node.completed === 'number') {
        out.completed = clampInt(node.completed * (0.6 + rng() * 0.8), 1, node.total)
      }
      if (typeof node.current === 'number' && !('target' in node)) {
        out.current = clampInt(node.current * (0.6 + rng() * 0.8), 1, node.total)
      }
    }

    // Target gauges (e.g. 578/700): both sides scale with the period length.
    if (typeof node.target === 'number' && typeof node.current === 'number') {
      const rng = rngFor(ctx, `${path}.__gauge`)
      out.current = Math.max(1, Math.round(node.current * ctx.scale * (0.9 + rng() * 0.2)))
      out.target = Math.max(out.current, Math.round(node.target * ctx.scale))
      out.progress = clampNumber(out.current / out.target, 0.04, 1)
    }

    // Keep "70% In Progress"-style labels in sync with the derived progress.
    if (typeof out.progress === 'number' && typeof out.label === 'string' && /^\d+%/.test(out.label)) {
      out.label = out.label.replace(/^\d+%/, `${Math.round(out.progress * 100)}%`)
    }

    if (typeof out.totalBlocks === 'number' && typeof out.activeBlocks === 'number') {
      out.activeBlocks = clampInt(out.activeBlocks, 0, out.totalBlocks)
    }

    return out
  }

  if (typeof node === 'number') return deriveNumber(node, ctx, path, key)
  if (typeof node === 'string') return deriveString(node, ctx, path, key)
  return node
}

// --- report model -----------------------------------------------------------

const CARD_SOURCES = {
  analytics: {
    analyticsReporting: analyticsReportingCardData,
    performanceSummary: performanceSummaryCardData,
    campaignPerformance: campaignPerformanceCardData,
    portfolioAnalytics: portfolioAnalyticsCardData,
    salesReport: salesReportCardData,
    conversionFunnel: conversionFunnelCardData,
    trafficSourceBreakdown: trafficSourceBreakdownCardData,
  },
  strategy: {
    strategyIntelligence: strategyIntelligenceCardData,
    growthStrategy: growthStrategyCardData,
    marketInsights: marketInsightsCardData,
    opportunityDetection: opportunityDetectionCardData,
    competitorTracking: competitorTrackingCardData,
    riskDetection: riskDetectionCardData,
  },
  sales: {
    salesAndLeads: salesAndLeadsCardData,
    leadGeneration: leadGenerationCardData,
    leadScoring: leadScoringCardData,
    pipelineTracking: pipelineTrackingCardData,
    revenueFeedback: revenueFeedbackCardData,
  },
  social: {
    manager: socialMediaManagerCardData,
    strategy: socialMediaStrategyCardData,
    performanceTracking: performanceTrackingCardData,
    publishing: socialMediaPublishingCardData,
  },
  website: {
    status: websiteTrafficStatusCardData,
    userBehavior: userBehaviorCardData,
    trafficQuality: trafficQualityCardData,
    pagePerformance: pagePerformanceCardData,
    traffic: websiteTrafficCardData,
    conversionSignals: conversionSignalsCardData,
    seoInsights: seoInsightsCardData,
  },
  automation: {
    execution: automationExecutionCardData,
    workflows: workflowAutomationCardData,
    tasks: taskExecutionCardData,
    monitoring: systemMonitoringCardData,
  },
}

export function buildReportModel(period) {
  const spec = getPeriodSpec(period)
  const ctx = { scale: spec.scale, seedKey: spec.seedKey }
  const model = { spec }

  for (const [group, cards] of Object.entries(CARD_SOURCES)) {
    model[group] = {}
    for (const [name, data] of Object.entries(cards)) {
      model[group][name] = deriveNode(data, ctx, `${group}.${name}`)
    }
  }

  return model
}

// --- CSV export --------------------------------------------------------------

const PLATFORM_LABELS = { facebook: 'Facebook', linkedin: 'LinkedIn', instagram: 'Instagram', tiktok: 'TikTok', f: 'Facebook', in: 'LinkedIn', ig: 'Instagram' }

export function collectCsvRows(model) {
  const rows = []
  const push = (category, section, metric, value) => {
    if (metric != null && value != null && value !== '') {
      rows.push([category, section, String(metric), String(value)])
    }
  }

  const a = model.analytics
  a.analyticsReporting.metrics.forEach((m) => push('Analytics', 'Overview', m.label, m.value))
  a.performanceSummary.results.forEach((m) => push('Analytics', 'Campaign Results', m.label, m.value))
  push('Analytics', 'Sales Report', a.salesReport.growthLabel, a.salesReport.growthValue)
  a.salesReport.results.forEach((m) => push('Analytics', 'Sales Report', m.label, m.value))
  a.salesReport.sourceLegend.forEach((m) => push('Analytics', 'Revenue Source', m.label, m.value))
  a.portfolioAnalytics.summaryItems.forEach((m) => push('Analytics', 'Production Summary', m.label, m.value))
  push('Analytics', 'Production Summary', a.portfolioAnalytics.growthLabel, a.portfolioAnalytics.growthValue)
  push('Analytics', 'Lead Generation Target', 'Achievement', `${a.portfolioAnalytics.gauge.current}/${a.portfolioAnalytics.gauge.target}`)
  push('Analytics', 'Conversion Funnel', a.conversionFunnel.visitsLabel, a.conversionFunnel.visitsValue)
  a.conversionFunnel.stages.forEach((s) => push('Analytics', 'Conversion Funnel', s.label, s.percent))
  push('Analytics', 'Conversion Funnel', a.conversionFunnel.totalConversionLabel, a.conversionFunnel.totalConversionValue)
  push('Analytics', 'Campaign Performance', a.campaignPerformance.activeLabel, a.campaignPerformance.activeValue)
  a.campaignPerformance.campaigns.forEach((c) => push('Analytics', 'Campaign Performance', c.label, c.value))
  a.trafficSourceBreakdown.sources.forEach((s) => push('Analytics', 'Traffic Sources', s.label, `${s.percent} (${s.delta})`))

  const st = model.strategy
  push('Strategy', 'Active Strategy', st.strategyIntelligence.activeValue, st.strategyIntelligence.activePercent)
  push('Strategy', 'Expected Impact', st.strategyIntelligence.confidenceLabel, st.strategyIntelligence.confidenceValue)
  push('Strategy', 'Expected Impact', st.strategyIntelligence.opportunityLabel, st.strategyIntelligence.opportunityValue)
  st.growthStrategy.legend.forEach((m) => push('Strategy', 'Growth Strategy', m.label, m.value))
  st.growthStrategy.reasonItems.forEach((m) => push('Strategy', 'Growth Strategy Reasons', m.label, m.value))
  st.strategyIntelligence.reasonColumns.forEach((m) => push('Strategy', 'Strategy Impact', m.label, m.value))
  st.marketInsights.items.forEach((m) => push('Strategy', 'Rising Trends', m.label, m.metric))
  st.opportunityDetection.opportunities.forEach((m) => push('Strategy', 'Top Opportunities', m.label, m.metric))
  st.competitorTracking.competitors.forEach((c) => push('Strategy', 'Competitor Tracking', `${c.name} (${c.platform})`, c.delta))
  st.riskDetection.risks.forEach((r) => push('Strategy', 'Active Risks', `${r.title} — ${r.state}`, r.metric))

  const sa = model.sales
  sa.salesAndLeads.legend.forEach((m) => push('Sales', 'Lead Quality', m.label, m.value))
  sa.leadGeneration.sources.forEach((m) => push('Sales', 'Lead Sources', m.label, m.value))
  push('Sales', 'Lead Flow', sa.leadGeneration.flowLabel, sa.leadGeneration.flowValue)
  push('Sales', 'Lead Scoring', sa.leadScoring.scoredLabel, `${sa.leadScoring.scoredValue} (${sa.leadScoring.scoredDelta})`)
  push('Sales', 'Pipeline', sa.pipelineTracking.pipelineLabel, `${sa.pipelineTracking.pipelineValue} (${sa.pipelineTracking.pipelineDelta})`)
  push('Sales', 'Revenue Feedback', sa.revenueFeedback.responseLabel, sa.revenueFeedback.responseValue)
  sa.pipelineTracking.stages.forEach((m) => push('Sales', 'Pipeline Stages', m.label, m.value))
  push('Sales', 'Pipeline Stages', sa.pipelineTracking.winRateLabel, sa.pipelineTracking.winRateValue)
  sa.leadScoring.leads.forEach((l) => push('Sales', 'Top Scored Leads', `${l.name} (${l.intent})`, l.score))
  sa.revenueFeedback.sources.forEach((m) => push('Sales', 'Revenue by Source', m.label, m.value))

  const so = model.social
  push('Social Media', 'Current Activity', so.manager.currentActivity.name, so.manager.currentActivity.progress)
  so.manager.engagementCards.forEach((c) => push('Social Media', 'Engagement Breakdown', PLATFORM_LABELS[c.iconKey] ?? c.iconKey, c.value))
  push('Social Media', 'Engagement', so.manager.metrics.primary.label, so.manager.metrics.primary.value)
  push('Social Media', 'Engagement', so.manager.metrics.secondary.label, so.manager.metrics.secondary.value)
  so.strategy.reasonColumns.forEach((m) => push('Social Media', 'Content Type Breakdown', m.title, m.delta))
  so.performanceTracking.reasons.forEach((m) => push('Social Media', 'Performance Tracking', m.title, m.value))
  so.performanceTracking.performerRows.forEach((m) => push('Social Media', 'Top Performers', m.label, m.value))
  so.performanceTracking.platforms.forEach((m) => push('Social Media', 'Platform Performance', PLATFORM_LABELS[m.label] ?? m.label, m.value))
  so.strategy.stats.forEach((stat, index) => push('Social Media', 'Execution', `Stat ${index + 1}`, stat))
  push('Social Media', 'Content Production', so.publishing.currentBatch.name, `${so.publishing.currentBatch.completed}/${so.publishing.currentBatch.total}`)
  so.publishing.upcomingBatch.forEach((m) => push('Social Media', 'Upcoming Batch', m.label, m.value))

  const w = model.website
  w.status.legend.forEach((m) => push('Website', 'Traffic Quality', m.label, m.value))
  w.userBehavior.metrics.forEach((m) => push('Website', 'User Behavior', m.label, m.value))
  push('Website', 'Gauges', w.trafficQuality.gauge.label, w.trafficQuality.gauge.current)
  w.pagePerformance.gauges.forEach((g) => push('Website', 'Gauges', g.label, g.value))
  w.conversionSignals.metrics.forEach((m) => push('Website', 'Conversion Health', m.label, `${m.value} (${m.delta})`))
  w.conversionSignals.ladder.forEach((m) => push('Website', 'Intent Ladder', m.label, m.value))
  w.seoInsights.keywords.forEach((k) => push('Website', 'Keyword Opportunities', k.label, `${k.rank} (${k.delta})`))
  w.pagePerformance.pages.forEach((p) => push('Website', 'Page Performance', p.label, `${p.value} · ${p.tag}`))
  w.traffic.reasonMetrics.forEach((m) => push('Website', 'Traffic Overview', m.label, m.value))
  w.traffic.sourceMix.forEach((m) => push('Website', 'Source Mix', m.label, m.value))
  w.traffic.deviceLegend.forEach((m) => push('Website', 'Traffic Source Device', m.label, m.value))
  w.traffic.countries.forEach((m) => push('Website', 'Top Countries', m.label, m.value))
  w.userBehavior.userflow.forEach((m) => push('Website', 'Userflow', m.label, m.value))

  const au = model.automation
  push('Automation', 'System State', au.execution.stateLabel, au.execution.stateValue)
  push('Automation', 'System State', au.execution.gauge.sublabel ?? 'Workflow status', au.execution.gauge.label)
  au.execution.lanes.forEach((m) => push('Automation', 'Execution Lane', m.label, m.value))
  au.tasks.stats.forEach((m) => push('Automation', 'Task Queue', m.label, m.value))
  au.workflows.workflows.forEach((m) => push('Automation', 'Workflow Chains', `${m.label} — ${m.state}`, m.result))
  au.tasks.tasks.forEach((m) => push('Automation', 'Active Tasks', m.label, m.progress))
  au.monitoring.services.forEach((s) => push('Automation', 'Service Health', s.label, `${s.uptime} · ${s.latency}`))
  au.monitoring.summaryMetrics.forEach((m) => push('Automation', 'System Health', m.label, m.value))

  return rows
}

function filterCsvRows(rows, category) {
  return category === 'All' ? rows : rows.filter((row) => row[0] === category)
}

function csvEscape(value) {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function rowsToCsv(headers, rows) {
  // Leading BOM makes Excel detect UTF-8 correctly.
  const bom = String.fromCharCode(0xfeff)
  return bom + [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
}

export function buildReportCsv(model, { category = 'All' } = {}) {
  const rows = filterCsvRows(collectCsvRows(model), category)
  return rowsToCsv(['Category', 'Section', 'Metric', `Value (${model.spec.label})`], rows)
}

export function buildCompareCsv(modelA, modelB, { category = 'All' } = {}) {
  // Both models come from the same extraction path, so rows align 1:1.
  const rowsA = filterCsvRows(collectCsvRows(modelA), category)
  const rowsB = filterCsvRows(collectCsvRows(modelB), category)
  const rows = rowsA.map((row, index) => [row[0], row[1], row[2], row[3], rowsB[index]?.[3] ?? ''])
  return rowsToCsv(
    ['Category', 'Section', 'Metric', `Period A (${modelA.spec.label})`, `Period B (${modelB.spec.label})`],
    rows,
  )
}

export function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function csvFileName(prefix, category, spec) {
  const slug = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${prefix}-${slug(category)}-${slug(spec.label)}.csv`
}
