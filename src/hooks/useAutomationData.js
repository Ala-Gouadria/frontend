import { useState, useEffect, useRef } from 'react'

import { get } from '../api/client.js'
import { tasksApi } from '../api/tasksApi.js'
import { orchestrationsApi } from '../api/orchestrationsApi.js'

/**
 * Hooks that feed the "Automation & Execution" cards from REAL backend data
 * (tasks, orchestration workflows, service health) instead of the social
 * analytics endpoint the cards were previously (incorrectly) wired to.
 *
 * Each hook fetches once on mount and exposes { ..., loading, error, hasRealData }.
 * On error the card falls back to its mock defaults (hasRealData = false).
 */

function useFetchOnce(fetcher, initial) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    ;(async () => {
      try {
        const { value, hasData } = await fetcher()
        if (!mountedRef.current) return
        setData(value)
        setHasRealData(hasData)
      } catch (err) {
        if (mountedRef.current) {
          setError(err?.message || 'Failed to load data')
          setHasRealData(false)
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()
    return () => {
      mountedRef.current = false
    }
  }, [])

  return { data, loading, error, hasRealData }
}

/** Tasks list (used by TaskExecutionCard). */
export function useTasksData() {
  const { data, loading, error, hasRealData } = useFetchOnce(async () => {
    const { items } = await tasksApi.listTasks({ pageSize: 100 })
    const list = Array.isArray(items) ? items : []
    return { value: list, hasData: list.length > 0 }
  }, [])
  return { items: data, loading, error, hasRealData }
}

/** Orchestration workflows (used by WorkflowAutomationCard + AutomationExecutionCard). */
export function useWorkflowsData() {
  const { data, loading, error, hasRealData } = useFetchOnce(async () => {
    const result = await orchestrationsApi.list({ pageSize: 25 })
    const list = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
    return { value: list, hasData: list.length > 0 }
  }, [])
  return { items: data, loading, error, hasRealData }
}

/** Service health from /health + /health/ready (used by SystemMonitoringCard). */
export function useSystemHealth() {
  const { data, loading, error, hasRealData } = useFetchOnce(async () => {
    const [ready, live] = await Promise.all([
      get('/health/ready').catch(() => null),
      get('/health').catch(() => null),
    ])
    if (!ready && !live) return { value: null, hasData: false }
    return {
      value: {
        checks: ready?.checks ?? {},
        status: ready?.status ?? 'unknown',
        uptimeSeconds: live?.uptime ?? null,
        version: live?.version ?? null,
      },
      hasData: !!ready?.checks,
    }
  }, null)
  return { health: data, loading, error, hasRealData }
}
