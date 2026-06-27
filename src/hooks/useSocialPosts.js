import { useState, useEffect, useRef } from 'react'

import { socialApi } from '../api/social.js'

/**
 * Fetch the tenant's social_posts once and return counts by status
 * (draft / scheduled / published / failed). Powers the Strategy card's
 * Drafts / Queued counters and execution %. Empty until posts are created,
 * so the counters read a truthful 0 rather than mock numbers.
 */
export function useSocialPostCounts() {
  const [counts, setCounts] = useState({ draft: 0, scheduled: 0, published: 0, failed: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    ;(async () => {
      try {
        const res = await socialApi.listPosts({ pageSize: 100 })
        const list = Array.isArray(res) ? res : (res?.items ?? res?.data ?? [])
        const c = { draft: 0, scheduled: 0, published: 0, failed: 0, total: list.length }
        for (const p of list) if (p.status in c) c[p.status] += 1
        if (mountedRef.current) setCounts(c)
      } catch {
        /* leave zeros on error */
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()
    return () => {
      mountedRef.current = false
    }
  }, [])

  return { counts, loading }
}
