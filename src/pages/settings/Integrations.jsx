import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { integrationsApi } from '../../api/integrationsApi'
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
}

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

export default function Integrations({ onNavigate }) {
  const { t } = useTranslation()
  const [integrations, setIntegrations] = useState([])
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    integrationsApi.listIntegrations().then((items) => {
      if (isMounted) {
        setIntegrations(items)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const toggleConnection = async (integration) => {
    setPendingId(integration.id)
    const updated = await integrationsApi.setConnection(integration.id, !integration.connected)

    setIntegrations((items) => items.map((item) => (
      item.id === updated.id ? updated : item
    )))
    setPendingId(null)
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
          {integrations.map((integration) => (
            <article className="integration-card" key={integration.id}>
              <img src={ICONS[integration.iconKey]} alt="" aria-hidden="true" className="integration-card__icon" />
              <div className="integration-card__copy">
                <h2>{integration.name}</h2>
                <p>{integration.description}</p>
              </div>
              <button
                type="button"
                className={`integration-card__button ${integration.connected ? 'integration-card__button--connected' : ''}`}
                onClick={() => toggleConnection(integration)}
                disabled={pendingId === integration.id}
                aria-pressed={integration.connected}
              >
                <span>{integration.connected ? t('integrations.connected') : t('integrations.connect')}</span>
                <PlusIcon />
              </button>
            </article>
          ))}
        </div>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
