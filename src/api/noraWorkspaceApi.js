import { NORA_SERVICES } from './noraWorkspaceMockData'
import { chatApi } from './chatApi.js'
import { orchestrationsApi } from './orchestrationsApi.js'

let idCounter = 0
function createId(prefix) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

function formatSize(size = 0) {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  if (size >= 1024) return `${Math.round(size / 1024)} KB`
  return `${size} B`
}

function mapSession(session) {
  const messages = session.messages ?? []
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  return {
    id: session.id,
    title: session.title ?? 'Chat',
    serviceId: session.agentType ?? 'general',
    updatedAt: session.updatedAt ?? session.createdAt,
    preview: lastUser?.content ?? lastUser?.text ?? 'Start a new conversation',
    messageCount: messages.length,
  }
}

function mapMessage(msg) {
  return {
    id: msg.id,
    role: msg.role,
    text: msg.content ?? msg.text ?? '',
    createdAt: msg.createdAt,
    attachments: msg.attachments ?? [],
  }
}

function mapFullSession(session) {
  return {
    id: session.id,
    title: session.title ?? 'Chat',
    serviceId: session.agentType ?? 'general',
    updatedAt: session.updatedAt ?? session.createdAt,
    messages: (session.messages ?? []).map(mapMessage),
  }
}

export const noraWorkspaceApi = {
  async listServices() {
    return NORA_SERVICES.map((s) => ({ ...s }))
  },

  async listConversations() {
    try {
      const sessions = await chatApi.listSessions()
      const items = Array.isArray(sessions) ? sessions : (sessions?.data ?? [])
      return items.map(mapSession)
    } catch {
      return []
    }
  },

  async getConversation(conversationId) {
    const session = await chatApi.getSession(conversationId)
    return mapFullSession(session)
  },

  async createConversation({ serviceId = 'general', title } = {}) {
    const session = await chatApi.createSession({
      title: title ?? `${NORA_SERVICES.find((s) => s.id === serviceId)?.shortLabel ?? 'General'} Chat`,
      agentType: serviceId,
    })
    return mapFullSession({ ...session, messages: [] })
  },

  // Attachment upload is local (no backend endpoint for ephemeral chat attachments yet)
  async uploadAttachment(file, kind = 'file', options = {}) {
    const inferredType = kind === 'image' ? 'image' : kind === 'audio' ? 'audio' : 'file'
    return {
      id: createId('attachment'),
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size ?? 0,
      sizeLabel: formatSize(file.size ?? 0),
      type: inferredType,
      url: URL.createObjectURL(file),
      durationSeconds: options.durationSeconds ?? null,
    }
  },

  async uploadVoiceNote(blob, options = {}) {
    const filename = options.name ?? `voice-note-${new Date().toISOString().slice(11, 19).replace(/:/g, '-')}.webm`
    const file = new File([blob], filename, { type: blob.type || 'audio/webm' })
    return this.uploadAttachment(file, 'audio', options)
  },

  async sendMessage({ conversationId, serviceId = 'general', text = '', attachments = [] }) {
    // Try orchestrations first (agentic path)
    try {
      const orchResult = await orchestrationsApi.create({ message: text, context: { serviceId } })

      const assistantMessage = {
        id: createId('msg'),
        role: 'assistant',
        text: orchResult.answer ?? orchResult.result ?? '',
        createdAt: new Date().toISOString(),
        attachments: [],
        workflowId: orchResult.workflowId,
        workflowStatus: orchResult.status,
      }

      // Also persist to chat session so history is kept
      try {
        await chatApi.sendMessage(conversationId, { message: text, attachments })
      } catch {
        // Non-fatal — orchestration response is primary
      }

      return {
        conversation: { id: conversationId, serviceId, updatedAt: new Date().toISOString(), messages: [] },
        assistantMessage,
      }
    } catch {
      // Fall back to pure chat proxy
      const result = await chatApi.sendMessage(conversationId, { message: text, attachments })
      const assistantMessage = {
        id: createId('msg'),
        role: 'assistant',
        text: result?.assistantMessage?.content ?? result?.message?.content ?? result?.content ?? result?.answer ?? '',
        createdAt: new Date().toISOString(),
        attachments: [],
      }
      return { conversation: { id: conversationId, serviceId }, assistantMessage }
    }
  },
}
