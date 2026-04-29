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

function SyncIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M13.8 5.5A5.7 5.7 0 0 0 4 7.1" />
      <path d="M13.8 3.2v2.3h-2.3" />
      <path d="M4.2 12.5A5.7 5.7 0 0 0 14 10.9" />
      <path d="M4.2 14.8v-2.3h2.3" />
    </svg>
  )
}

function IntegrationCard({ item, index }) {
  const synced = item.state === 'synced'

  return (
    <article
      className={`integrate-card ${synced ? 'integrate-card--synced' : ''}`}
      style={{ '--integrate-delay': `${130 + index * 70}ms` }}
    >
      <div className="integrate-card__body">
        <div className="integrate-card__icon-shell">
          <img src={item.icon} alt="" className="integrate-card__icon" />
        </div>
        <div className="integrate-card__copy">
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      </div>

      <button
        type="button"
        className={`integrate-card__action ${synced ? 'integrate-card__action--synced' : ''}`}
        aria-label={synced ? `${item.name} synced` : `Connect ${item.name}`}
      >
        <span>{synced ? 'Synced' : 'Connect'}</span>
        {synced ? <SyncIcon /> : <PlusIcon />}
      </button>
    </article>
  )
}

export default function Integrate({ activeNavId = 'connect', onNavigate }) {
  return (
    <main className="integrate-page" style={{ '--integrate-dot-bg': `url("${bgDot}")` }}>
      <Photo />
      <MainNav activeId={activeNavId} onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="integrate-content" aria-labelledby="integrate-title">
        <header className="integrate-hero">
          <div className="integrate-kicker">
            <img src={miniLogo} alt="" />
            <span>Nora tracks and automates your social media</span>
          </div>
          <h1 id="integrate-title">
            <span>INTEGRATE</span> SOCIAL MEDIA
          </h1>
          <p>
            Connect your social media accounts to unlock real-time performance tracking and seamless automation.
          </p>
        </header>

        <div className="integrate-divider" />

        <div className="integrate-grid">
          {INTEGRATIONS.map((item, index) => (
            <IntegrationCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
