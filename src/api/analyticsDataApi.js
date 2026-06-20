import { get } from './client.js'

/**
 * Analytics Data API — Unified endpoints for fetching real analytics data
 * from connected integrations (Google, HubSpot, Shopify, Ahrefs, Mixpanel, etc.)
 */
export const analyticsDataApi = {
  /**
   * Get traffic data from GA4/Mixpanel
   * @param {Object} options - Query options
   * @param {number} options.days - Number of days of history (default: 30)
   * @param {string} options.source - Filter by source (google_analytics, mixpanel)
   */
  async getTrafficData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    if (options.source) params.append('source', options.source)
    return get(`/api/v1/analytics/data/traffic?${params}`)
  },

  /**
   * Get SEO data from Search Console/Ahrefs
   * @param {Object} options - Query options
   * @param {number} options.days - Number of days of history (default: 30)
   * @param {string} options.source - Filter by source (google_search_console, ahrefs)
   */
  async getSeoData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    if (options.source) params.append('source', options.source)
    return get(`/api/v1/analytics/data/seo?${params}`)
  },

  /**
   * Get CRM data from HubSpot
   * @param {Object} options - Query options
   * @param {number} options.days - Number of days of history (default: 30)
   */
  async getCrmData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    return get(`/api/v1/analytics/data/crm?${params}`)
  },

  /**
   * Get revenue data from Shopify
   * @param {Object} options - Query options
   * @param {number} options.days - Number of days of history (default: 30)
   */
  async getRevenueData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    return get(`/api/v1/analytics/data/revenue?${params}`)
  },

  /**
   * Get performance data from PageSpeed Insights
   * @param {Object} options - Query options
   * @param {string} options.url - Filter by URL
   * @param {string} options.strategy - Filter by strategy (mobile, desktop)
   */
  async getPerformanceData(options = {}) {
    const params = new URLSearchParams()
    if (options.url) params.append('url', options.url)
    if (options.strategy) params.append('strategy', options.strategy)
    return get(`/api/v1/analytics/data/performance?${params}`)
  },

  /**
   * Get visitor identification data from Clearbit
   * @param {Object} options - Query options
   * @param {number} options.days - Number of days of history (default: 30)
   */
  async getVisitorData(options = {}) {
    const params = new URLSearchParams()
    if (options.days) params.append('days', options.days)
    return get(`/api/v1/analytics/data/visitors?${params}`)
  },

  /**
   * Get comprehensive dashboard summary with all metrics
   * Returns aggregated data from all connected integrations
   */
  async getDashboardSummary() {
    return get('/api/v1/analytics/data/dashboard-summary')
  },

  /**
   * Get sync status for all integrations
   * Returns last sync time and status for each provider
   */
  async getSyncStatus() {
    return get('/api/v1/analytics/data/sync-status')
  },
}

/**
 * Helper to check if real data is available for a specific domain
 */
export const hasRealData = {
  async traffic() {
    try {
      const data = await analyticsDataApi.getTrafficData({ days: 7 })
      return data?.current?.visitors > 0
    } catch {
      return false
    }
  },
  async seo() {
    try {
      const data = await analyticsDataApi.getSeoData({ days: 7 })
      return data?.current?.totalClicks > 0
    } catch {
      return false
    }
  },
  async crm() {
    try {
      const data = await analyticsDataApi.getCrmData({ days: 7 })
      return data?.current?.totalLeads > 0
    } catch {
      return false
    }
  },
  async revenue() {
    try {
      const data = await analyticsDataApi.getRevenueData({ days: 7 })
      return data?.current?.totalRevenue > 0
    } catch {
      return false
    }
  },
  async performance() {
    try {
      const data = await analyticsDataApi.getPerformanceData()
      return data?.performanceScore > 0
    } catch {
      return false
    }
  },
}
