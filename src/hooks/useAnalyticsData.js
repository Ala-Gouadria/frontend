import { useState, useEffect, useCallback } from 'react'
import { analyticsDataApi } from '../api/analyticsDataApi'

/**
 * Custom hook for fetching real analytics data from connected integrations.
 * Falls back gracefully if no data is available.
 *
 * @param {string} dataType - Type of data: 'traffic' | 'seo' | 'crm' | 'revenue' | 'performance' | 'visitors' | 'dashboard'
 * @param {Object} options - Query options (days, source, etc.)
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function, hasRealData: boolean }}
 */
export function useAnalyticsData(dataType, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasRealData, setHasRealData] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

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

      setData(result)
      setHasRealData(!!result && Object.keys(result).length > 0)
    } catch (err) {
      // Don't treat "no data" as an error - just means integrations aren't connected
      if (err.response?.status === 404 || err.message?.includes('not connected')) {
        setData(null)
        setHasRealData(false)
      } else {
        setError(err.message || 'Failed to fetch analytics data')
      }
    } finally {
      setLoading(false)
    }
  }, [dataType, JSON.stringify(options)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
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
