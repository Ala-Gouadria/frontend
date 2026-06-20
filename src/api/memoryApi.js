import { get, post, del } from './client.js'

const CATEGORIES = ['Social Media', 'Analytics', 'Strategy', 'Sales', 'Website', 'Automation']
const DURATIONS = ['Today', 'Weekly', 'Monthly', 'Custom']
// Knowledge-base document indexing states (mirror the backend KBDocument.status).
const STATUSES = ['Ready', 'Processing', 'Failed']

const DOC_STATUS_LABEL = { ready: 'Ready', processing: 'Processing', failed: 'Failed' }
const DOC_STATUS_OUTCOME = {
  Ready: 'Indexed into the knowledge base — Nora can use it in answers.',
  Processing: 'Still being processed — will be searchable once indexing finishes.',
  Failed: 'Indexing failed — try re-uploading this document.',
}

function fmtBytes(n) {
  if (typeof n !== 'number') return ''
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`
  if (n >= 1024) return `${Math.round(n / 1024)} KB`
  return `${n} B`
}

// Map a backend KBDocument ({ id, filename, mimetype, size, status, createdAt })
// onto the card shape the Memory page renders. Surfaces the REAL filename and
// indexing status so the user can tell what's in their knowledge base and
// whether it finished processing.
function mapDocument(doc) {
  const rawStatus = String(doc.status ?? '').toLowerCase()
  const status = DOC_STATUS_LABEL[rawStatus] ?? (doc.status ? String(doc.status) : 'Ready')
  const created = doc.createdAt ?? doc.created_at
  const sizeLabel = fmtBytes(doc.size)
  const meta = [sizeLabel, doc.mimetype].filter(Boolean).join(' · ')
  return {
    id: doc.id,
    title: doc.filename ?? doc.title ?? doc.name ?? 'Untitled',
    summary: meta || doc.description || '',
    time: created ? new Date(created).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    category: doc.metadata?.category ?? 'Strategy',
    categoryLabel: doc.metadata?.category ?? 'Strategy',
    duration: 'Custom',
    status,
    decision: doc.filename ?? '',
    outcome: DOC_STATUS_OUTCOME[status] ?? '',
    reasoning: '',
    details: [meta, `Status: ${status}`].filter(Boolean).join(' · '),
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
