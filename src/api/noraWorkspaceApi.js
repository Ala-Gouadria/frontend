import { NORA_SEED_CONVERSATIONS, NORA_SERVICES } from './noraWorkspaceMockData'

let idCounter = 0

function createId(prefix) {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

function cloneAttachment(attachment) {
  return { ...attachment }
}

function cloneMessage(message) {
  return {
    ...message,
    attachments: (message.attachments ?? []).map(cloneAttachment),
  }
}

function cloneConversation(conversation) {
  return {
    ...conversation,
    messages: conversation.messages.map(cloneMessage),
  }
}

function formatSize(size = 0) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${size} B`
}

function summarizeConversation(conversation) {
  const latestMessage = [...conversation.messages].reverse().find((message) => message.role === 'user')
    ?? conversation.messages[conversation.messages.length - 1]

  return {
    id: conversation.id,
    title: conversation.title,
    serviceId: conversation.serviceId,
    updatedAt: conversation.updatedAt,
    preview: latestMessage?.text ?? 'Start a new conversation',
    messageCount: conversation.messages.length,
  }
}

function serviceById(serviceId) {
  return NORA_SERVICES.find((service) => service.id === serviceId) ?? NORA_SERVICES[0]
}

function deriveConversationTitle(text, fallbackLabel) {
  const cleaned = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) {
    return fallbackLabel
  }

  const shortTitle = cleaned.length > 42 ? `${cleaned.slice(0, 39).trimEnd()}...` : cleaned
  return shortTitle
}

function buildAttachmentSummary(attachments) {
  if (!attachments.length) {
    return ''
  }

  const names = attachments.map((attachment) => attachment.name).join(', ')
  return `I also reviewed these uploads: ${names}.`
}

function buildServiceReply(service, text, attachments) {
  const message = text.toLowerCase()
  const attachmentSummary = buildAttachmentSummary(attachments)

  if (service.id === 'social') {
    return [
      'Here is a social media execution pass you can test right away.',
      attachmentSummary,
      message.includes('hook')
        ? 'Lead with a problem-first hook, follow with one belief shift, then end with a direct CTA.'
        : 'Build the week around 3 authority posts, 1 proof post, and 1 offer-driven post.',
      'Keep every post tied to one audience pain point and one business goal.',
      'If you want, I can turn this into captions, hooks, and a posting calendar next.',
    ].filter(Boolean).join('\n')
  }

  if (service.id === 'analytics') {
    return [
      'Here is the analytics readout Nora would prioritize.',
      attachmentSummary,
      'Watch traffic quality, conversion rate, and follow-up speed together instead of in isolation.',
      'If one metric is strong and the others are weak, the issue is usually the handoff between pages, offer, and follow-up.',
      'I can turn this into a weekly KPI dashboard checklist if you want.',
    ].filter(Boolean).join('\n')
  }

  if (service.id === 'strategy') {
    return [
      'From a strategy point of view, the fastest win is clarity.',
      attachmentSummary,
      'Make the promise sharper, the proof more visible, and the CTA easier to act on.',
      'Use one differentiator that is easy to repeat across content, landing pages, and outreach.',
      'I can expand this into positioning pillars and a 30 day action plan next.',
    ].filter(Boolean).join('\n')
  }

  if (service.id === 'sales') {
    return [
      'For sales, Nora would focus on momentum and follow-up quality first.',
      attachmentSummary,
      'Tighten the first reply, shorten the path to value, and make the offer feel easier to say yes to.',
      'A strong next move is turning your best proof into objection-handling follow-up messages.',
      'I can draft those follow-ups for email, DMs, or WhatsApp.',
    ].filter(Boolean).join('\n')
  }

  if (service.id === 'website') {
    return [
      'For website improvements, start with the highest-traffic decision points.',
      attachmentSummary,
      'Clarify the headline, strengthen the CTA, and reduce friction between proof and action.',
      'If a page gets attention but not conversions, the message usually needs to be more specific and outcome-focused.',
      'I can rewrite the hero section or CTA flow next.',
    ].filter(Boolean).join('\n')
  }

  if (service.id === 'automation') {
    return [
      'For automation, prioritize repeatable work that currently steals attention from the team.',
      attachmentSummary,
      'Trigger follow-ups faster, assign tasks automatically, and log status changes in one place.',
      'The best automation systems reduce response time and make handoffs visible.',
      'I can map this into a workflow with triggers, actions, and fallback checks.',
    ].filter(Boolean).join('\n')
  }

  return [
    'Here is a practical Nora response based on your request.',
    attachmentSummary,
    'I would break this into one priority goal, three focused actions, and one measurable result to review after execution.',
    'If you share more context, I can make the plan more specific to your business.',
  ].filter(Boolean).join('\n')
}

let conversations = NORA_SEED_CONVERSATIONS.map(cloneConversation)

function sortConversations() {
  conversations.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
}

sortConversations()

export const noraWorkspaceApi = {
  async listServices() {
    await delay(140)
    return NORA_SERVICES.map((service) => ({ ...service }))
  },

  async listConversations() {
    await delay(180)
    sortConversations()
    return conversations.map(summarizeConversation)
  },

  async getConversation(conversationId) {
    await delay(160)
    const conversation = conversations.find((item) => item.id === conversationId)

    if (!conversation) {
      throw new Error('Conversation not found.')
    }

    return cloneConversation(conversation)
  },

  async createConversation({ serviceId = 'general', title } = {}) {
    await delay(120)
    const service = serviceById(serviceId)
    const conversation = {
      id: createId('conv'),
      title: title ?? `${service.shortLabel} Chat`,
      serviceId: service.id,
      updatedAt: new Date().toISOString(),
      messages: [],
    }

    conversations = [conversation, ...conversations]
    return cloneConversation(conversation)
  },

  async uploadAttachment(file, kind = 'file', options = {}) {
    await delay(220)

    const inferredType = kind === 'image'
      ? 'image'
      : kind === 'audio'
        ? 'audio'
        : 'file'

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

  async sendMessage({
    conversationId,
    serviceId = 'general',
    text = '',
    attachments = [],
  }) {
    await delay(320)

    let conversation = conversations.find((item) => item.id === conversationId)

    if (!conversation) {
      conversation = {
        id: conversationId ?? createId('conv'),
        title: 'New Chat',
        serviceId,
        updatedAt: new Date().toISOString(),
        messages: [],
      }
      conversations = [conversation, ...conversations]
    }

    const userMessage = {
      id: createId('msg'),
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
      attachments: attachments.map(cloneAttachment),
    }

    conversation.messages.push(userMessage)
    conversation.serviceId = serviceId
    conversation.title = deriveConversationTitle(text, `${serviceById(serviceId).shortLabel} Chat`)
    conversation.updatedAt = userMessage.createdAt

    await delay(540)

    const assistantMessage = {
      id: createId('msg'),
      role: 'assistant',
      text: buildServiceReply(serviceById(serviceId), text, attachments),
      createdAt: new Date().toISOString(),
      attachments: [],
    }

    conversation.messages.push(assistantMessage)
    conversation.updatedAt = assistantMessage.createdAt

    sortConversations()

    return {
      conversation: cloneConversation(conversation),
      assistantMessage: cloneMessage(assistantMessage),
    }
  },
}
