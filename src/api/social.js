import { get, post, put, patch, del } from './client.js'

export const socialApi = {
  // Accounts
  async listAccounts() { return get('/api/v1/social/accounts') },
  async connectAccount(data) { return post('/api/v1/social/accounts', data) },
  async updateAccount(id, data) { return patch(`/api/v1/social/accounts/${id}`, data) },
  async disconnectAccount(id) { return del(`/api/v1/social/accounts/${id}`) },
  async getAccountAnalytics(id) { return get(`/api/v1/social/accounts/${id}/analytics`) },

  // Posts
  async listPosts({ page = 1, pageSize = 20, status } = {}) {
    return get('/api/v1/social/posts', { params: { page, pageSize, status } })
  },
  async getPost(id) { return get(`/api/v1/social/posts/${id}`) },
  async createPost(data) { return post('/api/v1/social/posts', data) },
  async updatePost(id, data) { return put(`/api/v1/social/posts/${id}`, data) },
  async deletePost(id) { return del(`/api/v1/social/posts/${id}`) },
  async publishPost(id) { return post(`/api/v1/social/posts/${id}/publish`) },
  async generatePost(data) { return post('/api/v1/social/posts/generate', data) },
  async createBatchPosts(data) { return post('/api/v1/social/posts/batch', data) },

  // Content generation
  async generateImage(data) { return post('/api/v1/social/image/generate', data) },
  async generateCaptions(data) { return post('/api/v1/social/captions/generate', data) },
  async generateContentPlan(data) { return post('/api/v1/social/content-plan/generate', data) },

  // Calendar
  async getCalendar({ from, to } = {}) { return get('/api/v1/social/calendar', { params: { from, to } }) },
}
