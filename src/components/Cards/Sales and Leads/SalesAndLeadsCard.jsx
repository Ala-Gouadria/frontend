import { useMemo } from 'react'
import './SalesAndLeadsCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { StageFlow } from '../../visuals-parts/StageFlow'
import { QualityBlocks } from '../../visuals-parts/QualityBlocks'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'
import { useCrmData } from '../../../hooks/useAnalyticsData'

const defaultData = {
  title: 'Sales and Leads',
  subtitle: 'Lead flow and revenue conversion',
  status: 'Active',
  revenueStatus: {
    label: 'Revenue Status',
    value: 'Sales Boosting',
    good: true,
  },
  mainProblem: {
    title: 'Main Problem',
    description: 'Following up with high-value proposal-stage deals',
    stages: ['Leads', 'Qualified', 'Proposal', 'Closed'],
    activeIndex: 2,
  },
  leadQuality: {
    label: 'Lead Quality',
    legend: [
      { tone: 'green', label: 'High', percent: '55%' },
      { tone: 'orange', label: 'Mid', percent: '30%' },
      { tone: 'red', label: 'Low', percent: '15%' },
    ],
    blocks: [
      { tone: 'green', count: 11 },
      { tone: 'orange', count: 6 },
      { tone: 'red', count: 4 },
    ],
  },
  aiInsight:
    'Strong signals from Traffic. Returning Users combined with conversion drop suggest retargeting will recover lost conversions.',
}

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

// Transform CRM API data to card format
function transformCrmData(apiData, mockData) {
  if (!apiData) return null

  // If API returned but no current data, show zeros
  if (!apiData.current) {
    return {
      ...mockData,
      title: 'Sales and Leads',
      subtitle: 'No data available',
      status: 'No Data',
      revenueStatus: {
        label: 'Pipeline Value',
        value: '$0',
        good: false,
      },
      mainProblem: {
        title: 'Pipeline Overview',
        description: '0 deals in pipeline, 0% win rate',
        stages: ['Leads', 'Qualified', 'Proposal', 'Closed'],
        activeIndex: 0,
      },
      leadQuality: {
        label: 'Lead Quality',
        legend: [
          { tone: 'green', label: 'High', percent: '0%' },
          { tone: 'orange', label: 'Mid', percent: '0%' },
          { tone: 'red', label: 'Low', percent: '0%' },
        ],
        blocks: [{ tone: 'gray', count: 20 }],
      },
      aiInsight: 'No CRM data available. Connect HubSpot to see real data.',
    }
  }

  const current = apiData.current
  const leadsChange = apiData.leadsChange || 0

  // Transform deals by stage to stage flow
  const dealsByStage = current.dealsByStage || {}
  const stages = Object.keys(dealsByStage)
  const totalDeals = Object.values(dealsByStage).reduce((sum, s) => sum + (s.count || 0), 0)

  // Determine active stage (stage with most deals)
  let activeIndex = 0
  let maxDeals = 0
  stages.forEach((stage, idx) => {
    if (dealsByStage[stage]?.count > maxDeals) {
      maxDeals = dealsByStage[stage].count
      activeIndex = idx
    }
  })

  // Transform leads by stage to quality blocks
  const leadsByStage = current.leadsByStage || {}
  const totalLeads = current.totalLeads || 1
  const stageOrder = ['subscriber', 'lead', 'marketingqualifiedlead', 'salesqualifiedlead', 'opportunity', 'customer']

  let highLeads = 0
  let midLeads = 0
  let lowLeads = 0

  Object.entries(leadsByStage).forEach(([stage, count]) => {
    const stageLower = stage.toLowerCase()
    if (['customer', 'opportunity', 'salesqualifiedlead'].some(s => stageLower.includes(s))) {
      highLeads += count
    } else if (['marketingqualifiedlead', 'lead'].some(s => stageLower.includes(s))) {
      midLeads += count
    } else {
      lowLeads += count
    }
  })

  const highPct = Math.round((highLeads / totalLeads) * 100)
  const midPct = Math.round((midLeads / totalLeads) * 100)
  const lowPct = 100 - highPct - midPct

  return {
    ...mockData,
    title: 'Sales and Leads',
    subtitle: 'Real-time data from HubSpot',
    status: current.totalDeals > 0 ? 'Active' : 'No Data',
    revenueStatus: {
      label: 'Pipeline Value',
      value: current.totalDealValue
        ? `$${Math.round(current.totalDealValue).toLocaleString()}`
        : 'No deals',
      good: (current.winRate || 0) > 20,
    },
    mainProblem: {
      title: 'Pipeline Overview',
      description: `${current.totalDeals || 0} deals in pipeline, ${current.winRate != null ? Number(current.winRate).toFixed(0) : 0}% win rate`,
      stages: stages.length > 0 ? stages.slice(0, 4) : mockData.mainProblem.stages,
      activeIndex: Math.min(activeIndex, 3),
    },
    leadQuality: {
      label: 'Lead Quality',
      legend: [
        { tone: 'green', label: 'High', percent: `${highPct}%` },
        { tone: 'orange', label: 'Mid', percent: `${midPct}%` },
        { tone: 'red', label: 'Low', percent: `${lowPct}%` },
      ],
      blocks: [
        { tone: 'green', count: Math.round(highPct / 5) || 1 },
        { tone: 'orange', count: Math.round(midPct / 5) || 1 },
        { tone: 'red', count: Math.round(lowPct / 5) || 1 },
      ],
    },
    aiInsight: current.totalLeads > 0
      ? `You have ${current.newLeads || 0} new leads this period. Lead volume is ${leadsChange >= 0 ? 'up' : 'down'} ${Math.abs(leadsChange).toFixed(0)}%. Focus on converting ${stages[activeIndex] || 'qualified'} stage deals.`
      : mockData.aiInsight,
  }
}

export function SalesAndLeadsCard({ data: propData, className = '', useRealData = true }) {
  const { data: apiData, loading, hasRealData } = useCrmData({ days: 30 })

  const d = useMemo(() => {
    if (propData) return { ...defaultData, ...propData }
    if (useRealData && apiData) {
      const transformed = transformCrmData(apiData, defaultData)
      if (transformed) return transformed
    }
    return defaultData
  }, [propData, useRealData, apiData])

  return (
    <div className={classNames('analytics-card', 'sales-and-leads-card', className)}>

      {/* ── Header ── */}
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{d.title}</h2>
          <p className="analytics-card__subtitle">{d.subtitle}</p>
        </div>
        <span className="analytics-card__status">{d.status}</span>
      </div>

      {/* ── Revenue Status ── */}
      <div className="analytics-card__row sales-and-leads-card__revenue-row">
        <div>
          <span className="analytics-card__label">{d.revenueStatus.label}</span>
          <div className="sales-and-leads-card__revenue-meta">
            <span className="sales-and-leads-card__revenue-arrow">↑</span>
            <strong className={classNames(
              'sales-and-leads-card__revenue-value',
              d.revenueStatus.good && 'sales-and-leads-card__revenue-value--good'
            )}>
              {d.revenueStatus.value}
            </strong>
          </div>
        </div>
        <MiniLineChart
          className="sales-and-leads-card__sparkline"
          tone="green"
          points="0,40 12,36 24,42 36,30 48,26 60,34 72,28 84,32 96,24 108,30 120,22 132,28 146,18 160,26 172,20"
          fillPoints="0,58 0,40 12,36 24,42 36,30 48,26 60,34 72,28 84,32 96,24 108,30 120,22 132,28 146,18 160,26 172,20 172,58"
        />
      </div>

      {/* ── Main Problem Panel ── */}
      <div className="analytics-card__panel sales-and-leads-card__problem-panel">
        <div className="analytics-card__panel-title">{d.mainProblem.title}</div>
        <div className="analytics-card__panel-body sales-and-leads-card__problem-body">
          <p className="sales-and-leads-card__problem-desc">{d.mainProblem.description}</p>
          <StageFlow
            stages={d.mainProblem.stages}
            activeIndex={d.mainProblem.activeIndex}
            className="sales-and-leads-card__stage-flow"
          />
        </div>
      </div>

      {/* ── Lead Quality ── */}
      <div className="sales-and-leads-card__quality">
        <p className="analytics-card__section-title">{d.leadQuality.label}</p>
        <h4 className="sales-and-leads-card__quality-heading">{d.leadQuality.label}</h4>

        {/* Legend */}
        <div className="sales-and-leads-card__quality-legend">
          {d.leadQuality.legend.map((item) => (
            <div key={item.tone} className="sales-and-leads-card__legend-item">
              <span className={classNames('sales-and-leads-card__legend-swatch', `sales-and-leads-card__legend-swatch--${item.tone}`)} />
              <span className="sales-and-leads-card__legend-label">
                {item.label} <strong>{item.percent}</strong>
              </span>
            </div>
          ))}
        </div>

        {/* Blocks */}
        <QualityBlocks
          blocks={d.leadQuality.blocks}
          className="sales-and-leads-card__blocks"
        />
      </div>

      {/* ── AI Insight ── */}
      <AiInsight title="AI Insight">{d.aiInsight}</AiInsight>

      {/* ── Action Button ── */}
      <AiActionButton />

    </div>
  )
}

export default SalesAndLeadsCard
