import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { facebookApi } from '../../api/integrationsApi'
import SocialInsightsCard from '../../components/social/SocialInsightsCard'
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
    state: 'connect',
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

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

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

// Providers that connect through the real Meta OAuth flow (Instagram rides on
// the connected Facebook Page).
const META_PROVIDERS = new Set(['facebook', 'instagram'])

export default function Integrate({ activeNavId = 'connect', onNavigate }) {
  const { t } = useTranslation()
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  // Banner from the OAuth return (?fb=connected|error), computed once at mount.
  const [notice, setNotice] = useState(() => {
    const p = new URLSearchParams(window.location.search)
    const fb = p.get('fb')
    if (fb === 'connected') return 'Facebook connected.'
    if (fb === 'error') return `Facebook connection failed: ${p.get('reason') || 'unknown error'}`
    return ''
  })

  const [posts, setPosts] = useState([])

  const setState = (ids, state) =>
    setIntegrations((prev) => prev.map((it) => (ids.includes(it.id) ? { ...it, state } : it)))

  // Pull the connected page's recent posts (across FB + IG), newest first.
  const loadPosts = () => {
    facebookApi
      .posts()
      .then((groups) => {
        const flat = (Array.isArray(groups) ? groups : []).flatMap((g) =>
          (g.posts || []).map((p) => ({ platform: g.platform, page: g.page?.name, ...p })),
        )
        flat.sort((a, b) => new Date(b.createdTime || 0) - new Date(a.createdTime || 0))
        setPosts(flat.slice(0, 12))
      })
      .catch(() => {})
  }

  // Reflect the real Meta connection on the Facebook + Instagram cards, load the
  // recent posts when connected, and clean the ?fb param from the URL.
  useEffect(() => {
    let cancelled = false

    if (new URLSearchParams(window.location.search).get('fb')) {
      window.history.replaceState({}, '', window.location.pathname)
    }

    facebookApi
      .status()
      .then((s) => {
        if (cancelled) return
        const connected = Boolean(s?.connected)
        const hasInstagram = connected && (s.pages || []).some((p) => p.instagram)
        setState(['facebook'], connected ? 'synced' : 'connect')
        setState(['instagram'], hasInstagram ? 'synced' : 'connect')
        if (connected) loadPosts()
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const handleConnect = async (id) => {
    // Real OAuth for Meta providers: redirect the browser to Facebook's dialog.
    if (META_PROVIDERS.has(id)) {
      setState([id], 'connecting')
      try {
        const url = await facebookApi.connectUrl()
        if (url) {
          window.location.href = url
          return
        }
        setNotice('Could not start Facebook connection — is the backend configured?')
        setState([id], 'connect')
      } catch {
        setNotice('Could not start Facebook connection. Please try again.')
        setState([id], 'connect')
      }
      return
    }

    // Other providers are still placeholders.
    setState([id], 'connecting')
    setTimeout(() => setState([id], 'synced'), 1500)
  }

  const handleSync = async (id) => {
    // Meta providers: pull real posts/campaigns + refresh Nora's memory.
    if (META_PROVIDERS.has(id)) {
      setState([id], 'syncing')
      try {
        const r = await facebookApi.sync()
        setNotice(`Synced ${r?.posts ?? 0} posts and ${r?.campaigns ?? 0} campaigns into Nora.`)
        loadPosts()
      } catch {
        setNotice('Sync failed — reconnect Facebook and try again.')
      }
      setState([id], 'synced')
      return
    }

    setState([id], 'syncing')
    setTimeout(() => setState([id], 'synced'), 1200)
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

        {notice && (
          <div className="integrate-notice" role="status">
            {notice}
            <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">×</button>
          </div>
        )}

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

        <SocialInsightsCard posts={posts} />

        {posts.length > 0 && (
          <section className="integrate-synced" aria-label="Recent synced content">
            <h2 className="integrate-synced__title">Recent synced content</h2>
            <ul className="synced-list">
              {posts.map((p) => (
                <li key={`${p.platform}-${p.id}`} className="synced-post">
                  <img
                    className="synced-post__icon"
                    src={p.platform === 'instagram' ? instagramIcon : facebookIcon}
                    alt={p.platform}
                  />
                  <div className="synced-post__body">
                    <p className="synced-post__msg">{p.message?.trim() || '(no caption)'}</p>
                    <span className="synced-post__meta">
                      {fmtDate(p.createdTime)} · {p.reactions ?? 0} reactions · {p.comments ?? 0} comments
                      {p.shares ? ` · ${p.shares} shares` : ''}
                    </span>
                  </div>
                  {p.permalink && (
                    <a className="synced-post__link" href={p.permalink} target="_blank" rel="noreferrer">
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
