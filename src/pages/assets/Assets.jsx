import { useEffect, useMemo, useState } from 'react'

import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import ProjectList from '../../components/layout/ProjectList'
import { BottomAIStatusTools } from '../../components/bottom-ai/BottomAITools'
import { assetsApi } from '../../api/assetsApi'
import brandLogo from '../../assets/logo/Nora_Componennts_Logo.png'
import './Assets.css'

const CATEGORIES = ['Images', 'Posts', 'Captions']
const DURATIONS = ['All', 'Today', 'Weekly', 'Monthly', 'Custom', 'Jan 1 - Jan 31']

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3v8M6.8 8.1 10 11.3l3.2-3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.2 13.5v1.2c0 .9.7 1.6 1.6 1.6h8.4c.9 0 1.6-.7 1.6-1.6v-1.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SocialIcon({ type }) {
  if (type === 'bookmark') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="M5.4 3.5h7.2v11l-3.6-2-3.6 2v-11Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'comment') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="M4 5.2c0-1 0.8-1.8 1.8-1.8h6.4c1 0 1.8.8 1.8 1.8v4.3c0 1-.8 1.8-1.8 1.8H8.4l-3.1 2.1v-2.1c-.8-.2-1.3-.9-1.3-1.8V5.2Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'send') {
    return (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path d="m3.4 3.8 11.2 5.1-11.2 5.1 1.6-4.5 5.3-.6-5.3-.6-1.6-4.6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M9 14.2S3.5 11 3.5 6.8c0-1.6 1.2-2.8 2.7-2.8 1 0 1.9.6 2.4 1.4C9.1 4.6 10 4 11 4c1.5 0 2.7 1.2 2.7 2.8 0 4.2-4.7 7.4-4.7 7.4Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function SegmentedControl({ label, items, value, onChange }) {
  return (
    <div className="assets-control">
      <strong>{label}</strong>
      <div className="assets-segmented">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={value === item ? 'assets-segmented__button assets-segmented__button--active' : 'assets-segmented__button'}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function ImageCard({ item, index }) {
  return (
    <article className="asset-image-card" style={{ '--asset-delay': `${index * 45}ms` }}>
      <img src={item.src} alt={item.title} loading="lazy" />
      <div className="asset-image-card__overlay">
        <span>{item.date}</span>
        <button type="button" aria-label={`Download ${item.title}`}>
          <DownloadIcon />
        </button>
      </div>
    </article>
  )
}

function BrandHeader({ compact = false }) {
  return (
    <div className={compact ? 'asset-post__brand asset-post__brand--compact' : 'asset-post__brand'}>
      <img src={brandLogo} alt="" aria-hidden="true" />
      <div>
        <strong>XWorldLTD</strong>
        <span>Manchester, United Kingdom</span>
      </div>
    </div>
  )
}

function PostCard({ item, index }) {
  return (
    <article className="asset-post-card" style={{ '--asset-delay': `${index * 45}ms` }}>
      <BrandHeader />
      {item.image ? <img src={item.image} alt="" aria-hidden="true" className="asset-post-card__image" loading="lazy" /> : null}
      <p>{item.text}</p>
      <div className="asset-social-row">
        <SocialIcon />
        <SocialIcon type="comment" />
        <SocialIcon type="send" />
        <span />
        <SocialIcon type="bookmark" />
      </div>
    </article>
  )
}

function CaptionCard({ item, index }) {
  return (
    <article className="asset-caption-card" style={{ '--asset-delay': `${index * 45}ms` }}>
      <BrandHeader compact />
      <p>{item.text}</p>
      <div className="asset-social-row">
        <SocialIcon />
        <SocialIcon type="comment" />
        <SocialIcon type="send" />
        <span />
        <SocialIcon type="bookmark" />
      </div>
    </article>
  )
}

export default function Assets({ onNavigate }) {
  const [assets, setAssets] = useState({ images: [], posts: [], captions: [] })
  const [category, setCategory] = useState('Images')
  const [duration, setDuration] = useState('Custom')

  useEffect(() => {
    let isMounted = true

    assetsApi.getProjectAssets().then((items) => {
      if (isMounted) {
        setAssets(items)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const sections = useMemo(() => {
    const selected = category.toLowerCase()

    if (selected === 'images') {
      return ['images', 'posts', 'captions']
    }

    if (selected === 'posts') {
      return ['posts', 'images', 'captions']
    }

    return ['captions', 'images', 'posts']
  }, [category])

  return (
    <main className="assets-page">
      <Photo />
      <MainNav activeId="album" onSelect={onNavigate} />
      <ProjectList onNavigate={onNavigate} />

      <section className="assets-content">
        <header className="assets-header">
          <h1>Assets</h1>
          <p>Manage your assets here</p>
        </header>

        <div className="assets-divider" />

        <div className="assets-toolbar">
          <SegmentedControl label="Category" items={CATEGORIES} value={category} onChange={setCategory} />
          <SegmentedControl label="Duration" items={DURATIONS} value={duration} onChange={setDuration} />
        </div>

        {sections.map((section) => {
          if (section === 'images') {
            return (
              <section className="assets-section" key={section}>
                <h2>Images</h2>
                <div className="assets-image-grid">
                  {assets.images.map((item, index) => <ImageCard key={item.id} item={item} index={index} />)}
                </div>
              </section>
            )
          }

          if (section === 'posts') {
            return (
              <section className="assets-section" key={section}>
                <h2>Posts</h2>
                <div className="assets-post-grid">
                  {assets.posts.map((item, index) => <PostCard key={item.id} item={item} index={index} />)}
                </div>
              </section>
            )
          }

          return (
            <section className="assets-section" key={section}>
              <h2>Captions</h2>
              <div className="assets-caption-grid">
                {assets.captions.map((item, index) => <CaptionCard key={item.id} item={item} index={index} />)}
              </div>
            </section>
          )
        })}
      </section>

      <BottomAIStatusTools />
    </main>
  )
}
