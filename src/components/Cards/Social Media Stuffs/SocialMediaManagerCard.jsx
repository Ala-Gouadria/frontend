import './SocialMediaStuffsCardShared.css'
import './SocialMediaManagerCard.css'
import { MiniLineChart, DottedDataBars, AiInsight, AiActionButton } from '../../visuals-parts'

const defaultEngagement = [
  {
    id: 'fb',  label: 'f',  color: '#4267B2', bgColor: 'rgba(66,103,178,0.08)',
    delta: '+32%',
    points: '0,44 20,40 40,42 60,34 80,36 100,30 120,32 140,28 160,26 172,24',
    fillPoints: '0,58 0,44 20,40 40,42 60,34 80,36 100,30 120,32 140,28 160,26 172,24 172,58',
  },
  {
    id: 'li',  label: 'in', color: '#0077B5', bgColor: 'rgba(0,119,181,0.08)',
    delta: '+32%',
    points: '0,42 20,44 40,38 60,40 80,34 100,38 120,32 140,36 160,30 172,28',
    fillPoints: '0,58 0,42 20,44 40,38 60,40 80,34 100,38 120,32 140,36 160,30 172,28 172,58',
  },
  {
    id: 'ig',  label: '◎',  color: '#E1306C', bgColor: 'rgba(225,48,108,0.08)',
    delta: '+24%',
    points: '0,38 20,42 40,36 60,44 80,38 100,42 120,36 140,40 160,34 172,36',
    fillPoints: '0,58 0,38 20,42 40,36 60,44 80,38 100,42 120,36 140,40 160,34 172,36 172,58',
  },
]

export function SocialMediaManagerCard({
  status           = 'Active',
  currentActivity  = 'Running Instagram Campaign',
  activityProgress = 75,
  engagement       = defaultEngagement,
  crt              = '3.2%',
  share            = '+9%',
  aiText           = 'Instagram is driving the strongest growth today, while LinkedIn needs attention.',
  className        = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Social Media Manager</h2>
          <p className="analytics-card__subtitle">Content, publishing, and engagement</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current Activity</p>
        <div className="smm-card__activity-bar">
          <span className="smp-card__batch-dot" />
          <span className="smm-card__activity-label">{currentActivity}</span>
          <span className="smm-card__activity-pct">{activityProgress}%</span>
        </div>
      </div>

      <div>
        <p className="analytics-card__section-title">Engagement Breakdown</p>
        <div className="smm-card__engagement-grid">
          {engagement.map(e => (
            <div key={e.id} className="smm-card__platform-box" style={{ '--platform-bg': e.bgColor, '--platform-color': e.color }}>
              <div className="smm-card__platform-top">
                <span className="smm-card__platform-icon">{e.label}</span>
                <span className="smm-card__platform-delta">{e.delta}</span>
              </div>
              <MiniLineChart
                points={e.points}
                fillPoints={e.fillPoints}
                tone={e.id === 'ig' ? 'purple' : 'blue'}
                className="smm-card__mini-chart"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-card__panel-grid">
        <div>
          <p className="analytics-card__section-title">CRT</p>
          <strong className="smm-card__metric-val">{crt}</strong>
          <DottedDataBars
            columns={[
              {label:'M',count:2},{label:'T',count:4},{label:'W',count:3},
              {label:'T',count:5},{label:'F',count:4},{label:'S',count:3},
            ]}
            tone="green"
          />
        </div>
        <div>
          <p className="analytics-card__section-title">Share</p>
          <strong className="smm-card__metric-val smm-card__metric-val--good">{share}</strong>
          <MiniLineChart
            points="0,44 20,40 40,36 60,42 80,34 100,30 120,32 140,26 160,22 172,18"
            fillPoints="0,58 0,44 20,40 40,36 60,42 80,34 100,30 120,32 140,26 160,22 172,18 172,58"
            tone="green"
            className="smm-card__mini-chart"
          />
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default SocialMediaManagerCard