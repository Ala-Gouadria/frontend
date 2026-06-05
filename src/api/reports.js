import { get, post } from './client.js'

export const reportsApi = {
  async list({ page = 1, pageSize = 20 } = {}) {
    const result = await get('/api/v1/reports', { params: { page, pageSize } })
    const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
    const pagination = result?.pagination ?? null
    return { items, pagination }
  },

  async generateDaily() {
    return post('/api/v1/reports/daily/generate')
  },

  async generateWeekly() {
    return post('/api/v1/reports/weekly/generate')
  },

  async getDaily(date) {
    return get(`/api/v1/reports/daily/${date}`)
  },

  async getWeekly(date) {
    return get(`/api/v1/reports/weekly/${date}`)
  },

  async search(query) {
    return get('/api/v1/reports/search', { params: { q: query } })
  },

  async compare(date1, date2) {
    return get('/api/v1/reports/compare', { params: { date1, date2 } })
  },
}
