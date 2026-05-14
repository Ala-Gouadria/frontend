import './SocialMediaStuffsCardShared.css'
import './PerformanceTrackingCard.css'
import { MiniLineChart, DottedDataBars, StripedBars, AiInsight, AiActionButton } from '../../visuals-parts'

const defaultMetrics = [
  { label: 'Reach',  value: '+34k', tone: 'good',
    columns: [{label:'M',count:3},{label:'T',count:5},{label:'W',count:4},{label:'T',count:6},{label:'F',count:5},{label:'S',count:4}] },
  { label: 'Saves',  value: '-122', tone: 'bad',
    columns: [{label:'M',count:5},{label:'T',count:4},{label:'W',count:3},{label:'T',count:2},{label:'F',count:3},{label:'S',count:2}] },
  { label: 'CTR',    value: '2.8%', tone: 'neutral',
    columns: [{label:'M',count:3},{label:'T',count:4},{label:'W',count:3},{label:'T',count:5},{label:'F',count:4},{label:'S',count:3}] },
]

const defaultPerformers = [
  { label: 'Educational Posts', value: 65, tone: 'green' },
  { label: 'Proof-based posts',  value: 35, tone: 'green' },
  { label: 'Promotional posts',  value: 25, tone: 'green' },
]

const defaultPlatforms = [
  { id: 'fb', label: 'f', color: '#4267B2', bgColor: 'rgba(66,103,178,0.1)', delta: '+34%', deltaGood: true },
  { id: 'li', label: 'in', color: '#0077B5', bgColor: 'rgba(0,119,181,0.1)', delta: '+44%', deltaGood: true },
  { id: 'ig', label: '◎', color: '#E1306C', bgColor: 'rgba(225,48,108,0.1)', delta: '-12%', deltaGood: false },
]

export function PerformanceTrackingCard({
  status        = 'Active',
  trendLabel    = 'Sales Boosting',
  metrics       = defaultMetrics,
  topPerformers = defaultPerformers,
  platforms     = defaultPlatforms,
  aiText        = 'Educational and proof-based posts are driving the strongest engagement, while promotional content is underperforming',
  className     = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Performance Tracking</h2>
          <p className="analytics-card__subtitle">Live post performance summary</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Overall trend</p>
        <div className="pt-card__trend-row">
          <span className="pt-card__trend-arrow">↑</span>
          <span className="pt-card__trend-label">{trendLabel}</span>
        </div>
        <MiniLineChart
          points="0,46 20,42 40,44 60,36 80,38 100,32 120,34 140,28 160,24 172,20"
          fillPoints="0,58 0,46 20,42 40,44 60,36 80,38 100,32 120,34 140,28 160,24 172,20 172,58"
          tone="green"
        />
      </div>

      {/* Metrics panel */}
      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {metrics.map(m => (
              <div key={m.label} className="analytics-card__mini-stat">
                <span>{m.label}</span>
                <strong className={m.tone === 'bad' ? 'pt-card__bad' : m.tone === 'good' ? 'pt-card__good' : 'pt-card__neutral'}>
                  {m.value}
                </strong>
              </div>
            ))}
          </div>
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {metrics.map(m => (
              <DottedDataBars
                key={m.label}
                columns={m.columns}
                tone={m.tone === 'bad' ? 'red' : 'green'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div>
        <p className="analytics-card__section-title">Top performers</p>
        <div className="pt-card__performers">
          {topPerformers.map(p => (
            <div key={p.label} className="pt-card__performer-row">
              <div className="analytics-card__row" style={{ marginBottom: 4 }}>
                <span className="pt-card__performer-label">{p.label}</span>
                <span className="pt-card__performer-val">{p.value}%</span>
              </div>
              <StripedBars value={p.value} tone={p.tone} />
            </div>
          ))}
        </div>
      </div>

      {/* Platform performance */}
      <div>
        <p className="analytics-card__section-title">Platform Performance</p>
        <div className="pt-card__platforms">
          {platforms.map(p => (
            <span key={p.id} className="pt-card__platform-badge" style={{ '--p-color': p.color, '--p-bg': p.bgColor }}>
              <span className="pt-card__platform-icon">{p.label}</span>
              <span className={`pt-card__platform-delta ${p.deltaGood ? 'pt-card__good' : 'pt-card__bad'}`}>{p.delta}</span>
            </span>
          ))}
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default PerformanceTrackingCard
