import { useMemo, useState } from 'react'
import './MainNav.css'

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

const BTN = 44
const GAP = 8
const PAD = 8

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

  return (
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
