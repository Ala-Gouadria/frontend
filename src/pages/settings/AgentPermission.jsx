import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './SettingsWorkspace.css'
import './AgentPermission.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M8 4 3 10l5 6M15 4l-5 6 5 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="agent-perm-info-icon">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7v4M8 5v.01" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={`agent-perm-toggle ${enabled ? 'agent-perm-toggle--on' : ''}`}
      aria-pressed={enabled}
      onClick={() => onToggle(!enabled)}
    >
      <span />
    </button>
  )
}

const PERMISSION_IDS = [
  'analytics',
  'social',
  'strategy',
  'sales',
  'website',
  'automation',
]

export default function AgentPermission({ onNavigate }) {
  const { t } = useTranslation()

  const [permissions, setPermissions] = useState(
    () => Object.fromEntries(PERMISSION_IDS.map((id) => [id, true]))
  )

  const setPermission = (id, value) => {
    setPermissions((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <main className="settings-workspace settings-workspace--agent-permission">
      <Photo />
      <MainNav activeId={null} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="settings-workspace__content settings-workspace__content--wide">
        <button
          type="button"
          className="workspace-back-button"
          onClick={() => onNavigate?.('settings')}
        >
          <BackIcon />
          <span>{t('agentPermission.backToSettings')}</span>
        </button>

        <header className="workspace-heading agent-perm-heading">
          <h1>{t('agentPermission.title')}</h1>
          <p>{t('agentPermission.subtitle')}</p>
        </header>

        <div className="settings-workspace__divider" />

        <section className="agent-perm-card" aria-label={t('agentPermission.title')}>
          {PERMISSION_IDS.map((id) => (
            <div key={id} className="agent-perm-row">
              <div className="agent-perm-row__label">
                <span>{t(`agentPermission.items.${id}`)}</span>
                <button
                  type="button"
                  className="agent-perm-info-btn"
                  aria-label={t('agentPermission.moreInfo')}
                  title={t(`agentPermission.tips.${id}`)}
                >
                  <InfoIcon />
                </button>
              </div>
              <Toggle
                enabled={permissions[id]}
                onToggle={(value) => setPermission(id, value)}
              />
            </div>
          ))}
        </section>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
