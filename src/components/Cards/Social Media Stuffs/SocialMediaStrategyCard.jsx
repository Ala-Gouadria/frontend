import './SocialMediaStuffsCardShared.css'
import './SocialMediaStrategyCard.css'
import { DottedDataBars, AiInsight, AiActionButton } from '../../visuals-parts'

const defaultReasons = [
  {
    label: 'Educational Posts',
    delta: '+34%',
    tone: 'good',
    columns: [{label:'M',count:4},{label:'T',count:6},{label:'W',count:5},{label:'T',count:7},{label:'F',count:6}],
  },
  {
    label: 'Promotional Posts',
    delta: '-12%',
    tone: 'bad',
    columns: [{label:'M',count:5},{label:'T',count:4},{label:'W',count:3},{label:'T',count:2},{label:'F',count:3}],
  },
  {
    label: 'Life Hack Posts',
    delta: '+20%',
    tone: 'good',
    columns: [{label:'M',count:3},{label:'T',count:5},{label:'W',count:4},{label:'T',count:6},{label:'F',count:5}],
  },
]

const defaultPlans = [
  'Create 5 educational posts explaining key concepts for the target audience',
  'Update captions and hooks on upcoming posts to improve reach and retention',
  'Prepare 2 engagement-driven posts with questions or prompts to increase comments',
]

export function SocialMediaStrategyCard({
  status          = 'Active',
  executionLabel  = 'Building weekly post plan for Instagram',
  executionPct    = 55,
  posts           = 12,
  drafts          = 7,
  queued          = 5,
  reasons         = defaultReasons,
  upcomingPlans   = defaultPlans,
  aiText          = 'Users are saving educational posts more than other content',
  className       = '',
}) {
  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Social Media Strategy</h2>
          <p className="analytics-card__subtitle">Post planning and execution</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current execution</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{executionLabel}</span>
          <span className="smp-card__batch-count">{executionPct}%</span>
        </div>
      </div>

      <div className="sms-card__counters">
        <div className="sms-card__counter">
          <strong>{posts}</strong><span>Posts</span>
        </div>
        <div className="sms-card__counter">
          <strong>{drafts}</strong><span>Drafts</span>
        </div>
        <div className="sms-card__counter">
          <strong>{queued}</strong><span>Queued</span>
        </div>
      </div>

      {/* Reasons panel */}
      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {reasons.map(r => (
              <div key={r.label} className="analytics-card__mini-stat">
                <span>{r.label}</span>
                <strong className={r.tone === 'bad' ? 'sms-card__bad' : ''}>{r.delta}</strong>
              </div>
            ))}
          </div>
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {reasons.map(r => (
              <DottedDataBars
                key={r.label}
                columns={r.columns}
                tone={r.tone === 'bad' ? 'red' : 'green'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Plans */}
      <div className="smc-card__upcoming-panel">
        <div className="smc-card__upcoming-title">Upcoming Plans</div>
        <div className="smc-card__upcoming-body">
          {upcomingPlans.map((plan, i) => (
            <div key={i} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{plan}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default SocialMediaStrategyCard