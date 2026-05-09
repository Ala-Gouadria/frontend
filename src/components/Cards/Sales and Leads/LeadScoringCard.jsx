import './LeadScoringCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { StripedBars } from '../../visuals-parts/StripedBars'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'

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

export function LeadScoringCard({ data = defaultData, className = '' }) {
  const d = { ...defaultData, ...data }

  return (
    <div className={classNames('analytics-card', 'lead-scoring-card', className)}>

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
