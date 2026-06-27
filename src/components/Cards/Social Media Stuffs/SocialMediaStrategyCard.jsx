import { useMemo, useState } from 'react'
import './SocialMediaStuffsCardShared.css'
import './SocialMediaStrategyCard.css'
import { DottedDataBars, AiInsight, AiActionButton } from '../../visuals-parts'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import { useSocialPostCounts } from '../../../hooks/useSocialPosts'
import { seriesToColumns } from '../../../lib/socialCardData'
import { socialApi } from '../../../api/social.js'

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

function transformData(socialData, postCounts, livePlans, defaults) {
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
  let totalPosts = 0
  Object.values(platforms).forEach(p => {
    totalEngagement += p.engagement || 0
    totalPosts += p.posts || 0
  })

  const engagementGrowth = socialData.growth?.engagement || 0
  const reachGrowth = socialData.growth?.reach || 0

  // Real daily-trend sparklines (fall back to mock when series too sparse).
  const engCols = seriesToColumns((socialData.trend || []).map(t => t.engagement)) || defaultReasons[0].columns
  const reachCols = seriesToColumns((socialData.trend || []).map(t => t.reach)) || defaultReasons[2].columns

  // Execution % from real publishing pipeline when posts exist; otherwise
  // reflect connected-platform coverage.
  const planned = postCounts.total
  const executionPct = planned > 0
    ? Math.round((postCounts.published / planned) * 100)
    : Math.min(connectedCount * 33, 100)

  return {
    status: 'Live',
    executionLabel: planned > 0
      ? `${postCounts.published}/${planned} posts published`
      : `Managing strategy for ${connectedCount} platforms`,
    executionPct,
    posts: totalPosts,                 // real: total posts across platforms
    drafts: postCounts.draft,          // real: from social_posts
    queued: postCounts.scheduled,      // real: scheduled posts
    reasons: [
      { ...defaultReasons[0], label: 'Engagement', delta: `${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth.toFixed(0)}%`, tone: engagementGrowth >= 0 ? 'good' : 'bad', columns: engCols },
      { ...defaultReasons[1], label: 'Reach', delta: `${reachGrowth >= 0 ? '+' : ''}${reachGrowth.toFixed(0)}%`, tone: reachGrowth >= 0 ? 'good' : 'bad', columns: reachCols },
      { ...defaultReasons[2], label: 'Followers', delta: `${(socialData.growth?.followers || 0) >= 0 ? '+' : ''}${(socialData.growth?.followers || 0).toFixed(0)}%`, tone: 'good', columns: engCols },
    ],
    upcomingPlans: livePlans ?? defaults.upcomingPlans,
    aiText: totalEngagement > 0
      ? `${totalPosts} posts across ${connectedCount} platforms. Engagement ${engagementGrowth >= 0 ? 'up' : 'down'} ${Math.abs(engagementGrowth).toFixed(0)}%.`
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
  const { counts: postCounts } = useSocialPostCounts()
  const [livePlans, setLivePlans] = useState(null)
  const [planLoading, setPlanLoading] = useState(false)

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
      const transformed = transformData(socialData, postCounts, livePlans, defaults)
      if (transformed) return transformed
    }
    return defaults
  }, [useRealData, socialData, postCounts, livePlans])

  // Generate a real weekly plan on demand. Uses the fast, reliable captions
  // endpoint (OpenAI, ~2-4s) seeded from the tenant's actual top-post themes —
  // the agent content-plan path is slower and returns a narrative, not a list.
  async function handleGeneratePlan() {
    setPlanLoading(true)
    try {
      const platform = socialData?.current?.platform || 'instagram'
      const posts = socialData?.current?.topPosts || []
      const themes = posts
        .slice(0, 4)
        .map((p) => (p.content || '').replace(/\s+/g, ' ').trim().slice(0, 90))
        .filter(Boolean)
      const topics = (themes.length
        ? themes
        : ['Highlight our most popular product', 'Share a customer success story',
           'Post an engaging tip for our audience', 'Announce a timely seasonal offer']
      ).map((topic) => ({ topic: `Short post idea: ${topic}`, platform }))

      const res = await socialApi.generateCaptions({ topics })
      const items = (res?.captions || [])
        .map((c) => (c.caption || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .map((c) => (c.length > 90 ? `${c.slice(0, 89)}…` : c))
        .slice(0, 4)
      if (items.length) setLivePlans(items)
    } catch {
      /* keep existing plans on error */
    } finally {
      setPlanLoading(false)
    }
  }

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
      <AiActionButton onClick={handleGeneratePlan} disabled={planLoading}>
        {planLoading ? 'Generating plan…' : 'Generate weekly plan'}
      </AiActionButton>
    </div>
  )
}

export default SocialMediaStrategyCard
