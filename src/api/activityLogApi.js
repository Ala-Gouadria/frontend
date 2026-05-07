import { get } from './client.js'

function mapAuditLog(entry) {
  const actor = entry.actor
    ? `${entry.actor.firstName ?? ''} ${entry.actor.lastName ?? ''}`.trim() || entry.actor.email
    : 'System'

  return {
    id: entry.id,
    title: entry.action ?? 'Action',
    detailTitle: entry.action ?? 'Action',
    time: entry.createdAt ? new Date(entry.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    timestamp: entry.createdAt ?? '',
    department: entry.entityType ?? 'system',
    type: 'Audit',
    eventType: entry.entityType ?? 'system',
    impact: actor,
    impactDetail: actor,
    status: 'Successful',
    summary: `${entry.action} on ${entry.entityType} by ${actor}`,
    assets: [],
  }
}

export const activityLogApi = {
  async listLogs({ page = 1, pageSize = 50 } = {}) {
    try {
      const result = await get('/api/v1/audit', { params: { page, pageSize } })
      const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
      return items.map(mapAuditLog)
    } catch {
      return []
    }
  },
}
