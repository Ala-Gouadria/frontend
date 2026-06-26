import { useMemo } from 'react'
import './LeadGenerationCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { DottedDataBars } from '../../visuals-parts/DottedDataBars'
import { ProgressBars } from '../../visuals-parts/ProgressBars'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'
import { useCrmData } from '../../../hooks/useAnalyticsData'

const defaultData = {
  title: 'Lead Generation',
  subtitle: 'Lead flow and acquisition sources',
  status: 'Active',
  leadFlow: {
    label: 'Lead flow',
    delta: '+21%',
    deltaGood: true,
  },
  reasons: [
    {
      label: 'Instagram',
      value: 4322,
      columns: [
        { label: 'Mon', count: 4 },
        { label: 'Tue', count: 6 },
        { label: 'Wed', count: 3 },
        { label: 'Thu', count: 5 },
        { label: 'Fri', count: 4 },
        { label: 'Sat', count: 6 },
      ],
    },
    {
      label: 'Website',
      value: 3652,
      columns: [
        { label: 'Mon', count: 3 },
        { label: 'Tue', count: 5 },
        { label: 'Wed', count: 6 },
        { label: 'Thu', count: 4 },
        { label: 'Fri', count: 5 },
        { label: 'Sat', count: 4 },
      ],
    },
    {
      label: 'Ads',
      value: 2354,
      columns: [
        { label: 'Mon', count: 5 },
        { label: 'Tue', count: 3 },
        { label: 'Wed', count: 4 },
        { label: 'Thu', count: 6 },
        { label: 'Fri', count: 3 },
        { label: 'Sat', count: 5 },
      ],
    },
  ],
  topSource: {
    label: 'Top Source',
    source: 'Website',
    conversion: '23% Conversion',
    progressLabel: 'Lead',
    progressValue: 35,
  },
  aiInsight: 'Strong signals from Traffic. Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
}

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Lead Generation',
      subtitle: 'No data available',
      status: 'No Data',
      leadFlow: {
        label: 'Lead flow',
        delta: '+0%',
        deltaGood: true,
      },
      reasons: [
        { label: 'No data', value: 0, columns: mockData.reasons[0].columns },
      ],
      topSource: {
        label: 'Top Source',
        source: 'No data',
        conversion: '0% of total',
        progressLabel: 'Lead',
        progressValue: 0,
      },
      aiInsight: 'No lead generation data available. Connect your CRM to see lead sources.',
    }
  }

  const current = apiData.current
  const leadsChange = apiData.leadsChange || 0

  // Transform leadsBySource to reasons format
  const leadsBySource = current.leadsBySource || {}
  const reasons = Object.entries(leadsBySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([source, count]) => ({
      label: source,
      value: count,
      columns: mockData.reasons[0].columns, // Keep mock columns for now (daily breakdown not in API)
    }))

  // Find top source
  const topSourceEntry = reasons[0] || { label: 'Website', value: 0 }
  const totalLeads = Object.values(leadsBySource).reduce((sum, c) => sum + c, 0)
  const topSourcePct = totalLeads > 0 ? (topSourceEntry.value / totalLeads) * 100 : 0

  return {
    ...mockData,
    title: 'Lead Generation',
    subtitle: 'Real-time lead flow and acquisition sources',
    status: 'Live',
    leadFlow: {
      label: 'Lead flow',
      delta: `${leadsChange >= 0 ? '+' : ''}${leadsChange.toFixed(0)}%`,
      deltaGood: leadsChange >= 0,
    },
    reasons: reasons.length > 0 ? reasons : mockData.reasons,
    topSource: {
      label: 'Top Source',
      source: topSourceEntry.label,
      conversion: `${Math.round(topSourcePct)}% of total`,
      progressLabel: 'Lead',
      progressValue: Math.round(topSourcePct),
    },
    aiInsight: reasons.length > 0
      ? `${topSourceEntry.label} is your top lead source with ${topSourceEntry.value} leads (${Math.round(topSourcePct)}% of total). Total leads: ${current.totalLeads?.toLocaleString() || 0}.`
      : mockData.aiInsight,
  }
}

export function LeadGenerationCard({ data: propData, className = '', useRealData = true }) {
  const { data: apiData, loading, hasRealData } = useCrmData({ days: 30 })

  const d = useMemo(() => {
    if (propData) return { ...defaultData, ...propData }
    // Show real data even if it's 0 (only fallback to mock if API fails)
    if (useRealData && apiData) {
      const transformed = transformApiData(apiData, defaultData)
      if (transformed) return transformed
    }
    return defaultData
  }, [propData, useRealData, apiData])

  return (
    <div className={classNames('analytics-card', 'lead-generation-card', className, loading && 'loading')}>

      {/* ── Header ── */}
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{d.title}</h2>
          <p className="analytics-card__subtitle">{d.subtitle}</p>
        </div>
        <span className="analytics-card__status">{d.status}</span>
      </div>

      {/* ── Lead Flow ── */}
      <div className="analytics-card__row lead-generation-card__flow-row">
        <div>
          <span className="analytics-card__label">{d.leadFlow.label}</span>
          <strong className={classNames(
            'analytics-card__value',
            d.leadFlow.deltaGood ? 'analytics-card__value--good' : 'analytics-card__value--bad'
          )}>
            {d.leadFlow.delta}
          </strong>
        </div>
        <MiniLineChart
          className="lead-generation-card__flow-chart"
          tone="green"
          points="0,44 12,38 24,46 36,32 48,28 60,38 72,30 84,36 96,28 108,34 120,26 132,32 146,22 160,30 172,24"
          fillPoints="0,58 0,44 12,38 24,46 36,32 48,28 60,38 72,30 84,36 96,28 108,34 120,26 132,32 146,22 160,30 172,24 172,58"
        />
      </div>

      {/* ── Reasons Panel ── */}
      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <div className="analytics-card__panel-grid--three lead-generation-card__reasons-grid">
            {d.reasons.map((reason) => (
              <div key={reason.label} className="lead-generation-card__reason-col">
                <span className="lead-generation-card__reason-label">{reason.label}</span>
                <strong className="lead-generation-card__reason-value">
                  {reason.value.toLocaleString()}
                </strong>
                <DottedDataBars
                  columns={reason.columns}
                  tone="green"
                  className="lead-generation-card__reason-bars"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Source ── */}
      <div className="lead-generation-card__source">
        <p className="analytics-card__section-title">{d.topSource.label}</p>
        <div className="analytics-card__source-head">
          <strong className="lead-generation-card__source-name">{d.topSource.source}</strong>
          <span className="analytics-card__source-delta--good lead-generation-card__source-conversion">
            {d.topSource.conversion}
          </span>
        </div>
        <ProgressBars
          value={d.topSource.progressValue}
          label={d.topSource.progressLabel}
          tone="green"
          cap={true}
          className="lead-generation-card__progress"
        />
      </div>

      {/* ── AI Insight ── */}
      <AiInsight title="AI Insight">{d.aiInsight}</AiInsight>

      {/* ── Action Button ── */}
      <AiActionButton />

    </div>
  )
}

export default LeadGenerationCard
