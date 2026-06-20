import { useState, useEffect } from 'react'
import { facebookApi } from '../../api/integrationsApi'
import SocialInsightsCard from './SocialInsightsCard'
import './SocialInsightsCard.css'

/**
 * Self-contained "live" version for use as a dashboard node — it fetches the
 * connected page's posts itself (the map renders nodes without passing props)
 * and shows the real Social Performance card, or a connect prompt when there's
 * no Facebook connection yet.
 */
export default function LiveSocialInsightsCard() {
  const [posts, setPosts] = useState(null) // null = loading

  useEffect(() => {
    let cancelled = false
    facebookApi
      .posts()
      .then((groups) => {
        if (cancelled) return
        const flat = (Array.isArray(groups) ? groups : []).flatMap((g) =>
          (g.posts || []).map((p) => ({ platform: g.platform, ...p })),
        )
        setPosts(flat)
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (posts === null) {
    return (
      <section className="social-insights">
        <div className="social-insights__sub">Loading social performance…</div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="social-insights">
        <h2 className="social-insights__title">Social Performance</h2>
        <p className="social-insights__sub">
          No social data yet. Connect Facebook on the Connect page, then Sync to see live posts and engagement here.
        </p>
      </section>
    )
  }

  return <SocialInsightsCard posts={posts} />
}
