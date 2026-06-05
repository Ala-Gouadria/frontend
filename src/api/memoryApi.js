import { get, post, del } from './client.js'

const CATEGORIES = ['Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
const DURATIONS = ['Today', 'Weekly', 'Monthly', 'Custom']
const STATUSES = ['Positive', 'Neutral', 'Negative']

function mapDocument(doc) {
  return {
    id: doc.id,
    title: doc.title ?? doc.name ?? 'Untitled',
    summary: doc.description ?? doc.content?.slice?.(0, 120) ?? '',
    time: doc.createdAt ? new Date(doc.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    category: doc.metadata?.category ?? 'Strategy',
    categoryLabel: doc.metadata?.category ?? 'Strategy',
    duration: 'Custom',
    status: 'Positive',
    decision: doc.description ?? '',
    outcome: '',
    reasoning: '',
    details: doc.content?.slice?.(0, 300) ?? '',
    decisionDuration: '',
  }
}

export const memoryApi = {
  async listMemories({ page = 1, pageSize = 50 } = {}) {
    try {
      const result = await get('/api/v1/kb/documents', { params: { page, pageSize } })
      const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
      return items.map(mapDocument)
    } catch {
      return []
    }
  },

  async getMemoryFilters() {
    return {
      categories: [...CATEGORIES],
      durations: [...DURATIONS],
      statuses: [...STATUSES],
    }
  },

  async searchMemories(query) {
    try {
      const result = await get('/api/v1/kb/search', { params: { q: query } })
      const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
      return items.map(mapDocument)
    } catch {
      return []
    }
  },

  async uploadDocument(file, metadata = {}) {
    const form = new FormData()
    form.append('file', file)
    if (metadata.title) form.append('title', metadata.title)
    if (metadata.description) form.append('description', metadata.description)
    return post('/api/v1/kb/documents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async deleteMemory(docId) {
    return del(`/api/v1/kb/documents/${docId}`)
  },
}
