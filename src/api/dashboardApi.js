import { get } from './client.js'

export const dashboardApi = {
  async getSummary() {
    return get('/api/v1/dashboard/summary')
  },

  async getKpis() {
    return get('/api/v1/dashboard/kpis')
  },

  async getPriorities() {
    return get('/api/v1/dashboard/priorities')
  },

  async getActivity() {
    return get('/api/v1/dashboard/activity')
  },

  async getFunnel() {
    return get('/api/v1/dashboard/funnel')
  },

  async getRevenue(period = '30d') {
    return get('/api/v1/dashboard/revenue', { params: { period } })
  },

  async getTrends(period = '30d') {
    return get('/api/v1/dashboard/trends', { params: { period } })
  },

  async getSocialOverview() {
    return get('/api/v1/dashboard/social-overview')
  },
}
