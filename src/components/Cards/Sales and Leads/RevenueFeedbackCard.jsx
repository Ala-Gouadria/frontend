import './RevenueFeedbackCard.css'
import './SalesandLeadsCardShared.css'
import { MiniLineChart } from '../../visuals-parts/MiniLineChart'
import { StripedBars } from '../../visuals-parts/StripedBars'
import { AiInsight, AiActionButton } from '../../visuals-parts/AiInsight'

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

export function RevenueFeedbackCard({ data = defaultData, className = '' }) {
  const d = { ...defaultData, ...data }

  return (
    <div className={classNames('analytics-card', 'revenue-feedback-card', className)}>

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