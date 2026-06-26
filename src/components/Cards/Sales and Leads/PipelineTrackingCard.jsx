import { useMemo } from 'react'
import './PipelineTrackingCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'
import { usePipelineData } from '../../../hooks/useAnalyticsData'

const defaultData = {
  title: 'Pipeline Tracking',
  subtitle: 'Deal flow across sales stages',
  status: 'Active',
  pipeline: {
    label: 'Open pipeline',
    value: '94 active deals',
    delta: '+12% this week',
    good: true,
  },
  stages: [
    { label: 'New Deals', value: 45, tone: 'good' },
    { label: 'Qualified',  value: 28, tone: 'good' },
    { label: 'Proposal',   value: 21, tone: 'good' },
    { label: 'Stuck',      value: 11, tone: 'bad'  },
    { label: 'Closed',     value: 10, tone: 'good' },
  ],
  winRate: {
    label: 'Win Rate',
    value: '37%',
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

  // If API returned but no data, show zeros
  if (Object.keys(apiData).length === 0) {
    return {
      ...mockData,
      title: 'Pipeline Tracking',
      subtitle: 'No data available',
      status: 'No Data',
      pipeline: {
        label: 'Open pipeline',
        value: '0 active deals',
        delta: '0 won',
        good: true,
      },
      stages: [
        { label: 'New Deals', value: 0, tone: 'good' },
        { label: 'Qualified', value: 0, tone: 'good' },
        { label: 'Proposal', value: 0, tone: 'good' },
        { label: 'Stuck', value: 0, tone: 'bad' },
        { label: 'Closed', value: 0, tone: 'good' },
      ],
      winRate: { label: 'Win Rate', value: '0%' },
      aiInsight: 'No pipeline data available. Add deals to see pipeline tracking.',
    }
  }

  // Pipeline data is an object with stage names as keys
  const stages = Object.entries(apiData)
    .filter(([stage]) => !['won', 'lost'].includes(stage.toLowerCase()))
    .map(([stage, data]) => {
      const stageName = stage.charAt(0).toUpperCase() + stage.slice(1)
      return {
        label: stageName,
        value: data.count || 0,
        tone: stage.toLowerCase() === 'stuck' ? 'bad' : 'good',
      }
    })

  // Calculate total active deals
  const totalActive = stages.reduce((sum, s) => sum + s.value, 0)

  // Calculate win rate if we have won/lost data
  const wonData = apiData.won || { count: 0 }
  const lostData = apiData.lost || { count: 0 }
  const totalClosed = wonData.count + lostData.count
  const winRate = totalClosed > 0 ? (wonData.count / totalClosed) * 100 : 0

  return {
    ...mockData,
    title: 'Pipeline Tracking',
    subtitle: 'Real-time deal flow across sales stages',
    status: 'Live',
    pipeline: {
      label: 'Open pipeline',
      value: `${totalActive} active deals`,
      delta: wonData.count > 0 ? `${wonData.count} won` : '+0% this week',
      good: true,
    },
    stages: stages.length > 0 ? stages : mockData.stages,
    winRate: {
      label: 'Win Rate',
      value: `${Math.round(winRate)}%`,
    },
    aiInsight: stages.length > 0
      ? `${totalActive} active deals in pipeline. Win rate: ${Math.round(winRate)}%. Focus on moving ${stages.find(s => s.tone === 'bad')?.label || 'stuck'} deals forward.`
      : mockData.aiInsight,
  }
}

export function PipelineTrackingCard({ data: propData, className = '', useRealData = true }) {
  const { data: apiData, loading, hasRealData } = usePipelineData()

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
    <div className={classNames('analytics-card', 'pipeline-tracking-card', className, loading && 'loading')}>

      {/* ── Header ── */}
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{d.title}</h2>
          <p className="analytics-card__subtitle">{d.subtitle}</p>
        </div>
        <span className="analytics-card__status">{d.status}</span>
      </div>

      {/* ── Open Pipeline ── */}
      <div className="analytics-card__row pipeline-tracking-card__pipeline-row">
        <div>
          <span className="analytics-card__label">{d.pipeline.label}</span>
          <div className="pipeline-tracking-card__pipeline-meta">
            <strong className="analytics-card__value analytics-card__value--good">
              {d.pipeline.value}
            </strong>
            <span className="pipeline-tracking-card__delta">{d.pipeline.delta}</span>
          </div>
        </div>
        <MiniLineChart
          className="pipeline-tracking-card__sparkline"
          tone="green"
          points="0,40 12,36 24,42 36,30 48,34 60,26 72,32 84,28 96,34 108,24 120,30 132,26 146,32 160,22 172,18"
          fillPoints="0,58 0,40 12,36 24,42 36,30 48,34 60,26 72,32 84,28 96,34 108,24 120,30 132,26 146,32 160,22 172,18 172,58"
        />
      </div>

      {/* ── Stage Rows ── */}
      <div className="pipeline-tracking-card__stages">
        {d.stages.map((stage) => (
          <div key={stage.label} className="pipeline-tracking-card__stage-row">
            <span className="pipeline-tracking-card__stage-label">{stage.label}</span>
            <strong className={classNames(
              'pipeline-tracking-card__stage-value',
              stage.tone === 'bad'
                ? 'pipeline-tracking-card__stage-value--bad'
                : 'pipeline-tracking-card__stage-value--good'
            )}>
              {stage.value}
            </strong>
          </div>
        ))}
      </div>

      {/* ── Win Rate + Full-width Chart ── */}
      <div className="pipeline-tracking-card__winrate-section">
        <div className="pipeline-tracking-card__winrate-head">
          <span className="pipeline-tracking-card__winrate-label">{d.winRate.label}</span>
          <strong className="pipeline-tracking-card__winrate-value">{d.winRate.value}</strong>
        </div>
        <div className="pipeline-tracking-card__winrate-chart-wrap">
          <MiniLineChart
            tone="green"
            points="0,48 12,44 24,50 36,40 48,44 60,36 72,42 84,38 96,44 108,34 120,40 132,36 146,42 160,32 172,28"
            fillPoints="0,58 0,48 12,44 24,50 36,40 48,44 60,36 72,42 84,38 96,44 108,34 120,40 132,36 146,42 160,32 172,28 172,58"
          />
        </div>
      </div>

      {/* ── AI Insight ── */}
      <AiInsight title="AI Insight">{d.aiInsight}</AiInsight>

      {/* ── Action Button ── */}
      <AiActionButton />

    </div>
  )
}

export default PipelineTrackingCard
