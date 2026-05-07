import { get, post, del } from './client.js'

export const chatApi = {
  async listSessions() {
    return get('/api/v1/chat/sessions')
  },

  async getSession(sessionId) {
    return get(`/api/v1/chat/sessions/${sessionId}`)
  },

  async createSession({ title, agentType } = {}) {
    return post('/api/v1/chat/sessions', { title, agentType })
  },

  async sendMessage(sessionId, { message, attachments = [] }) {
    return post(`/api/v1/chat/sessions/${sessionId}/messages`, { message, attachments })
  },

  async deleteSession(sessionId) {
    return del(`/api/v1/chat/sessions/${sessionId}`)
  },
}
