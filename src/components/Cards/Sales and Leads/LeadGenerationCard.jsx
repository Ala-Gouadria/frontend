import './LeadGenerationCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { DottedDataBars } from '../../visuals-parts/DottedDataBars'
import { ProgressBars } from '../../visuals-parts/ProgressBars'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'

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

export function LeadGenerationCard({ data = defaultData, className = '' }) {
  const d = { ...defaultData, ...data }

  return (
    <div className={classNames('analytics-card', 'lead-generation-card', className)}>

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