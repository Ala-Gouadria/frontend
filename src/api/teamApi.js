import { get, post, patch, del } from './client.js'

function mapUser(user) {
  return {
    id: user.id,
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email,
    email: user.email,
    // Backend roles are lowercase; UI expects Capitalized for display — use as-is and let formatRole handle display
    role: user.role,
    status: user.status === 'active' ? 'Active' : 'Inactive',
    lastActive: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never',
  }
}

export const teamApi = {
  async listMembers() {
    const result = await get('/api/v1/users')
    const items = Array.isArray(result) ? result : (result?.items ?? result?.data ?? [])
    return items.map(mapUser)
  },

  async setMemberStatus(memberId, status) {
    const backendStatus = status === 'Active' ? 'active' : 'inactive'
    const updated = await patch(`/api/v1/users/${memberId}/role`, { status: backendStatus })
    return mapUser(updated)
  },

  async updateMemberRole(memberId, role) {
    // Backend expects lowercase role
    const updated = await patch(`/api/v1/users/${memberId}/role`, { role: role.toLowerCase() })
    return mapUser(updated)
  },

  async inviteMember(email, role = 'viewer') {
    const result = await post('/api/v1/users/invite', { email, role })
    return mapUser(result)
  },

  async removeMember(memberId) {
    return del(`/api/v1/users/${memberId}`)
  },
}
