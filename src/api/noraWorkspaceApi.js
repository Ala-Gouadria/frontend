import { NORA_SEED_CONVERSATIONS, NORA_SERVICES } from './noraWorkspaceMockData'
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

const TITLE_OVERRIDES_KEY = 'nora:conversationTitleOverrides'

function readTitleOverrides() {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(window.localStorage.getItem(TITLE_OVERRIDES_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeTitleOverride(conversationId, title) {
  if (typeof window === 'undefined') return

  try {
    const overrides = readTitleOverrides()
    window.localStorage.setItem(TITLE_OVERRIDES_KEY, JSON.stringify({ ...overrides, [conversationId]: title }))
  } catch {
    // Local title persistence is best effort only.
  }
}

function applyTitleOverride(session) {
  const title = readTitleOverrides()[session.id]
  return title ? { ...session, title } : session
}

function mapSession(session) {
  const sessionWithTitle = applyTitleOverride(session)
  const messages = session.messages ?? []
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  return {
    id: sessionWithTitle.id,
    title: sessionWithTitle.title ?? 'Chat',
    serviceId: sessionWithTitle.agentType ?? sessionWithTitle.serviceId ?? 'general',
    updatedAt: sessionWithTitle.updatedAt ?? sessionWithTitle.createdAt,
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
  const sessionWithTitle = applyTitleOverride(session)
  return {
    id: sessionWithTitle.id,
    title: sessionWithTitle.title ?? 'Chat',
    serviceId: sessionWithTitle.agentType ?? sessionWithTitle.serviceId ?? 'general',
    updatedAt: sessionWithTitle.updatedAt ?? sessionWithTitle.createdAt,
    messages: (sessionWithTitle.messages ?? []).map(mapMessage),
  }
}

function seedConversations() {
  return NORA_SEED_CONVERSATIONS.map((conversation) => ({
    ...conversation,
    agentType: conversation.serviceId,
  }))
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
      return seedConversations().map(mapSession)
    }
  },

  async getConversation(conversationId) {
    try {
      const session = await chatApi.getSession(conversationId)
      return mapFullSession(session)
    } catch {
      const seedConversation = seedConversations().find((conversation) => conversation.id === conversationId)
      if (seedConversation) {
        return mapFullSession(seedConversation)
      }
      throw new Error('Conversation not found.')
    }
  },

  async createConversation({ serviceId = 'general', title } = {}) {
    const session = await chatApi.createSession({
      title: title ?? `${NORA_SERVICES.find((s) => s.id === serviceId)?.shortLabel ?? 'General'} Chat`,
      agentType: serviceId,
    })
    return mapFullSession({ ...session, messages: [] })
  },

  async renameConversation(conversationId, title) {
    const cleanTitle = String(title ?? '').trim()
    if (!cleanTitle) {
      throw new Error('Conversation title cannot be empty.')
    }

    writeTitleOverride(conversationId, cleanTitle)

    try {
      const session = await chatApi.updateSession(conversationId, { title: cleanTitle })
      return mapFullSession({ ...session, title: cleanTitle })
    } catch {
      const current = seedConversations().find((conversation) => conversation.id === conversationId)
      return mapFullSession({ ...(current ?? { id: conversationId, messages: [] }), title: cleanTitle })
    }
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
