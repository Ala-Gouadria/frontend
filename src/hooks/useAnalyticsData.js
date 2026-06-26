import { useState, useEffect, useCallback, useRef } from 'react'
import { analyticsDataApi } from '../api/analyticsDataApi'
import { dashboardApi } from '../api/dashboardApi'
import { leadsApi } from '../api/leads'
import { socialApi } from '../api/social'

// Global cache to prevent duplicate API calls across components
// Cache entries: { data, timestamp, loading, promise, subscribers }
const dataCache = new Map()
const CACHE_TTL = 60 * 1000 // 60 seconds cache TTL

function getCacheKey(dataType, options) {
  return `${dataType}:${JSON.stringify(options)}`
}

function getCachedData(key) {
  const entry = dataCache.get(key)
  if (!entry) return null
  // Only return entries that have actual data (timestamp set) or are loading
  if (!entry.timestamp && !entry.loading) return null
  // Check if cache is still valid
  if (entry.timestamp && Date.now() - entry.timestamp > CACHE_TTL) {
    dataCache.delete(key)
    return null
  }
  return entry
}

function setCacheData(key, data, hasRealData) {
  const entry = dataCache.get(key) || { subscribers: new Set() }
  entry.data = data
  entry.hasRealData = hasRealData
  entry.timestamp = Date.now()
  entry.loading = false
  entry.promise = null
  dataCache.set(key, entry)
  // Notify all subscribers
  entry.subscribers.forEach(callback => callback(data, hasRealData))
}

function setCacheLoading(key, promise) {
  const entry = dataCache.get(key) || { subscribers: new Set() }
  entry.loading = true
  entry.promise = promise
  dataCache.set(key, entry)
}

function subscribeToCache(key, callback) {
  const entry = dataCache.get(key) || { subscribers: new Set() }
  entry.subscribers.add(callback)
  dataCache.set(key, entry)
  return () => entry.subscribers.delete(callback)
}

/**
 * Custom hook for fetching real analytics data from connected integrations.
 * Uses shared cache to prevent duplicate API calls across components.
 *
 * @param {string} dataType - Type of data: 'traffic' | 'seo' | 'crm' | 'revenue' | 'performance' | 'visitors' | 'dashboard'
 * @param {Object} options - Query options (days, source, etc.)
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function, hasRealData: boolean }}
 */
export function useAnalyticsData(dataType, options = {}) {
  const cacheKey = getCacheKey(dataType, options)
  // Initialize from cache synchronously to avoid flash of mock data
  // Default to empty object {} so transform functions show zeros, not mock data
  const cachedEntry = getCachedData(cacheKey)
  const [data, setData] = useState(cachedEntry?.data ?? {})
  const [loading, setLoading] = useState(!cachedEntry || cachedEntry.loading)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(cachedEntry?.hasRealData ?? false)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached && !cached.loading) {
        setData(cached.data)
        setHasRealData(cached.hasRealData)
        setLoading(false)
        return
      }
      // If another component is already fetching, wait for that promise
      if (cached?.loading && cached?.promise) {
        setLoading(true)
        try {
          await cached.promise
          const updatedCache = getCachedData(cacheKey)
          if (mountedRef.current && updatedCache) {
            setData(updatedCache.data)
            setHasRealData(updatedCache.hasRealData)
          }
        } catch {
          // Error handled by original fetcher
        } finally {
          if (mountedRef.current) setLoading(false)
        }
        return
      }
    }

    setLoading(true)
    setError(null)

    const fetchPromise = (async () => {
      try {
        let result = null

        switch (dataType) {
          case 'traffic':
            result = await analyticsDataApi.getTrafficData(options)
            break
          case 'seo':
            result = await analyticsDataApi.getSeoData(options)
            break
          case 'crm':
            result = await analyticsDataApi.getCrmData(options)
            break
          case 'revenue':
            result = await analyticsDataApi.getRevenueData(options)
            break
          case 'performance':
            result = await analyticsDataApi.getPerformanceData(options)
            break
          case 'visitors':
            result = await analyticsDataApi.getVisitorData(options)
            break
          case 'dashboard':
            result = await analyticsDataApi.getDashboardSummary()
            break
          default:
            throw new Error(`Unknown data type: ${dataType}`)
        }

        const finalData = result !== null ? result : {}
        const hasData = !!result && Object.keys(result).length > 0
        setCacheData(cacheKey, finalData, hasData)

        if (mountedRef.current) {
          setData(finalData)
          setHasRealData(hasData)
        }
      } catch (err) {
        const status = err.response?.status
        if (status === 401 || status === 403 || status === 404 || err.message?.includes('not connected')) {
          setCacheData(cacheKey, {}, false)
          if (mountedRef.current) {
            setData({})
            setHasRealData(false)
          }
        } else {
          setCacheData(cacheKey, {}, false)
          if (mountedRef.current) {
            setError(err.message || 'Failed to fetch analytics data')
            setData({})
          }
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()

    setCacheLoading(cacheKey, fetchPromise)
    await fetchPromise
  }, [dataType, cacheKey])

  useEffect(() => {
    mountedRef.current = true

    // Subscribe to cache updates from other components
    const unsubscribe = subscribeToCache(cacheKey, (newData, newHasRealData) => {
      if (mountedRef.current) {
        setData(newData)
        setHasRealData(newHasRealData)
        setLoading(false)
      }
    })

    fetchData()

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [fetchData, cacheKey])

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    hasRealData,
  }
}

/**
 * Hook for dashboard summary - combines all analytics data
 */
export function useDashboardSummary() {
  return useAnalyticsData('dashboard')
}

/**
 * Hook for traffic data
 */
export function useTrafficData(options = {}) {
  return useAnalyticsData('traffic', options)
}

/**
 * Hook for SEO data
 */
export function useSeoData(options = {}) {
  return useAnalyticsData('seo', options)
}

/**
 * Hook for CRM data
 */
export function useCrmData(options = {}) {
  return useAnalyticsData('crm', options)
}

/**
 * Hook for revenue data
 */
export function useRevenueData(options = {}) {
  return useAnalyticsData('revenue', options)
}

/**
 * Hook for performance data
 */
export function usePerformanceData(options = {}) {
  return useAnalyticsData('performance', options)
}

/**
 * Hook for visitor identification data
 */
export function useVisitorData(options = {}) {
  return useAnalyticsData('visitors', options)
}

/**
 * Hook for integration sync status
 */
export function useSyncStatus() {
  const [status, setStatus] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await analyticsDataApi.getSyncStatus()
        setStatus(result || {})
      } catch {
        setStatus({})
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Refresh every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { status, loading }
}

/**
 * Hook for dashboard funnel data (with caching)
 */
export function useFunnelData() {
  const cacheKey = 'funnel:default'
  const cachedEntry = getCachedData(cacheKey)
  const [data, setData] = useState(cachedEntry?.data ?? [])
  const [loading, setLoading] = useState(!cachedEntry || cachedEntry.loading)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(cachedEntry?.hasRealData ?? false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const fetchData = async () => {
      // Check cache first
      const cached = getCachedData(cacheKey)
      if (cached && !cached.loading) {
        setData(cached.data)
        setHasRealData(cached.hasRealData)
        setLoading(false)
        return
      }
      if (cached?.loading && cached?.promise) {
        setLoading(true)
        await cached.promise
        const updatedCache = getCachedData(cacheKey)
        if (mountedRef.current && updatedCache) {
          setData(updatedCache.data)
          setHasRealData(updatedCache.hasRealData)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      const fetchPromise = (async () => {
        try {
          const result = await dashboardApi.getFunnel()
          const finalData = result !== null ? result : []
          const hasData = !!result && result.length > 0
          setCacheData(cacheKey, finalData, hasData)
          if (mountedRef.current) {
            setData(finalData)
            setHasRealData(hasData)
          }
        } catch (err) {
          setCacheData(cacheKey, [], false)
          if (mountedRef.current) {
            setError(err.message || 'Failed to fetch funnel data')
            setData([])
            setHasRealData(false)
          }
        } finally {
          if (mountedRef.current) setLoading(false)
        }
      })()

      setCacheLoading(cacheKey, fetchPromise)
      await fetchPromise
    }

    const unsubscribe = subscribeToCache(cacheKey, (newData, newHasRealData) => {
      if (mountedRef.current) {
        setData(newData)
        setHasRealData(newHasRealData)
        setLoading(false)
      }
    })

    fetchData()

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [])

  return { data, loading, error, hasRealData }
}

/**
 * Hook for leads data (with caching)
 */
export function useLeadsData(options = {}) {
  const cacheKey = `leads:${JSON.stringify(options)}`
  const cachedEntry = getCachedData(cacheKey)
  const [data, setData] = useState(cachedEntry?.data ?? { data: [], total: 0 })
  const [loading, setLoading] = useState(!cachedEntry || cachedEntry.loading)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(cachedEntry?.hasRealData ?? false)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached && !cached.loading) {
        setData(cached.data)
        setHasRealData(cached.hasRealData)
        setLoading(false)
        return
      }
      if (cached?.loading && cached?.promise) {
        setLoading(true)
        await cached.promise
        const updatedCache = getCachedData(cacheKey)
        if (mountedRef.current && updatedCache) {
          setData(updatedCache.data)
          setHasRealData(updatedCache.hasRealData)
          setLoading(false)
        }
        return
      }
    }

    setLoading(true)
    setError(null)

    const fetchPromise = (async () => {
      try {
        const result = await leadsApi.list(options)
        const finalData = result !== null ? result : { data: [], total: 0 }
        const hasData = !!result?.data && result.data.length > 0
        setCacheData(cacheKey, finalData, hasData)
        if (mountedRef.current) {
          setData(finalData)
          setHasRealData(hasData)
        }
      } catch (err) {
        setCacheData(cacheKey, { data: [], total: 0 }, false)
        if (mountedRef.current) {
          setError(err.message || 'Failed to fetch leads data')
          setData({ data: [], total: 0 })
          setHasRealData(false)
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()

    setCacheLoading(cacheKey, fetchPromise)
    await fetchPromise
  }, [cacheKey])

  useEffect(() => {
    mountedRef.current = true

    const unsubscribe = subscribeToCache(cacheKey, (newData, newHasRealData) => {
      if (mountedRef.current) {
        setData(newData)
        setHasRealData(newHasRealData)
        setLoading(false)
      }
    })

    fetchData()

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [fetchData, cacheKey])

  return { data, loading, error, hasRealData, refetch: () => fetchData(true) }
}

/**
 * Hook for leads pipeline data (with caching)
 */
export function usePipelineData() {
  const cacheKey = 'pipeline:default'
  const cachedEntry = getCachedData(cacheKey)
  const [data, setData] = useState(cachedEntry?.data ?? {})
  const [loading, setLoading] = useState(!cachedEntry || cachedEntry.loading)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(cachedEntry?.hasRealData ?? false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const fetchData = async () => {
      const cached = getCachedData(cacheKey)
      if (cached && !cached.loading) {
        setData(cached.data)
        setHasRealData(cached.hasRealData)
        setLoading(false)
        return
      }
      if (cached?.loading && cached?.promise) {
        setLoading(true)
        await cached.promise
        const updatedCache = getCachedData(cacheKey)
        if (mountedRef.current && updatedCache) {
          setData(updatedCache.data)
          setHasRealData(updatedCache.hasRealData)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      const fetchPromise = (async () => {
        try {
          const result = await leadsApi.getPipeline()
          const finalData = result !== null ? result : {}
          const hasData = !!result && Object.keys(result).length > 0
          setCacheData(cacheKey, finalData, hasData)
          if (mountedRef.current) {
            setData(finalData)
            setHasRealData(hasData)
          }
        } catch (err) {
          setCacheData(cacheKey, {}, false)
          if (mountedRef.current) {
            setError(err.message || 'Failed to fetch pipeline data')
            setData({})
            setHasRealData(false)
          }
        } finally {
          if (mountedRef.current) setLoading(false)
        }
      })()

      setCacheLoading(cacheKey, fetchPromise)
      await fetchPromise
    }

    const unsubscribe = subscribeToCache(cacheKey, (newData, newHasRealData) => {
      if (mountedRef.current) {
        setData(newData)
        setHasRealData(newHasRealData)
        setLoading(false)
      }
    })

    fetchData()

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [])

  return { data, loading, error, hasRealData }
}

/**
 * Hook for social data (with caching)
 */
export function useSocialData(options = {}) {
  const cacheKey = `social:${JSON.stringify(options)}`
  const cachedEntry = getCachedData(cacheKey)
  const [data, setData] = useState(cachedEntry?.data ?? {})
  const [loading, setLoading] = useState(!cachedEntry || cachedEntry.loading)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(cachedEntry?.hasRealData ?? false)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey)
      if (cached && !cached.loading) {
        setData(cached.data)
        setHasRealData(cached.hasRealData)
        setLoading(false)
        return
      }
      if (cached?.loading && cached?.promise) {
        setLoading(true)
        await cached.promise
        const updatedCache = getCachedData(cacheKey)
        if (mountedRef.current && updatedCache) {
          setData(updatedCache.data)
          setHasRealData(updatedCache.hasRealData)
          setLoading(false)
        }
        return
      }
    }

    setLoading(true)
    setError(null)

    const fetchPromise = (async () => {
      try {
        const result = await analyticsDataApi.getSocialData(options)
        const finalData = result !== null ? result : {}
        const hasData = !!result && Object.keys(result).length > 0
        setCacheData(cacheKey, finalData, hasData)
        if (mountedRef.current) {
          setData(finalData)
          setHasRealData(hasData)
        }
      } catch (err) {
        setCacheData(cacheKey, {}, false)
        if (mountedRef.current) {
          setError(err.message || 'Failed to fetch social data')
          setData({})
          setHasRealData(false)
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    })()

    setCacheLoading(cacheKey, fetchPromise)
    await fetchPromise
  }, [cacheKey])

  useEffect(() => {
    mountedRef.current = true

    const unsubscribe = subscribeToCache(cacheKey, (newData, newHasRealData) => {
      if (mountedRef.current) {
        setData(newData)
        setHasRealData(newHasRealData)
        setLoading(false)
      }
    })

    fetchData()

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [fetchData, cacheKey])

  return { data, loading, error, hasRealData, refetch: () => fetchData(true) }
}

/**
 * Hook for social accounts list (with caching)
 */
export function useSocialAccounts() {
  const cacheKey = 'socialAccounts:default'
  const cachedEntry = getCachedData(cacheKey)
  const [data, setData] = useState(cachedEntry?.data ?? [])
  const [loading, setLoading] = useState(!cachedEntry || cachedEntry.loading)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(cachedEntry?.hasRealData ?? false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const fetchData = async () => {
      const cached = getCachedData(cacheKey)
      if (cached && !cached.loading) {
        setData(cached.data)
        setHasRealData(cached.hasRealData)
        setLoading(false)
        return
      }
      if (cached?.loading && cached?.promise) {
        setLoading(true)
        await cached.promise
        const updatedCache = getCachedData(cacheKey)
        if (mountedRef.current && updatedCache) {
          setData(updatedCache.data)
          setHasRealData(updatedCache.hasRealData)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      const fetchPromise = (async () => {
        try {
          const result = await socialApi.listAccounts()
          const finalData = result !== null ? result : []
          const hasData = !!result && result.length > 0
          setCacheData(cacheKey, finalData, hasData)
          if (mountedRef.current) {
            setData(finalData)
            setHasRealData(hasData)
          }
        } catch (err) {
          setCacheData(cacheKey, [], false)
          if (mountedRef.current) {
            setError(err.message || 'Failed to fetch social accounts')
            setData([])
            setHasRealData(false)
          }
        } finally {
          if (mountedRef.current) setLoading(false)
        }
      })()

      setCacheLoading(cacheKey, fetchPromise)
      await fetchPromise
    }

    const unsubscribe = subscribeToCache(cacheKey, (newData, newHasRealData) => {
      if (mountedRef.current) {
        setData(newData)
        setHasRealData(newHasRealData)
        setLoading(false)
      }
    })

    fetchData()

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [])

  return { data, loading, error, hasRealData }
}
