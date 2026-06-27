import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { integrationsApi, googleApi, hubspotApi, shopifyApi, linkedinApi, ahrefsApi, mixpanelApi } from '../../api/integrationsApi'
import openAiIcon from '../../assets/icons/Integration-Icon/Group 140097.png'
import vimeoIcon from '../../assets/icons/Integration-Icon/vimeo.png'
import shopifyIcon from '../../assets/icons/Integration-Icon/Group 140090.png'
import notionIcon from '../../assets/icons/Integration-Icon/vector.png'
import googleAdsIcon from '../../assets/icons/Integration-Icon/Google_Ads_icon.png'
import stripeIcon from '../../assets/icons/Integration-Icon/Group 140091.png'
import slackIcon from '../../assets/icons/Integration-Icon/Slack-icon.png'
import discordIcon from '../../assets/icons/Integration-Icon/Discrod-Icon.webp'
import gmailIcon from '../../assets/icons/Integration-Icon/gmail.png'
import githubIcon from '../../assets/icons/Integration-Icon/Vector (1).png'
import paypalIcon from '../../assets/icons/Integration-Icon/paypal.png'
import './SettingsWorkspace.css'

const ICONS = {
  openAi: openAiIcon,
  vimeo: vimeoIcon,
  shopify: shopifyIcon,
  notion: notionIcon,
  googleAds: googleAdsIcon,
  stripe: stripeIcon,
  slack: slackIcon,
  discord: discordIcon,
  gmail: gmailIcon,
  github: githubIcon,
  paypal: paypalIcon,
  // Analytics integrations - use Google Ads icon for Google Analytics temporarily
  google: googleAdsIcon,
  hubspot: stripeIcon, // placeholder - similar color scheme
  linkedin: githubIcon, // placeholder
  ahrefs: vimeoIcon, // placeholder
  mixpanel: openAiIcon, // placeholder
}

// OAuth providers that need redirect flow
const OAUTH_PROVIDERS = {
  google: googleApi,
  hubspot: hubspotApi,
  shopify: shopifyApi,
  linkedin: linkedinApi,
}

// API key providers that need configuration modal
const API_KEY_PROVIDERS = ['ahrefs', 'mixpanel']

function PlusIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className="workspace-plus-icon">
      <circle cx="9" cy="9" r="7.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 5.4v7.2M5.4 9h7.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" width="20" height="20">
      <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

// Modal for API key configuration
function ApiKeyModal({ integration, onClose, onSave }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to configure integration')
    } finally {
      setSaving(false)
    }
  }

  const renderFields = () => {
    if (integration.id === 'ahrefs') {
      return (
        <>
          <div className="modal-field">
            <label htmlFor="apiKey">API Key</label>
            <input
              id="apiKey"
              type="password"
              placeholder="Enter your Ahrefs API key"
              value={formData.apiKey || ''}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="domain">Domain</label>
            <input
              id="domain"
              type="text"
              placeholder="example.com"
              value={formData.domain || ''}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              required
            />
          </div>
        </>
      )
    }

    if (integration.id === 'mixpanel') {
      return (
        <>
          <div className="modal-field">
            <label htmlFor="serviceAccountId">Service Account ID</label>
            <input
              id="serviceAccountId"
              type="text"
              placeholder="Enter service account ID"
              value={formData.serviceAccountId || ''}
              onChange={(e) => setFormData({ ...formData, serviceAccountId: e.target.value })}
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="secret">Secret</label>
            <input
              id="secret"
              type="password"
              placeholder="Enter service account secret"
              value={formData.secret || ''}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="projectId">Project ID</label>
            <input
              id="projectId"
              type="text"
              placeholder="Enter project ID"
              value={formData.projectId || ''}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            />
          </div>
        </>
      )
    }

    if (integration.id === 'shopify') {
      return (
        <div className="modal-field">
          <label htmlFor="shop">Shopify Store Domain</label>
          <input
            id="shop"
            type="text"
            placeholder="your-store.myshopify.com"
            value={formData.shop || ''}
            onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
            required
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>
        <h2>Configure {integration.name}</h2>
        <p>{integration.description}</p>

        <form onSubmit={handleSubmit}>
          {renderFields()}
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Integrations({ onNavigate }) {
  const { t } = useTranslation()
  const [integrations, setIntegrations] = useState([])
  const [pendingId, setPendingId] = useState(null)
  const [oauthStatuses, setOauthStatuses] = useState({})
  const [configModal, setConfigModal] = useState(null) // { integration } or null

  // Load integrations and OAuth statuses
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      // Load basic integrations
      const items = await integrationsApi.listIntegrations()
      if (!isMounted) return
      setIntegrations(items)

      // Load OAuth statuses for special providers
      const statuses = {}
      for (const provider of ['google', 'hubspot', 'shopify', 'linkedin']) {
        try {
          const api = OAUTH_PROVIDERS[provider]
          if (api) {
            statuses[provider] = await api.status()
          }
        } catch {
          statuses[provider] = { connected: false }
        }
      }

      // Load API key statuses
      try {
        statuses.ahrefs = await ahrefsApi.status()
      } catch {
        statuses.ahrefs = { connected: false }
      }
      try {
        statuses.mixpanel = await mixpanelApi.status()
      } catch {
        statuses.mixpanel = { connected: false }
      }

      if (isMounted) {
        setOauthStatuses(statuses)
      }
    }

    loadData()

    // Check URL params for OAuth callback results
    const params = new URLSearchParams(window.location.search)
    const providers = ['google', 'hubspot', 'shopify', 'linkedin']
    for (const provider of providers) {
      const status = params.get(provider)
      if (status === 'connected') {
        // Refresh statuses after successful OAuth
        loadData()
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
        break
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  const handleConnect = async (integration) => {
    setPendingId(integration.id)

    try {
      // Check if this is an OAuth provider
      if (OAUTH_PROVIDERS[integration.id]) {
        // Shopify requires shop domain first
        if (integration.id === 'shopify') {
          setConfigModal({ integration })
          setPendingId(null)
          return
        }

        const api = OAUTH_PROVIDERS[integration.id]
        const url = await api.connectUrl()
        if (url) {
          window.location.href = url
        }
        return
      }

      // Check if this is an API key provider
      if (API_KEY_PROVIDERS.includes(integration.id)) {
        setConfigModal({ integration })
        setPendingId(null)
        return
      }

      // Default: toggle via integrationsApi
      const updated = await integrationsApi.setConnection(integration.id, !integration.connected)
      setIntegrations((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      console.error('Connection error:', err)
    } finally {
      setPendingId(null)
    }
  }

  const handleDisconnect = async (integration) => {
    setPendingId(integration.id)
    try {
      if (OAUTH_PROVIDERS[integration.id]) {
        await OAUTH_PROVIDERS[integration.id].disconnect()
        setOauthStatuses((prev) => ({ ...prev, [integration.id]: { connected: false } }))
      } else if (integration.id === 'ahrefs') {
        await ahrefsApi.disconnect()
        setOauthStatuses((prev) => ({ ...prev, ahrefs: { connected: false } }))
      } else if (integration.id === 'mixpanel') {
        await mixpanelApi.disconnect()
        setOauthStatuses((prev) => ({ ...prev, mixpanel: { connected: false } }))
      } else {
        const updated = await integrationsApi.setConnection(integration.id, false)
        setIntegrations((items) => items.map((item) => (item.id === updated.id ? updated : item)))
      }
    } catch (err) {
      console.error('Disconnect error:', err)
    } finally {
      setPendingId(null)
    }
  }

  const handleApiKeyConfig = async (formData) => {
    if (configModal.integration.id === 'ahrefs') {
      await ahrefsApi.configure(formData)
      setOauthStatuses((prev) => ({ ...prev, ahrefs: { connected: true, ...formData } }))
    } else if (configModal.integration.id === 'mixpanel') {
      await mixpanelApi.configure(formData)
      setOauthStatuses((prev) => ({ ...prev, mixpanel: { connected: true, ...formData } }))
    } else if (configModal.integration.id === 'shopify') {
      const url = await shopifyApi.connectUrl(formData.shop)
      if (url) {
        window.location.href = url
      }
    }
  }

  const isConnected = (integration) => {
    // Check OAuth/API key statuses first
    if (oauthStatuses[integration.id]?.connected) return true
    // Fall back to generic integration status
    return integration.connected
  }

  const toggleConnection = (integration) => {
    if (isConnected(integration)) {
      handleDisconnect(integration)
    } else {
      handleConnect(integration)
    }
  }

  return (
    <main className="settings-workspace settings-workspace--integrations">
      <Photo />
      <MainNav activeId={null} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="settings-workspace__content settings-workspace__content--wide">
        <button type="button" className="workspace-back-button" onClick={() => onNavigate?.('settings')}>
          <BackIcon />
          <span>{t('integrations.backToSettings')}</span>
        </button>

        <header className="workspace-heading workspace-heading--integrations">
          <h1>{t('integrations.title')}</h1>
          <p>{t('integrations.subtitle')}</p>
        </header>

        <div className="integration-grid">
          {integrations.map((integration) => {
            const connected = isConnected(integration)
            const oauthStatus = oauthStatuses[integration.id]
            return (
              <article className="integration-card" key={integration.id}>
                <img src={ICONS[integration.iconKey]} alt="" aria-hidden="true" className="integration-card__icon" />
                <div className="integration-card__copy">
                  <h2>{integration.name}</h2>
                  <p>{integration.description}</p>
                  {connected && oauthStatus?.lastSyncAt && (
                    <span className="integration-card__sync-info">
                      Last synced: {new Date(oauthStatus.lastSyncAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className={`integration-card__button ${connected ? 'integration-card__button--connected' : ''}`}
                  onClick={() => toggleConnection(integration)}
                  disabled={pendingId === integration.id}
                  aria-pressed={connected}
                >
                  <span>
                    {pendingId === integration.id
                      ? 'Connecting...'
                      : connected
                        ? t('integrations.connected')
                        : t('integrations.connect')}
                  </span>
                  <PlusIcon />
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {configModal && (
        <ApiKeyModal
          integration={configModal.integration}
          onClose={() => setConfigModal(null)}
          onSave={handleApiKeyConfig}
        />
      )}

      <BottomAIStatusTools />
    </main>
  )
}
