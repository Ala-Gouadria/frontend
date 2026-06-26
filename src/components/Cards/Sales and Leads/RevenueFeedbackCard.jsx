import { useMemo } from 'react'
import './RevenueFeedbackCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { StripedBars } from '../../visuals-parts/StripedBars'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'
import { useRevenueData } from '../../../hooks/useAnalyticsData'

const defaultData = {
  title: 'Revenue Feedback',
  subtitle: 'Revenue response across channels and offers',
  status: 'Active',
  revenueResponse: {
    label: 'Revenue response',
    delta: '+16% this week',
    good: true,
  },
  sources: [
    { label: 'Instagram', value: 55 },
    { label: 'Website',   value: 35 },
    { label: 'Email',     value: 25 },
  ],
  aiInsight:
    'High-scoring leads are showing strong buying intent through pricing page visits and booking actions. Prioritize outreach to high-score leads within the next 24 hours.',
}

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

// Transform revenue API data to card format
function transformRevenueData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Revenue Feedback',
      subtitle: 'No data available',
      status: 'No Data',
      revenueResponse: {
        label: 'Revenue response',
        delta: '+0% this week',
        good: false,
      },
      sources: [
        { label: 'No data', value: 0 },
      ],
      aiInsight: 'No revenue data available. Connect your e-commerce platform to see real data.',
    }
  }

  const current = apiData.current
  const revenueChange = apiData.revenueChange || 0

  // Transform revenue by source
  const revenueBySource = current.revenueBySource || {}
  const totalRevenue = current.totalRevenue || 1
  const sources = Object.entries(revenueBySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([source, amount]) => ({
      label: source,
      value: Math.round((amount / totalRevenue) * 100),
    }))

  return {
    ...mockData,
    title: 'Revenue Feedback',
    subtitle: 'Real-time revenue data',
    status: 'Live',
    revenueResponse: {
      label: 'Revenue response',
      delta: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}% this period`,
      good: revenueChange >= 0,
    },
    sources: sources.length > 0 ? sources : mockData.sources,
    aiInsight: current.totalRevenue > 0
      ? `Total revenue: $${Math.round(current.totalRevenue).toLocaleString()}. Revenue is ${revenueChange >= 0 ? 'up' : 'down'} ${Math.abs(revenueChange).toFixed(0)}% from last period.`
      : mockData.aiInsight,
  }
}

export function RevenueFeedbackCard({ data: propData, className = '', useRealData = true }) {
  const { data: apiData, loading } = useRevenueData({ days: 30 })

  const d = useMemo(() => {
    if (propData) return { ...defaultData, ...propData }
    if (useRealData && apiData) {
      const transformed = transformRevenueData(apiData, defaultData)
      if (transformed) return transformed
    }
    return defaultData
  }, [propData, useRealData, apiData])

  return (
    <div className={classNames('analytics-card', 'revenue-feedback-card', className, loading && 'loading')}>

      {/* ── Header ── */}
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{d.title}</h2>
          <p className="analytics-card__subtitle">{d.subtitle}</p>
        </div>
        <span className="analytics-card__status">{d.status}</span>
      </div>

      {/* ── Revenue Response ── */}
      <div className="analytics-card__row revenue-feedback-card__response-row">
        <div>
          <span className="analytics-card__label">{d.revenueResponse.label}</span>
          <strong className={classNames(
            'analytics-card__value',
            d.revenueResponse.good ? 'analytics-card__value--good' : 'analytics-card__value--bad'
          )}>
            {d.revenueResponse.delta}
          </strong>
        </div>
        <MiniLineChart
          className="revenue-feedback-card__sparkline"
          tone="green"
          points="0,40 12,36 24,42 36,30 48,34 60,26 72,32 84,28 96,34 108,24 120,30 132,26 146,32 160,22 172,18"
          fillPoints="0,58 0,40 12,36 24,42 36,30 48,34 60,26 72,32 84,28 96,34 108,24 120,30 132,26 146,32 160,22 172,18 172,58"
        />
      </div>

      {/* ── Revenue by Source ── */}
      <div className="revenue-feedback-card__sources">
        <p className="analytics-card__section-title">Revenue by source</p>
        <div className="revenue-feedback-card__source-list">
          {d.sources.map((source) => (
            <div key={source.label} className="revenue-feedback-card__source-item">
              <div className="revenue-feedback-card__source-head">
                <span className="revenue-feedback-card__source-label">{source.label}</span>
                <span className="revenue-feedback-card__source-pct">{source.value}%</span>
              </div>
              <StripedBars
                value={source.value}
                tone="green"
                className="revenue-feedback-card__bar"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Insight ── */}
      <AiInsight title="AI Insight">{d.aiInsight}</AiInsight>

      {/* ── Action Button ── */}
      <AiActionButton />

    </div>
  )
}

export default RevenueFeedbackCard
