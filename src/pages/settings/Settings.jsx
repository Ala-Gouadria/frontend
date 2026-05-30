import { useState } from 'react'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './Settings.css'

const PROFILE_ROWS = [
  { label: 'E-Mail Address', value: 'abtahi.shipar@gmail.com' },
  { label: 'Given Name', value: 'Abtahi Shipar', action: 'Update' },
  { label: 'Current Plan', value: 'Free', action: 'Upgrade' },
  { label: 'Change Password', value: 'Update your password', action: 'Upgrade' },
  { label: 'Language', value: 'English', action: 'Update' },
]

const WORKSPACE_ROWS = [
  { label: 'Integration', view: 'settings-integrations' },
  { label: 'Team Management', view: 'settings-team' },
]
const BILLING_ROWS = [
  { label: 'Payment Method' },
  { label: 'Billing History' },
  { label: 'Report a Bug' },
  { label: 'Terms of Use', view: 'settings-terms' },
  { label: 'Privacy Policy', view: 'settings-privacy' },
]

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
  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Handlers for destructive actions
  const handleSignOutAllDevices = () => {
    const confirmed = window.confirm('Sign out of all devices?\n\nYou will be logged out on all browsers and devices. You will need to sign in again on each device.')
    if (confirmed) {
      // Clear any session tokens / local storage indicators
      localStorage.removeItem('authToken')
      sessionStorage.clear()
      // Optionally notify other tabs
      localStorage.setItem('logout-event', Date.now().toString())
      // Navigate to login page if onNavigate supports it, otherwise reload
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
      // Perform account deletion (API call would go here)
      // Clear all user data
      localStorage.clear()
      sessionStorage.clear()
      // Redirect to goodbye/landing page
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
          <h1>Settings</h1>
          <p>Manage your profile and workspace memberships.</p>
        </header>

        <div className="settings-divider" />

        <SettingsCard>
          {PROFILE_ROWS.map((row) => (
            <SettingsRow key={row.label} {...row} />
          ))}
        </SettingsCard>

        <SettingsCard>
          {WORKSPACE_ROWS.map((row) => (
            <SettingsRow key={row.label} label={row.label} onClick={() => onNavigate?.(row.view)} />
          ))}
        </SettingsCard>

        <SettingsCard>
          {BILLING_ROWS.map((row) => (
            <SettingsRow key={row.label} label={row.label} onClick={row.view ? () => onNavigate?.(row.view) : undefined} />
          ))}
        </SettingsCard>

        <SettingsCard className="settings-card--security">
          <div className="settings-row settings-row--control">
            <strong>Notifications</strong>
            <Toggle enabled={notificationsEnabled} onToggle={setNotificationsEnabled} />
          </div>
          <div className="settings-row settings-row--control">
            <strong>Two-Factor Authentication</strong>
            <Toggle enabled={twoFactorEnabled} onToggle={setTwoFactorEnabled} />
          </div>
          <div className="settings-row settings-row--control">
            <strong>Sign out of all devices</strong>
            <button type="button" className="settings-outline-button" onClick={handleSignOutAllDevices}>
              Sign Out
            </button>
          </div>
          <div className="settings-row settings-row--control">
            <strong className="settings-danger-text">Delete Entire Account</strong>
            <button type="button" className="settings-outline-button settings-outline-button--danger" onClick={handleDeleteAccount}>
              Delete
            </button>
          </div>
        </SettingsCard>
      </div>

      <BottomAIStatusTools />
    </main>
  )
}