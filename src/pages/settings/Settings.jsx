import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './Settings.css'

function SettingsCard({ children, className = '' }) {
  return <section className={`settings-card ${className}`}>{children}</section>
}

function SettingsRow({ label, value, action, onClick }) {
  const interactive = typeof onClick === 'function'

  return (
    <div
      className={`settings-row ${interactive ? 'settings-row--interactive' : ''}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(event) => {
        if (interactive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick()
        }
      }}
    >
      <div>
        <strong>{label}</strong>
        {value ? <span>{value}</span> : null}
      </div>
      {action ? (
        <button type="button" className="settings-outline-button">
          {action}
        </button>
      ) : null}
    </div>
  )
}

function LanguageRow({ label, currentLang, onLanguageChange }) {
  return (
    <div className="settings-row">
      <div>
        <strong>{label}</strong>
      </div>
      {/* use span so .settings-row div rule does not apply */}
      <span className="settings-lang-switcher">
        <button
          type="button"
          className={`settings-lang-btn ${currentLang === 'en' ? 'settings-lang-btn--active' : ''}`}
          onClick={() => onLanguageChange('en')}
        >
          English
        </button>
        <button
          type="button"
          className={`settings-lang-btn ${currentLang === 'ar' ? 'settings-lang-btn--active' : ''}`}
          onClick={() => onLanguageChange('ar')}
        >
          العربية
        </button>
      </span>
    </div>
  )
}

function Toggle({ enabled = true, onToggle }) {
  const handleToggle = (e) => {
    e.stopPropagation()
    onToggle?.(!enabled)
  }

  return (
    <button
      type="button"
      className={`settings-toggle ${enabled ? 'settings-toggle--on' : ''}`}
      aria-pressed={enabled}
      onClick={handleToggle}
    >
      <span />
    </button>
  )
}

export default function Settings({ onNavigate }) {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en'

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
  }

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const profileRows = [
    { label: t('settings.emailAddress'), value: 'abtahi.shipar@gmail.com' },
    { label: t('settings.givenName'), value: 'Abtahi Shipar', action: t('settings.update') },
    { label: t('settings.currentPlan'), value: t('settings.free'), action: t('settings.upgrade') },
    { label: t('settings.changePassword'), value: t('settings.updatePassword'), action: t('settings.upgrade') },
  ]

  const workspaceRows = [
    { label: t('settings.integration'), view: 'settings-integrations' },
    { label: t('settings.teamManagement'), view: 'settings-team' },
  ]

  const billingRows = [
    { label: t('settings.paymentMethod') },
    { label: t('settings.billingHistory') },
    { label: t('settings.reportBug') },
    { label: t('settings.termsOfUse'), view: 'settings-terms' },
    { label: t('settings.privacyPolicy'), view: 'settings-privacy' },
  ]

  const handleSignOutAllDevices = () => {
    const confirmed = window.confirm('Sign out of all devices?\n\nYou will be logged out on all browsers and devices. You will need to sign in again on each device.')
    if (confirmed) {
      localStorage.removeItem('authToken')
      sessionStorage.clear()
      localStorage.setItem('logout-event', Date.now().toString())
      if (onNavigate && typeof onNavigate === 'function') {
        onNavigate('login')
      } else {
        window.location.href = '/login'
      }
    }
  }

  const handleDeleteAccount = () => {
    const confirmed = window.prompt(
      '⚠️ PERMANENT ACCOUNT DELETION ⚠️\n\n' +
      'This action is IRREVERSIBLE. All your projects, data, and settings will be permanently deleted.\n\n' +
      'Type "DELETE MY ACCOUNT" below to confirm:'
    )
    if (confirmed === 'DELETE MY ACCOUNT') {
      localStorage.clear()
      sessionStorage.clear()
      if (onNavigate && typeof onNavigate === 'function') {
        onNavigate('goodbye')
      } else {
        window.location.href = '/'
      }
    } else if (confirmed !== null) {
      alert('Confirmation text did not match. Account was NOT deleted.')
    }
  }

  return (
    <main className="settings-page">
      <Photo />
      <MainNav activeId={null} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <div className="settings-content">
        <header className="settings-header">
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.subtitle')}</p>
        </header>

        <div className="settings-divider" />

        <SettingsCard>
          {profileRows.map((row) => (
            <SettingsRow key={row.label} {...row} />
          ))}
          <LanguageRow
            label={t('settings.language')}
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
          />
        </SettingsCard>

        <SettingsCard>
          {workspaceRows.map((row) => (
            <SettingsRow key={row.label} label={row.label} onClick={() => onNavigate?.(row.view)} />
          ))}
        </SettingsCard>

        <SettingsCard>
          {billingRows.map((row) => (
            <SettingsRow key={row.label} label={row.label} onClick={row.view ? () => onNavigate?.(row.view) : undefined} />
          ))}
        </SettingsCard>

        <SettingsCard className="settings-card--security">
          <div className="settings-row settings-row--control">
            <strong>{t('settings.notifications')}</strong>
            <Toggle enabled={notificationsEnabled} onToggle={setNotificationsEnabled} />
          </div>
          <div className="settings-row settings-row--control">
            <strong>{t('settings.twoFactor')}</strong>
            <Toggle enabled={twoFactorEnabled} onToggle={setTwoFactorEnabled} />
          </div>
          <div className="settings-row settings-row--control">
            <strong>{t('settings.signOutAllDevices')}</strong>
            <button type="button" className="settings-outline-button" onClick={handleSignOutAllDevices}>
              {t('settings.signOut')}
            </button>
          </div>
          <div className="settings-row settings-row--control">
            <strong className="settings-danger-text">{t('settings.deleteAccount')}</strong>
            <button type="button" className="settings-outline-button settings-outline-button--danger" onClick={handleDeleteAccount}>
              {t('settings.delete')}
            </button>
          </div>
        </SettingsCard>
      </div>

      <BottomAIStatusTools />
    </main>
  )
}
