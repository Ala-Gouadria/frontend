import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { teamApi } from '../../api/teamApi'
import './SettingsWorkspace.css'

const ROLES = ['Admin', 'Owner', 'Member', 'Viewer']

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.7" cy="8.7" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m12.6 12.6 3.2 3.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 4.5v11M4.5 10h11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8 4 3 10l5 6M15 4l-5 6 5 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Team({ onNavigate }) {
  const { t } = useTranslation()
  const [members, setMembers] = useState([])
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    teamApi.listMembers().then((items) => {
      if (isMounted) {
        setMembers(items)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return members.filter((member) => {
      const matchesQuery = !normalizedQuery
        || member.name.toLowerCase().includes(normalizedQuery)
        || member.email.toLowerCase().includes(normalizedQuery)
      const matchesRole = roleFilter === 'All Roles' || member.role === roleFilter
      const matchesStatus = statusFilter === 'All Status' || member.status === statusFilter

      return matchesQuery && matchesRole && matchesStatus
    })
  }, [members, query, roleFilter, statusFilter])

  const updateMember = (updated) => {
    setMembers((items) => items.map((item) => (
      item.id === updated.id ? updated : item
    )))
  }

  const toggleStatus = async (member) => {
    setPendingId(member.id)
    const updated = await teamApi.setMemberStatus(member.id, member.status === 'Active' ? 'Inactive' : 'Active')
    updateMember(updated)
    setPendingId(null)
  }

  const changeRole = async (member) => {
    setPendingId(member.id)
    const nextRole = ROLES[(ROLES.indexOf(member.role) + 1) % ROLES.length]
    const updated = await teamApi.updateMemberRole(member.id, nextRole)
    updateMember(updated)
    setPendingId(null)
  }

  const inviteMember = async () => {
    const invite = await teamApi.inviteMember()
    setMembers((items) => [invite, ...items])
  }

  return (
    <main className="settings-workspace settings-workspace--team">
      <Photo />
      <MainNav activeId={null} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="settings-workspace__content settings-workspace__content--table">
        <button type="button" className="workspace-back-button" onClick={() => onNavigate?.('settings')}>
          <BackIcon />
          <span>{t('team.backToSettings')}</span>
        </button>

        <header className="workspace-heading">
          <h1>{t('team.title')}</h1>
          <p>{t('team.subtitle')}</p>
        </header>

        <div className="settings-workspace__divider" />

        <section className="team-panel" aria-label="Team members">
          <div className="team-toolbar">
            <label className="team-search">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('team.searchPlaceholder')}
              />
            </label>

            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter by role">
              <option value="All Roles">{t('team.allRoles')}</option>
              {ROLES.map((role) => <option key={role}>{role}</option>)}
            </select>

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
              <option value="All Status">{t('team.allStatus')}</option>
              <option value="Active">{t('team.active')}</option>
              <option value="Inactive">{t('team.inactive')}</option>
            </select>

            <button type="button" className="team-invite-button" onClick={inviteMember}>
              <span>{t('team.inviteMember')}</span>
              <PlusIcon />
            </button>
          </div>

          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>{t('team.colName')}</th>
                  <th>{t('team.colEmail')}</th>
                  <th>{t('team.colRole')}</th>
                  <th>{t('team.colStatus')}</th>
                  <th>{t('team.colLastActive')}</th>
                  <th>{t('team.colActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td><span className="team-role-pill">{member.role}</span></td>
                    <td>
                      <span className={`team-status-pill team-status-pill--${member.status.toLowerCase()}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>{member.lastActive}</td>
                    <td>
                      <div className="team-actions">
                        <button type="button" onClick={() => changeRole(member)} disabled={pendingId === member.id}>
                          {t('team.changeRole')}
                        </button>
                        <button
                          type="button"
                          className={member.status === 'Active' ? 'team-actions__danger' : 'team-actions__success'}
                          onClick={() => toggleStatus(member)}
                          disabled={pendingId === member.id}
                        >
                          {member.status === 'Active' ? t('team.deactivate') : t('team.activate')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
