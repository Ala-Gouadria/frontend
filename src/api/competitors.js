import { get, post, put, del } from './client.js'

export const competitorsApi = {
  async list() { return get('/api/v1/competitors') },
  async get(id) { return get(`/api/v1/competitors/${id}`) },
  async create(data) { return post('/api/v1/competitors', data) },
  async update(id, data) { return put(`/api/v1/competitors/${id}`, data) },
  async remove(id) { return del(`/api/v1/competitors/${id}`) },
  async getIntel(id) { return get(`/api/v1/competitors/${id}/intel`) },
  async analyze(id) { return post(`/api/v1/competitors/${id}/analyze`) },
}
