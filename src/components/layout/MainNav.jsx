import { useMemo, useState } from 'react'

import StarsIcon from '../../assets/icons/Main-Nav-icons/StarsIcon.png'
import ConnectIcon from '../../assets/icons/Main-Nav-icons/ConnectIcon.png'
import DataBaseIcon from '../../assets/icons/Main-Nav-icons/DataBaseIcon.png'
import LayersIcon from '../../assets/icons/Main-Nav-icons/layersIcon.png'
import BubbleChatSparkIcon from '../../assets/icons/Main-Nav-icons/BubbleChatSparkIcon.png'
import AlbumIcon from '../../assets/icons/Main-Nav-icons/albumIcon.png'

const NAV_ITEMS = [
  { id: 'stars', icon: StarsIcon, label: 'AI Magic' },
  { id: 'connect', icon: ConnectIcon, label: 'Connect' },
  { id: 'database', icon: DataBaseIcon, label: 'Database' },
  { id: 'layers', icon: LayersIcon, label: 'Layers' },
  { id: 'chat', icon: BubbleChatSparkIcon, label: 'Chat' },
  { id: 'album', icon: AlbumIcon, label: 'Album' },
]

const BTN = 40
const GAP = 9
const PAD = 10

const ringY = (idx) => PAD + idx * (BTN + GAP)

export default function MainNav({ activeId, onSelect }) {
  const [uncontrolledActive, setUncontrolledActive] = useState(0)
  const [ripple, setRipple] = useState(null)
  const controlledIndex = useMemo(() => NAV_ITEMS.findIndex((item) => item.id === activeId), [activeId])
  const active = activeId === null ? -1 : controlledIndex >= 0 ? controlledIndex : uncontrolledActive

  const handleSelect = (idx) => {
    if (controlledIndex < 0 && idx !== active) {
      setUncontrolledActive(idx)
    }

    if (idx !== active) {
      setRipple({ idx, key: Date.now() })
    }

    onSelect?.(NAV_ITEMS[idx].id, idx)
  }

  return (
    <>
      <style>{CSS(BTN, GAP, PAD)}</style>

      <div className="mnav-shell">
        <nav className="mnav" aria-label="Main navigation">
          <div className="mnav-pill">
            <div
              className="mnav-ring"
              style={{
                opacity: active >= 0 ? 1 : 0,
                transform: `translateX(-50%) translateY(${ringY(Math.max(active, 0))}px)`,
              }}
            />

            <ul className="mnav-list">
              {NAV_ITEMS.map(({ id, icon, label }, idx) => {
                const isActive = active === idx

                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`mnav-btn${isActive ? ' mnav-btn--on' : ''}`}
                      onClick={() => handleSelect(idx)}
                      aria-label={label}
                      aria-pressed={isActive}
                    >
                      {ripple?.idx === idx && <span key={ripple.key} className="mnav-ripple" />}

                      <img
                        src={icon}
                        alt=""
                        aria-hidden="true"
                        className={`mnav-icon${isActive ? ' mnav-icon--on' : ''}`}
                        draggable={false}
                      />

                      <span className="mnav-tip">{label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>
    </>
  )
}

const CSS = (btn, gap, pad) => `
  .mnav-shell {
    position: fixed;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
  }

  .mnav {
    padding: 5px;
    border-radius: 999px;
    background: rgba(255,255,255,0.98);
    box-shadow:
      0 16px 30px rgba(15,23,42,0.10),
      0 5px 12px rgba(15,23,42,0.05),
      0 1px 0 rgba(255,255,255,0.92) inset,
      0 0 0 1px rgba(255,255,255,0.78);
    animation: nav-in 0.38s cubic-bezier(0.34,1.2,0.64,1);
  }

  .mnav-pill {
    position: relative;
    display: flex;
    justify-content: center;
    width: 52px;
    padding: ${pad}px 0;
    border-radius: 999px;
    background: linear-gradient(180deg, #f7f7f5 0%, #eeeeec 100%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.95),
      inset 0 -1px 4px rgba(15,23,42,0.05);
  }

  .mnav-ring {
    position: absolute;
    left: 50%;
    top: 0;
    width: ${btn}px;
    height: ${btn}px;
    border-radius: 50%;
    background:
      linear-gradient(#ffffff, #ffffff) padding-box,
      linear-gradient(135deg, #65a1ff 0%, #7e83ff 56%, #e5abe6 100%) border-box;
    border: 2px solid transparent;
    box-shadow:
      0 6px 14px rgba(109,137,255,0.16),
      0 2px 7px rgba(240,180,221,0.12);
    transition: transform 0.42s cubic-bezier(0.34,1.45,0.64,1);
    pointer-events: none;
    z-index: 0;
  }

  .mnav-list {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${gap}px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .mnav-btn {
    position: relative;
    width: ${btn}px;
    height: ${btn}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.18s cubic-bezier(0.4,0,0.2,1);
  }

  .mnav-list li:first-child .mnav-btn:not(.mnav-btn--on) {
    background: rgba(230,230,228,0.92);
  }

  .mnav-btn:hover {
    transform: scale(1.04);
  }

  .mnav-btn:active {
    transform: scale(0.93);
  }

  .mnav-btn:focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 3px;
  }

  .mnav-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
    pointer-events: none;
    opacity: 0.5;
    filter: grayscale(1) brightness(0.62) contrast(0.86);
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    backface-visibility: hidden;
    transform: translateZ(0);
    transition:
      opacity 0.22s ease,
      filter 0.22s ease,
      transform 0.34s cubic-bezier(0.34,1.45,0.64,1);
  }

  .mnav-icon--on {
    opacity: 1;
    filter: grayscale(0) brightness(0.9) contrast(1.1);
    transform: scale(1) translateZ(0);
    animation: icon-pop 0.34s cubic-bezier(0.34,1.45,0.64,1) forwards;
  }

  .mnav-ripple {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(92,140,255,0.18) 0%, transparent 72%);
    animation: ripple-out 0.42s ease-out forwards;
    pointer-events: none;
  }

  .mnav-tip {
    position: absolute;
    right: calc(100% + 16px);
    top: 50%;
    transform: translateY(-50%) translateX(8px);
    padding: 5px 12px;
    border-radius: 10px;
    white-space: nowrap;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #fff;
    background: rgba(15,23,42,0.9);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.22s ease, transform 0.22s ease;
    z-index: 100;
  }

  .mnav-tip::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left-color: rgba(15,23,42,0.9);
  }

  .mnav-btn:hover .mnav-tip {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  @keyframes nav-in {
    from { opacity: 0; transform: translateX(-18px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes icon-pop {
    0% { transform: scale(0.88) translateZ(0); }
    60% { transform: scale(1.08) translateZ(0); }
    100% { transform: scale(1.02) translateZ(0); }
  }

  @keyframes ripple-out {
    0% { transform: scale(0.3); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  @media (max-width: 768px) {
    .mnav-shell {
      left: 16px;
    }
  }
`
