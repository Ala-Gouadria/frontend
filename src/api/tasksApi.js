import { get, post, put, patch, del } from './client.js'

export const tasksApi = {
  async listTasks({ page = 1, pageSize = 50, status, priority } = {}) {
    const result = await get('/api/v1/tasks', { params: { page, pageSize, status, priority } })
    const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
    const pagination = result?.pagination ?? null
    return { items, pagination }
  },

  async getTask(taskId) {
    return get(`/api/v1/tasks/${taskId}`)
  },

  async createTask(data) {
    return post('/api/v1/tasks', data)
  },

  async updateTask(taskId, data) {
    return put(`/api/v1/tasks/${taskId}`, data)
  },

  async updateStatus(taskId, status) {
    return patch(`/api/v1/tasks/${taskId}/status`, { status })
  },

  async deleteTask(taskId) {
    return del(`/api/v1/tasks/${taskId}`)
  },
}
