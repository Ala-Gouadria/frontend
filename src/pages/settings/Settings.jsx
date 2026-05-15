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

function Toggle({ enabled = true }) {
  return (
    <button type="button" className={`settings-toggle ${enabled ? 'settings-toggle--on' : ''}`} aria-pressed={enabled}>
      <span />
    </button>
  )
}

export default function Settings({ onNavigate }) {
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
            <Toggle />
          </div>
          <div className="settings-row settings-row--control">
            <strong>Two-Factor Authentication</strong>
            <Toggle />
          </div>
          <div className="settings-row settings-row--control">
            <strong>Sign out of all devices</strong>
            <button type="button" className="settings-outline-button">Sign Out</button>
          </div>
          <div className="settings-row settings-row--control">
            <strong className="settings-danger-text">Delete Entire Account</strong>
            <button type="button" className="settings-outline-button settings-outline-button--danger">Delete</button>
          </div>
        </SettingsCard>
      </div>

      <BottomAIStatusTools />
    </main>
  )
}
