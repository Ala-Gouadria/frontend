import { useMemo } from 'react'
import './SocialMediaStuffsCardShared.css'
import './SocialMediaStrategyCard.css'
import { DottedDataBars, AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'

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

function transformData(socialData, defaults) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      status: 'No Data',
      executionLabel: 'No active strategy',
      executionPct: 0,
      posts: 0,
      drafts: 0,
      queued: 0,
      reasons: defaultReasons.map(r => ({ ...r, delta: '+0%', columns: r.columns.map(c => ({ ...c, count: 0 })) })),
      upcomingPlans: ['Connect social accounts to create strategy'],
      aiText: 'No strategy data available. Connect your social accounts to see strategy insights.',
    }
  }

  const platforms = socialData.platforms
  const connectedCount = Object.keys(platforms).length

  // Calculate metrics from social data
  let totalEngagement = 0
  let totalReach = 0
  Object.values(platforms).forEach(p => {
    totalEngagement += p.engagement || 0
    totalReach += p.reach || 0
  })

  const engagementGrowth = socialData.growth?.engagement || 0
  const reachGrowth = socialData.growth?.reach || 0

  return {
    status: 'Live',
    executionLabel: `Managing strategy for ${connectedCount} platforms`,
    executionPct: connectedCount > 0 ? Math.min(connectedCount * 33, 100) : 0,
    posts: totalReach > 0 ? Math.round(totalReach / 1000) : 0,
    drafts: defaults.drafts,
    queued: defaults.queued,
    reasons: [
      { ...defaultReasons[0], delta: `${reachGrowth >= 0 ? '+' : ''}${reachGrowth.toFixed(0)}%`, tone: reachGrowth >= 0 ? 'good' : 'bad' },
      { ...defaultReasons[1], delta: `${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}%`, tone: engagementGrowth >= 0 ? 'good' : 'bad' },
      { ...defaultReasons[2], delta: `+${connectedCount * 10}%`, tone: 'good' },
    ],
    upcomingPlans: defaults.upcomingPlans,
    aiText: totalEngagement > 0
      ? `Total reach: ${totalReach.toLocaleString()}. Engagement ${engagementGrowth >= 0 ? 'up' : 'down'} ${Math.abs(engagementGrowth).toFixed(0)}%.`
      : defaults.aiText,
  }
}

export function SocialMediaStrategyCard({
  status,
  executionLabel,
  executionPct,
  posts,
  drafts,
  queued,
  reasons,
  upcomingPlans,
  aiText,
  className = '',
  useRealData = true,
}) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const defaults = {
    status: status || 'Active',
    executionLabel: executionLabel || 'Building weekly post plan for Instagram',
    executionPct: executionPct || 55,
    posts: posts || 12,
    drafts: drafts || 7,
    queued: queued || 5,
    reasons: reasons || defaultReasons,
    upcomingPlans: upcomingPlans || defaultPlans,
    aiText: aiText || 'Users are saving educational posts more than other content',
  }

  const data = useMemo(() => {
    if (useRealData && socialData) {
      const transformed = transformData(socialData, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, socialData])

  return (
    <div className={`analytics-card ${className} ${loading ? 'loading' : ''}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Social Media Strategy</h2>
          <p className="analytics-card__subtitle">Post planning and execution</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current execution</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{data.executionLabel}</span>
          <span className="smp-card__batch-count">{data.executionPct}%</span>
        </div>
      </div>

      <div className="sms-card__counters">
        <div className="sms-card__counter">
          <strong>{data.posts}</strong><span>Posts</span>
        </div>
        <div className="sms-card__counter">
          <strong>{data.drafts}</strong><span>Drafts</span>
        </div>
        <div className="sms-card__counter">
          <strong>{data.queued}</strong><span>Queued</span>
        </div>
      </div>

      {/* Reasons panel */}
      <div className="analytics-card__panel">
        <div className="analytics-card__panel-title">Reasons</div>
        <div className="analytics-card__panel-body">
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {data.reasons.map(r => (
              <div key={r.label} className="analytics-card__mini-stat">
                <span>{r.label}</span>
                <strong className={r.tone === 'bad' ? 'sms-card__bad' : ''}>{r.delta}</strong>
              </div>
            ))}
          </div>
          <div className="analytics-card__panel-grid analytics-card__panel-grid--three">
            {data.reasons.map(r => (
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
          {data.upcomingPlans.map((plan, i) => (
            <div key={i} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{plan}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight>{data.aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default SocialMediaStrategyCard
