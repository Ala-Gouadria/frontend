import { get, post, put, patch, del } from './client.js'

export const goalsApi = {
  async list() { return get('/api/v1/goals') },
  async get(id) { return get(`/api/v1/goals/${id}`) },
  async create(data) { return post('/api/v1/goals', data) },
  async update(id, data) { return put(`/api/v1/goals/${id}`, data) },
  async remove(id) { return del(`/api/v1/goals/${id}`) },
  async updateProgress(id, progress) { return patch(`/api/v1/goals/${id}/progress`, { progress }) },
  async syncToAi() { return post('/api/v1/goals/sync-to-ai') },
}
