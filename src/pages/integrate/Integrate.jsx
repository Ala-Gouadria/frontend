import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import './Integrate.css'

import bgDot from '../../assets/background/BG Dot.png'
import miniLogo from '../../assets/logo/Nora_Componennts_Logo.png'
import facebookIcon from '../../assets/icons/Patch-Icon/Fb-icon.png'
import instagramIcon from '../../assets/icons/Patch-Icon/Instagram-icon.png'
import pinterestIcon from '../../assets/icons/Patch-Icon/Pinterest-icon.png'
import redditIcon from '../../assets/icons/Patch-Icon/Redit-icon.png'
import tiktokIcon from '../../assets/icons/Patch-Icon/Tiktok-icon.png'
import xIcon from '../../assets/icons/Patch-Icon/X-icon.png'

const INTEGRATIONS = [
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: pinterestIcon,
    description: 'Connect a Pinterest account so Nora can monitor performance, publish content, and track audience activity.',
    state: 'connect',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: facebookIcon,
    description: 'Connect a Facebook Page so Nora can monitor performance, publish content, and track audience activity.',
    state: 'synced',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: redditIcon,
    description: 'Connect a Reddit account so Nora can monitor performance, publish content, and track audience activity.',
    state: 'connect',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: instagramIcon,
    description: 'Connect an Instagram account so Nora can monitor performance, publish content, and track audience activity.',
    state: 'connect',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: xIcon,
    description: 'Connect an X account so Nora can monitor performance, publish content, and track audience activity.',
    state: 'connect',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: tiktokIcon,
    description: 'Connect a TikTok account so Nora can monitor performance, publish content, and track audience activity.',
    state: 'connect',
  },
]

function PlusIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7.6" />
      <path d="M9 5.8v6.4M5.8 9h6.4" />
    </svg>
  )
}

function SyncIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M13.8 5.5A5.7 5.7 0 0 0 4 7.1" />
      <path d="M13.8 3.2v2.3h-2.3" />
      <path d="M4.2 12.5A5.7 5.7 0 0 0 14 10.9" />
      <path d="M4.2 14.8v-2.3h2.3" />
    </svg>
  )
}

function IntegrationCard({ item, index, onConnect, onSync }) {
  const { t } = useTranslation()
  const isConnecting = item.state === 'connecting'
  const isSynced = item.state === 'synced'
  const isSyncing = item.state === 'syncing'

  return (
    <article
      className={`integrate-card ${isSynced || isSyncing ? 'integrate-card--synced' : ''} ${isConnecting ? 'integrate-card--connecting' : ''}`}
      style={{ '--integrate-delay': `${130 + index * 70}ms` }}
    >
      <div className="integrate-card__body">
        <div className="integrate-card__icon-shell">
          <img src={item.icon} alt="" className="integrate-card__icon" />
        </div>
        <div className="integrate-card__copy">
          <h2>{item.name}</h2>
          <p>{t(`integrate.platforms.${item.id}`, { defaultValue: item.description })}</p>
        </div>
      </div>

      <button
        type="button"
        className={`integrate-card__action ${
          isSynced || isSyncing ? 'integrate-card__action--synced' : ''
        } ${isConnecting ? 'integrate-card__action--connecting' : ''}`}
        onClick={() => {
          if (isSynced) {
            onSync(item.id)
          } else if (item.state === 'connect') {
            onConnect(item.id)
          }
        }}
        disabled={isConnecting || isSyncing}
        aria-label={
          isSynced
            ? `Sync ${item.name}`
            : isConnecting
            ? `Connecting to ${item.name}`
            : `Connect ${item.name}`
        }
      >
        <span>
          {isConnecting
            ? t('integrate.connecting')
            : isSyncing
            ? t('integrate.syncing')
            : isSynced
            ? t('integrate.synced')
            : t('integrate.connect')}
        </span>
        {isSynced || isSyncing || isConnecting ? (
          <SyncIcon className={isConnecting || isSyncing ? 'integrate-icon--spin' : ''} />
        ) : (
          <PlusIcon />
        )}
      </button>
    </article>
  )
}

export default function Integrate({ activeNavId = 'connect', onNavigate }) {
  const { t } = useTranslation()
  const [integrations, setIntegrations] = useState(INTEGRATIONS)

  const handleConnect = (id) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, state: 'connecting' } : item))
    )
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, state: 'synced' } : item))
      )
    }, 1500)
  }

  const handleSync = (id) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, state: 'syncing' } : item))
    )
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, state: 'synced' } : item))
      )
    }, 1200)
  }

  return (
    <main className="integrate-page" style={{ '--integrate-dot-bg': `url("${bgDot}")` }}>
      <Photo />
      <MainNav activeId={activeNavId} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="integrate-content" aria-labelledby="integrate-title">
        <header className="integrate-hero">
          <div className="integrate-kicker">
            <img src={miniLogo} alt="" />
            <span>{t('integrate.kicker')}</span>
          </div>
          <h1 id="integrate-title">
            <span>{t('integrate.title1')}</span> {t('integrate.title2')}
          </h1>
          <p>{t('integrate.subtitle')}</p>
        </header>

        <div className="integrate-divider" />

        <div className="integrate-grid">
          {integrations.map((item, index) => (
            <IntegrationCard
              key={item.id}
              item={item}
              index={index}
              onConnect={handleConnect}
              onSync={handleSync}
            />
          ))}
        </div>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
