import { useState } from 'react'
import './SocialMediaStuffsCardShared.css'
import './CaptionGenerationCard.css'
import { AiInsight, AiActionButton } from '../../visuals-parts'

const defaultCaptions = [
  `Most people don't fail because they lack talent.\nThey fail because they lack consistency.\n\nYou don't need a perfect plan.\nYou need to show up — even on the days you don't feel like it.\n\nThe ones who win are the ones who keep going when it's boring, slow, and unnoticed.\n\nStart small. Stay consistent. Watch what happens.\n\nIf you're serious about changing your life, type "START" below.`,
  `Your brand voice matters more than your posting frequency.\n\nOne powerful caption beats ten empty ones.\n\nStop chasing trends. Start creating value.\n\nDrop a 🔥 if this hit different.`,
  `The algorithm rewards consistency.\nBut your audience rewards authenticity.\n\nGive them both.`,
]

const defaultBatch = [
  { label: 'Instagram Live Hack posts', count: '12 Images' },
  { label: 'Facebook Video Tutorials',  count: '8 Images'  },
  { label: 'Twitter Engagement Tips',   count: '10 Images' },
]

export function CaptionGenerationCard({
  status         = 'Active',
  batchLabel     = 'Instagram Live Hack posts',
  batchProgress  = 7,
  batchTotal     = 12,
  captions       = defaultCaptions,
  upcomingBatch  = defaultBatch,
  aiText         = 'Users are saving educational posts more than other content',
  className      = '',
}) {
  const [index, setIndex] = useState(0)
  const [generating, setGenerating] = useState(false)

  function navigate(dir) {
    setGenerating(true)
    setTimeout(() => {
      setIndex((prev) => (prev + dir + captions.length) % captions.length)
      setGenerating(false)
    }, 600)
  }

  return (
    <div className={`analytics-card ${className}`}>
      <div className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">Caption Generation</h2>
          <p className="analytics-card__subtitle">Batch caption production</p>
        </div>
        <span className="analytics-card__status">{status}</span>
      </div>

      <div>
        <p className="analytics-card__section-title">Current Batch</p>
        <div className="smp-card__batch-bar">
          <span className="smp-card__batch-dot" />
          <span className="smp-card__batch-label">{batchLabel}</span>
          <span className="smp-card__batch-count">{batchProgress}/{batchTotal}</span>
        </div>
      </div>

      <div className="cg-card__caption-panel">
        <div className="cg-card__caption-header">
          <span className="cg-card__caption-num">Caption {index + 1}</span>
          {generating
            ? <span className="cg-card__generating">Generating…</span>
            : <span className="cg-card__generating cg-card__generating--done">Ready</span>}
        </div>
        <div className={`cg-card__caption-body ${generating ? 'cg-card__caption-body--loading' : ''}`}>
          {generating
            ? <span className="cg-card__spinner" />
            : <p className="cg-card__caption-text">{captions[index]}</p>}
        </div>
        <div className="cg-card__pagination">
          <button onClick={() => navigate(-1)}>‹</button>
          <span>{index + 1}/{captions.length}</span>
          <button onClick={() => navigate(1)}>›</button>
        </div>
      </div>

      <div className="smc-card__upcoming-panel">
        <div className="smc-card__upcoming-title">Upcoming Batch</div>
        <div className="smc-card__upcoming-body">
          {upcomingBatch.map(item => (
            <div key={item.label} className="smc-card__upcoming-row">
              <span className="smc-card__upcoming-dot" />
              <span className="smc-card__upcoming-label">{item.label}</span>
              <span className="smc-card__upcoming-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <AiInsight>{aiText}</AiInsight>
      <AiActionButton />
    </div>
  )
}

export default CaptionGenerationCard