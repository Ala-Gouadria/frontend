/**
 * Helpers that turn the real /social response into the shapes the social cards
 * render — replacing the hardcoded mock columns/performers. All inputs are the
 * fields the backend already returns (trend[], current.topPosts[]).
 */

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/**
 * Convert a numeric series into DottedDataBars `columns` ([{label, count}]),
 * scaling values to the small 1–9 range the bars expect. Returns null when
 * there isn't enough signal, so callers fall back to mock decoration.
 */
export function seriesToColumns(values, { minPoints = 3 } = {}) {
  const vals = (values ?? []).map(Number).filter(Number.isFinite)
  if (vals.length < minPoints) return null
  const max = Math.max(...vals, 1)
  return vals.map((v, i) => ({
    label: DAY_LABELS[i % DAY_LABELS.length],
    count: Math.max(1, Math.round((v / max) * 8) + 1),
  }))
}

/** Engagement of a top-post entry (likes + comments + shares). */
function postEngagement(p) {
  return (p.likes || 0) + (p.comments || 0) + (p.shares || 0)
}

/**
 * Build the "Top Performers" list from real top posts, ranked by engagement
 * and scored 0–100 relative to the best post. Returns null when no posts.
 */
export function topPostsToPerformers(topPosts, limit = 3) {
  const posts = (topPosts ?? []).slice().sort((a, b) => postEngagement(b) - postEngagement(a))
  if (!posts.length) return null
  const top = postEngagement(posts[0]) || 1
  return posts.slice(0, limit).map((p) => {
    const eng = postEngagement(p)
    const label = (p.content || 'Post').replace(/\s+/g, ' ').trim().slice(0, 28) || 'Post'
    return { label, value: Math.max(5, Math.round((eng / top) * 100)), tone: 'green' }
  })
}
