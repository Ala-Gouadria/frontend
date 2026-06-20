import { get, post, patch, del } from './client.js'
import { getAccessToken } from './tokenStore.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

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

  async updateSession(sessionId, data = {}) {
    return patch(`/api/v1/chat/sessions/${sessionId}`, data)
  },

  async sendMessage(sessionId, { message, attachments = [], mode } = {}) {
    // Backend contract is `content` (see sendMessageSchema). Send `content` and
    // mirror it to `message` so either backend build accepts the body. `mode`
    // (e.g. 'voice') lets the AI tailor the answer — short + plain for TTS.
    return post(`/api/v1/chat/sessions/${sessionId}/messages`, { content: message, message, attachments, mode })
  },

  async deleteSession(sessionId) {
    return del(`/api/v1/chat/sessions/${sessionId}`)
  },

  // Real-time streaming send (SSE over fetch). `onEvent` is called for each
  // server event: {type:'token',text} | {type:'image_pending'} |
  // {type:'image',url,caption} | {type:'image_failed'} | {type:'done',id} |
  // {type:'error',message}. Throws before any event if the connection fails
  // (so the caller can fall back to the non-streaming sendMessage).
  async streamMessage(sessionId, { message }, onEvent) {
    const res = await fetch(`${API_BASE}/api/v1/chat/sessions/${sessionId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify({ content: message, message }),
    })
    if (!res.ok || !res.body) {
      throw new Error(`Stream request failed (${res.status})`)
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let sep
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        const line = frame.split('\n').find((l) => l.startsWith('data:'))
        if (!line) continue
        const json = line.slice(5).trim()
        if (!json) continue
        let evt
        try {
          evt = JSON.parse(json)
        } catch {
          continue
        }
        await onEvent?.(evt)
      }
    }
  },
}
