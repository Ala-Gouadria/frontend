import { useMemo } from 'react'
import './LeadScoringCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { StripedBars } from '../../visuals-parts/StripedBars'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'
import { useLeadsData } from '../../../hooks/useAnalyticsData'

const defaultData = {
  title: 'Lead Scoring',
  subtitle: 'Lead value and intent ranking',
  status: 'Active',
  scoredLeads: {
    label: 'Scored leads',
    value: '126 active leads',
    delta: '+12% this week',
  },
  leads: [
    {
      name: 'John Smith',
      description: 'Booked a call + visited pricing page',
      intent: 'High intent',
      score: 91,
    },
    {
      name: 'Emma Carter',
      description: 'Downloaded guide + opened emails',
      intent: 'High intent',
      score: 83,
    },
    {
      name: 'Alex Ray',
      description: 'Visited once, no follow-up action',
      intent: 'Mid Intent',
      score: 51,
    },
  ],
  topSource: {
    label: 'Top Source',
    source: 'Website',
    conversion: '23% Conversion',
    progressLabel: 'Lead',
    progressEndLabel: '35%',
    progressValue: 35,
  },
  aiInsight:
    'High-scoring leads are showing strong buying intent through pricing page visits and booking actions. Prioritize outreach to high-score leads within the next 24 hours.',
}

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

// Transform real API data to card data format
function transformApiData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no leads, show zeros
  if (!apiData.data || apiData.data.length === 0) {
    return {
      ...mockData,
      title: 'Lead Scoring',
      subtitle: 'No data available',
      status: 'No Data',
      scoredLeads: {
        label: 'Scored leads',
        value: '0 active leads',
        delta: '0 total',
      },
      leads: [{ name: 'No leads', description: 'Connect CRM to see leads', intent: 'N/A', score: 0 }],
      topSource: {
        label: 'Top Source',
        source: 'No data',
        conversion: '0% Conversion',
        progressLabel: 'Lead',
        progressEndLabel: '0 leads',
        progressValue: 0,
      },
      aiInsight: 'No lead data available. Connect your CRM or add leads to see scoring insights.',
    }
  }

  const leads = apiData.data.filter(l => l.score && l.score > 0)

  // Count active leads (not won/lost)
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.stage))

  // Get top 3 by score
  const topLeads = [...leads]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3)
    .map(lead => {
      const intent = (lead.score || 0) >= 70 ? 'High intent' : (lead.score || 0) >= 40 ? 'Mid Intent' : 'Low intent'
      return {
        name: lead.name,
        description: lead.notes || `${lead.stage} stage lead from ${lead.source || 'unknown source'}`,
        intent,
        score: lead.score || 0,
      }
    })

  // Group by source to find top source
  const sourceGroups = {}
  leads.forEach(lead => {
    const source = lead.source || 'Unknown'
    if (!sourceGroups[source]) {
      sourceGroups[source] = { count: 0, won: 0 }
    }
    sourceGroups[source].count++
    if (lead.stage === 'won') {
      sourceGroups[source].won++
    }
  })

  const topSource = Object.entries(sourceGroups)
    .map(([source, stats]) => ({
      source,
      count: stats.count,
      conversion: stats.count > 0 ? (stats.won / stats.count) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)[0] || { source: 'Website', conversion: 0, count: 0 }

  return {
    ...mockData,
    title: 'Lead Scoring',
    subtitle: 'Real-time lead value and intent ranking',
    status: 'Live',
    scoredLeads: {
      label: 'Scored leads',
      value: `${activeLeads.length} active leads`,
      delta: apiData.total ? `${apiData.total} total` : '+0% this week',
    },
    leads: topLeads.length > 0 ? topLeads : mockData.leads,
    topSource: {
      label: 'Top Source',
      source: topSource.source,
      conversion: `${Math.round(topSource.conversion)}% Conversion`,
      progressLabel: 'Lead',
      progressEndLabel: `${topSource.count} leads`,
      progressValue: Math.min(100, topSource.conversion),
    },
    aiInsight: topLeads.length > 0
      ? `${topLeads.length} high-scoring leads identified. Top lead: ${topLeads[0].name} (${topLeads[0].score}%). Focus on ${topSource.source} channel (${Math.round(topSource.conversion)}% conversion).`
      : mockData.aiInsight,
  }
}

export function LeadScoringCard({ data: propData, className = '', useRealData = true }) {
  const { data: apiData, loading, hasRealData } = useLeadsData({
    sort: '-score',
    pageSize: 50
  })

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
    <div className={classNames('analytics-card', 'lead-scoring-card', className, loading && 'loading')}>

      {/* ── Header ── */}
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{d.title}</h2>
          <p className="analytics-card__subtitle">{d.subtitle}</p>
        </div>
        <span className="analytics-card__status">{d.status}</span>
      </div>

      {/* ── Scored Leads ── */}
      <div className="analytics-card__row lead-scoring-card__scored-row">
        <div>
          <span className="analytics-card__label">{d.scoredLeads.label}</span>
          <div className="lead-scoring-card__scored-meta">
            <strong className="analytics-card__value analytics-card__value--good">
              {d.scoredLeads.value}
            </strong>
            <span className="lead-scoring-card__delta">{d.scoredLeads.delta}</span>
          </div>
        </div>
        <MiniLineChart
          className="lead-scoring-card__sparkline"
          tone="green"
          points="0,44 12,38 24,46 36,32 48,28 60,38 72,30 84,36 96,28 108,34 120,26 132,32 146,22 160,30 172,24"
          fillPoints="0,58 0,44 12,38 24,46 36,32 48,28 60,38 72,30 84,36 96,28 108,34 120,26 132,32 146,22 160,30 172,24 172,58"
        />
      </div>

      {/* ── Lead Rows ── */}
      <div className="lead-scoring-card__leads">
        {d.leads.map((lead) => (
          <div key={lead.name} className="lead-scoring-card__lead-row">
            <div className="lead-scoring-card__lead-left">
              <strong className="lead-scoring-card__lead-name">{lead.name}</strong>
              <span className="lead-scoring-card__lead-desc">{lead.description}</span>
            </div>
            <div className="lead-scoring-card__lead-right">
              <span className="lead-scoring-card__intent">{lead.intent}</span>
              <strong className={classNames(
                'lead-scoring-card__score',
                lead.score >= 80 ? 'lead-scoring-card__score--high' : 'lead-scoring-card__score--mid'
              )}>
                {lead.score}%
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* ── Top Source ── */}
      <div className="lead-scoring-card__source">
        <p className="analytics-card__section-title">{d.topSource.label}</p>
        <div className="lead-scoring-card__source-head">
          <strong className="lead-scoring-card__source-name">{d.topSource.source}</strong>
          <span className="lead-scoring-card__source-conversion">{d.topSource.conversion}</span>
        </div>
        <StripedBars
          value={d.topSource.progressValue}
          label={d.topSource.progressLabel}
          endLabel={d.topSource.progressEndLabel}
          tone="green"
          className="lead-scoring-card__progress"
        />
      </div>

      {/* ── AI Insight ── */}
      <AiInsight title="AI Insight">{d.aiInsight}</AiInsight>

      {/* ── Action Button ── */}
      <AiActionButton />

    </div>
  )
}

export default LeadScoringCard
