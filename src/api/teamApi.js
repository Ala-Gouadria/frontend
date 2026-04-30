const TEAM_MEMBERS = [
  {
    id: 'marina-vasquez',
    name: 'Marina Vasquez',
    email: 'marina.vasquez@example.com',
    role: 'Admin',
    status: 'Inactive',
    lastActive: '1 hour ago',
  },
  {
    id: 'jensen-cole',
    name: 'Jensen Cole',
    email: 'jensen.cole@example.com',
    role: 'Owner',
    status: 'Active',
    lastActive: '10 minutes ago',
  },
  {
    id: 'liam-oconnor',
    name: "Liam O'Connor",
    email: 'liam.oconnor@example.com',
    role: 'Member',
    status: 'Active',
    lastActive: '5 minutes ago',
  },
  {
    id: 'sofia-chen',
    name: 'Sofia Chen',
    email: 'sofia.chen@example.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '30 seconds ago',
  },
  {
    id: 'ethan-park',
    name: 'Ethan Park',
    email: 'ethan.park@example.com',
    role: 'Member',
    status: 'Inactive',
    lastActive: '2 days ago',
  },
  {
    id: 'nina-patel',
    name: 'Nina Patel',
    email: 'nina.patel@example.com',
    role: 'Member',
    status: 'Active',
    lastActive: '15 minutes ago',
  },
  {
    id: 'carlos-ramirez',
    name: 'Carlos Ramirez',
    email: 'carlos.ramirez@example.com',
    role: 'Member',
    status: 'Active',
    lastActive: 'Just now',
  },
]

function delay(ms) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

let teamMembers = TEAM_MEMBERS.map((member) => ({ ...member }))

export const teamApi = {
  async listMembers() {
    await delay(140)
    return teamMembers.map((member) => ({ ...member }))
  },

  async setMemberStatus(memberId, status) {
    await delay(180)
    teamMembers = teamMembers.map((member) => (
      member.id === memberId ? { ...member, status } : member
    ))

    return teamMembers.find((member) => member.id === memberId)
  },

  async updateMemberRole(memberId, role) {
    await delay(180)
    teamMembers = teamMembers.map((member) => (
      member.id === memberId ? { ...member, role } : member
    ))

    return teamMembers.find((member) => member.id === memberId)
  },

  async inviteMember() {
    await delay(180)
    const invite = {
      id: `invite-${Date.now()}`,
      name: 'New Teammate',
      email: 'new.teammate@example.com',
      role: 'Viewer',
      status: 'Inactive',
      lastActive: 'Invited',
    }

    teamMembers = [invite, ...teamMembers]
    return { ...invite }
  },
}
