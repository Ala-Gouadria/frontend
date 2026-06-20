import { TaskHistoryLineChart } from '../visuals-parts'
import './SocialInsightsCard.css'

const engagement = (p) => (Number(p.reactions) || 0) + (Number(p.comments) || 0) + (Number(p.shares) || 0)

/**
 * Real social performance, computed from the posts synced from Facebook +
 * Instagram (no mock data). `posts` is the flattened list the Integrate page
 * already loads: { platform, createdTime, reactions, comments, shares, message }.
 */
export default function SocialInsightsCard({ posts = [] }) {
  if (!Array.isArray(posts) || posts.length === 0) return null

  const chrono = [...posts].sort((a, b) => new Date(a.createdTime || 0) - new Date(b.createdTime || 0))
  const series = chrono.map(engagement).slice(-14) // recent engagement trend, per post

  const fb = posts.filter((p) => p.platform === 'facebook')
  const ig = posts.filter((p) => p.platform === 'instagram')
  const fbEng = fb.reduce((s, p) => s + engagement(p), 0)
  const igEng = ig.reduce((s, p) => s + engagement(p), 0)
  const totalEng = fbEng + igEng
  const pct = (v) => (totalEng > 0 ? Math.round((v / totalEng) * 100) : 0)

  const top = [...posts].sort((a, b) => engagement(b) - engagement(a)).slice(0, 3)

  return (
    <section className="social-insights" aria-label="Social performance">
      <header className="social-insights__head">
        <div>
          <h2 className="social-insights__title">Social Performance</h2>
          <p className="social-insights__sub">Live from your Facebook &amp; Instagram</p>
        </div>
        <span className="social-insights__badge">Live</span>
      </header>

      <div className="social-insights__metrics">
        <div className="si-metric"><span className="si-metric__v">{posts.length}</span><span className="si-metric__l">Posts</span></div>
        <div className="si-metric"><span className="si-metric__v">{totalEng.toLocaleString()}</span><span className="si-metric__l">Engagement</span></div>
        <div className="si-metric"><span className="si-metric__v">{Math.round(totalEng / posts.length)}</span><span className="si-metric__l">Avg / post</span></div>
      </div>

      {series.length >= 2 && (
        <div className="social-insights__chart">
          <p className="si-section">Engagement trend (recent posts)</p>
          <TaskHistoryLineChart data={series} tone="blue" />
        </div>
      )}

      <div className="social-insights__platforms">
        <p className="si-section">By platform</p>
        <div className="si-bar-row">
          <span className="si-bar-row__label">Facebook</span>
          <div className="si-bar"><div className="si-bar__fill si-bar__fill--fb" style={{ width: `${pct(fbEng)}%` }} /></div>
          <span className="si-bar-row__val">{fbEng.toLocaleString()}</span>
        </div>
        <div className="si-bar-row">
          <span className="si-bar-row__label">Instagram</span>
          <div className="si-bar"><div className="si-bar__fill si-bar__fill--ig" style={{ width: `${pct(igEng)}%` }} /></div>
          <span className="si-bar-row__val">{igEng.toLocaleString()}</span>
        </div>
      </div>

      <div className="social-insights__top">
        <p className="si-section">Top posts</p>
        <ul className="si-top-list">
          {top.map((p) => (
            <li key={`${p.platform}-${p.id}`} className="si-top">
              <span className={`si-top__tag si-top__tag--${p.platform}`}>{p.platform === 'instagram' ? 'IG' : 'FB'}</span>
              <span className="si-top__msg">{p.message?.trim() || '(no caption)'}</span>
              <span className="si-top__eng">{engagement(p).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
