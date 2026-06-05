import { get, post } from './client.js'

export const widgetsApi = {
  async getCatalog() { return get('/api/v1/widgets/catalog') },
  async list() { return get('/api/v1/widgets') },
  async get(key) { return get(`/api/v1/widgets/${key}`) },
  async refresh(key) { return post(`/api/v1/widgets/${key}/refresh`) },
}
