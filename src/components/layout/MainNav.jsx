import { useMemo, useState } from 'react'
import './MainNav.css'

import StarsIcon from '../../assets/icons/Main-Nav-icons/StarsIcon.svg'
import ConnectIcon from '../../assets/icons/Main-Nav-icons/ConnectIcon.svg'
import DataBaseIcon from '../../assets/icons/Main-Nav-icons/DataBaseIcon.svg'
import LayersIcon from '../../assets/icons/Main-Nav-icons/layersIcon.svg'
import BubbleChatSparkIcon from '../../assets/icons/Main-Nav-icons/BubbleChatSparkIcon.svg'
import AlbumIcon from '../../assets/icons/Main-Nav-icons/albumIcon.svg'

const NAV_ITEMS = [
  { id: 'stars', icon: StarsIcon, label: 'AI Magic' },
  { id: 'connect', icon: ConnectIcon, label: 'Connect' },
  { id: 'database', icon: DataBaseIcon, label: 'Database' },
  { id: 'layers', icon: LayersIcon, label: 'Layers' },
  { id: 'chat', icon: BubbleChatSparkIcon, label: 'Chat' },
  { id: 'album', icon: AlbumIcon, label: 'Album' },
]

const BTN = 46
const GAP = 12
const PAD = 10

const ringY = (idx) => PAD + idx * (BTN + GAP)

export default function MainNav({ activeId, onSelect }) {
  const [uncontrolledActive, setUncontrolledActive] = useState(0)
  const controlledIndex = useMemo(() => NAV_ITEMS.findIndex((item) => item.id === activeId), [activeId])
  const active = activeId === null ? -1 : controlledIndex >= 0 ? controlledIndex : uncontrolledActive

  const handleSelect = (idx) => {
    if (controlledIndex < 0 && idx !== active) {
      setUncontrolledActive(idx)
    }

    onSelect?.(NAV_ITEMS[idx].id, idx)
  }

  const headItem = NAV_ITEMS[0]
  const isHeadActive = active === 0

  return (
    <div className="mnav-shell">
      <nav className="mnav" aria-label="Main navigation">
        <button
          type="button"
          className={`mnav-head${isHeadActive ? ' mnav-head--on' : ''}`}
          onClick={() => handleSelect(0)}
          aria-label={headItem.label}
          aria-pressed={isHeadActive}
          title={headItem.label}
        >
          <img
            src={headItem.icon}
            alt=""
            aria-hidden="true"
            className={`mnav-icon${isHeadActive ? ' mnav-icon--on' : ''}`}
            draggable={false}
          />
        </button>

        <div className="mnav-pill">
          <div
            className="mnav-ring"
            style={{
              opacity: active >= 1 ? 1 : 0,
              transform: `translateX(-50%) translateY(${ringY(Math.max(active - 1, 0))}px)`,
            }}
          />

          <ul className="mnav-list">
            {NAV_ITEMS.slice(1).map(({ id, icon, label }, i) => {
              const idx = i + 1
              const isActive = active === idx

              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`mnav-btn${isActive ? ' mnav-btn--on' : ''}`}
                    onClick={() => handleSelect(idx)}
                    aria-label={label}
                    aria-pressed={isActive}
                    title={label}
                  >
                    <img
                      src={icon}
                      alt=""
                      aria-hidden="true"
                      className={`mnav-icon${isActive ? ' mnav-icon--on' : ''}`}
                      draggable={false}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}
