import { get, post, put, patch, del } from './client.js'

export const leadsApi = {
  async list({ page = 1, pageSize = 20, stage, source } = {}) {
    return get('/api/v1/leads', { params: { page, pageSize, stage, source } })
  },
  async get(leadId) { return get(`/api/v1/leads/${leadId}`) },
  async create(data) { return post('/api/v1/leads', data) },
  async update(leadId, data) { return put(`/api/v1/leads/${leadId}`, data) },
  async remove(leadId) { return del(`/api/v1/leads/${leadId}`) },
  async updateStage(leadId, stage) { return patch(`/api/v1/leads/${leadId}/stage`, { stage }) },
  async score(leadId) { return post(`/api/v1/leads/${leadId}/score`) },
  async scoreBatch(leadIds) { return post('/api/v1/leads/score-batch', { leadIds }) },
  async getPipeline() { return get('/api/v1/leads/pipeline') },
  async listActivities(leadId) { return get(`/api/v1/leads/${leadId}/activities`) },
  async addActivity(leadId, data) { return post(`/api/v1/leads/${leadId}/activities`, data) },
}
