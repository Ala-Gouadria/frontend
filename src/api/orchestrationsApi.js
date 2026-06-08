import { get, post } from './client.js'

export const orchestrationsApi = {
  async create({ message, context = {} }) {
    // Backend contract is `intent` (see createOrchestrationSchema). Send `intent`
    // and mirror to `message` so either backend build accepts the body.
    return post('/api/v1/orchestrations', { intent: message, message, context })
  },

  async get(workflowId) {
    return get(`/api/v1/orchestrations/${workflowId}`)
  },

  async list({ page = 1, pageSize = 20, status } = {}) {
    return get('/api/v1/orchestrations', { params: { page, pageSize, status } })
  },
}
