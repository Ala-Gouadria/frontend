import { useState, useEffect, useRef } from 'react'

import { strategyApi } from '../api/strategy.js'

/**
 * Fetches AI-generated recommendations from the backend strategy endpoint
 * (GET /api/v1/strategy/recommendations → { count, items }). These are produced
 * by the daily/weekly report jobs and the outcomes-measurement loop.
 *
 * Returns { items, top, loading, error, hasRealData }. When empty, consumers
 * fall back to their derived/heuristic insight text.
 */
export function useRecommendations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    ;(async () => {
      try {
        const res = await strategyApi.getRecommendations()
        const list = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []
        if (mountedRef.current) setItems(list)
      } catch (err) {
        if (mountedRef.current) {
          setError(err?.message || 'Failed to load recommendations')
          setItems([])
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    items,
    top: items[0] ?? null,
    loading,
    error,
    hasRealData: items.length > 0,
  }
}
