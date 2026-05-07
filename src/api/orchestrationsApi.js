import { get, post } from './client.js'

export const orchestrationsApi = {
  async create({ message, context = {} }) {
    return post('/api/v1/orchestrations', { message, context })
  },

  async get(workflowId) {
    return get(`/api/v1/orchestrations/${workflowId}`)
  },

  async list({ page = 1, pageSize = 20, status } = {}) {
    return get('/api/v1/orchestrations', { params: { page, pageSize, status } })
  },
}
