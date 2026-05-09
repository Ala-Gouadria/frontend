import './SalesAndLeadsCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { StageFlow } from '../../visuals-parts/StageFlow'
import { QualityBlocks } from '../../visuals-parts/QualityBlocks'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'

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

export function SalesAndLeadsCard({ data = defaultData, className = '' }) {
  const d = { ...defaultData, ...data }

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
