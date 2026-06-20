import { NORA_SEED_CONVERSATIONS, NORA_SERVICES } from './noraWorkspaceMockData'
import { chatApi } from './chatApi.js'
import { orchestrationsApi } from './orchestrationsApi.js'
import { resolveAuthedImageUrl } from './authedImage.js'

let idCounter = 0
function createId(prefix) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

// Heuristic: does this message ask Nora to produce an image? Used to route the
// request to the chat path (which has conversation context) instead of the
// context-blind agentic planner. Kept deliberately loose — a false positive
// just means the chat LLM decides image_prompt=null and nothing is generated.
function looksLikeImageRequest(text = '') {
  const t = String(text).toLowerCase()
  return (
    /\b(generate|create|make|design|draw|render|produce)\b/.test(t) &&
    /\b(image|images|picture|pictures|photo|photos|visual|visuals|graphic|graphics|illustration|artwork|poster|thumbnail)\b/.test(t)
  )
}

// Map orchestration/chat `artifacts` (e.g. generated images) into chat
// attachment objects the message renderer understands. Auth-protected URLs are
// fetched as blobs (see resolveAuthedImageUrl). Failures to load an individual
// image are dropped rather than failing the whole message.
async function artifactsToAttachments(artifacts = []) {
  if (!Array.isArray(artifacts)) return []
  const images = artifacts.filter((a) => a && a.type === 'image' && a.url)
  const settled = await Promise.all(
    images.map(async (a) => {
      try {
        return {
          id: createId('img'),
          type: 'image',
          url: await resolveAuthedImageUrl(a.url),
          name: a.caption ? a.caption.slice(0, 60) : 'Generated image',
          sizeLabel: 'AI-generated',
          // Mark AI-generated images so the chat renders them large + zoomable.
          generated: true,
        }
      } catch {
        return null
      }
    }),
  )
  return settled.filter(Boolean)
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

async function mapMessage(msg) {
  // Generated images are stored in metadata.artifacts (not in an attachments
  // field), so resolve them here too — otherwise images vanish on reload.
  const metaArtifacts = msg.metadata?.artifacts
  const fromArtifacts = metaArtifacts ? await artifactsToAttachments(metaArtifacts) : []
  return {
    id: msg.id,
    role: msg.role,
    text: msg.content ?? msg.text ?? '',
    createdAt: msg.createdAt,
    attachments: [...(msg.attachments ?? []), ...fromArtifacts],
  }
}

async function mapFullSession(session) {
  const sessionWithTitle = applyTitleOverride(session)
  return {
    id: sessionWithTitle.id,
    title: sessionWithTitle.title ?? 'Chat',
    serviceId: sessionWithTitle.agentType ?? sessionWithTitle.serviceId ?? 'general',
    updatedAt: sessionWithTitle.updatedAt ?? sessionWithTitle.createdAt,
    messages: await Promise.all((sessionWithTitle.messages ?? []).map(mapMessage)),
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

  async sendMessage({ conversationId, serviceId = 'general', text = '', attachments = [], chatOnly = false, mode }) {
    // Pure chat proxy. Reads the assistant text across the response shapes the
    // backend may use (aiMessage.content is the current contract). The chat
    // backend may also attach generated-image artifacts in message metadata
    // (when the conversational LLM was asked to make an image). `mode` (e.g.
    // 'voice') is forwarded so the AI can keep spoken replies short + plain.
    const viaChat = async () => {
      const result = await chatApi.sendMessage(conversationId, { message: text, attachments, mode })
      const metadata =
        result?.aiMessage?.metadata ?? result?.assistantMessage?.metadata ?? result?.metadata ?? {}
      const assistantMessage = {
        id: createId('msg'),
        role: 'assistant',
        text:
          result?.aiMessage?.content ??
          result?.assistantMessage?.content ??
          result?.message?.content ??
          result?.content ??
          result?.answer ??
          '',
        createdAt: new Date().toISOString(),
        attachments: await artifactsToAttachments(metadata.artifacts),
      }
      return { conversation: { id: conversationId, serviceId }, assistantMessage }
    }

    // Conversational callers (e.g. the voice orb) want Nora's spoken chat reply,
    // not the agentic planner's intent echo — go straight to chat.
    // Image-generation requests also go straight to chat: the chat path carries
    // the conversation history (so "generate the image" resolves to the concept
    // discussed earlier), whereas the agentic planner is context-blind here.
    if (chatOnly || looksLikeImageRequest(text)) {
      return viaChat()
    }

    // Try orchestrations first (agentic path)
    try {
      const orchResult = await orchestrationsApi.create({ message: text, context: { serviceId } })

      const assistantMessage = {
        id: createId('msg'),
        role: 'assistant',
        text: orchResult.answer ?? orchResult.result ?? '',
        createdAt: new Date().toISOString(),
        attachments: await artifactsToAttachments(orchResult.artifacts),
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
      return viaChat()
    }
  },
}
