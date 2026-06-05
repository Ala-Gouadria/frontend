import { get, post } from './client.js'

export const approvalsApi = {
  async list({ page = 1, pageSize = 20, status = 'pending' } = {}) {
    return get('/api/v1/approvals', { params: { page, pageSize, status } })
  },

  async get(approvalId) {
    return get(`/api/v1/approvals/${approvalId}`)
  },

  async approve(approvalId, { comment } = {}) {
    return post(`/api/v1/approvals/${approvalId}/approve`, { comment })
  },

  async reject(approvalId, { reason } = {}) {
    return post(`/api/v1/approvals/${approvalId}/reject`, { reason })
  },

  async getPendingSummary() {
    return get('/api/v1/approvals/pending/summary')
  },
}
