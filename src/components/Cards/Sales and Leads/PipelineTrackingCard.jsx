import './PipelineTrackingCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'

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
    { label: 'Closed',     value: 10, tone: 'bad'  },
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

export function PipelineTrackingCard({ data = defaultData, className = '' }) {
  const d = { ...defaultData, ...data }

  return (
    <div className={classNames('analytics-card', 'pipeline-tracking-card', className)}>

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