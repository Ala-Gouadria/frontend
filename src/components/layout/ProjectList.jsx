import { useEffect, useRef, useState } from 'react'
import './ProjectList.css'
import xWorldLogo from '../../assets/logo/Nora_Componennts_Logo.png'

const PROJECTS = [
  {
    id: 1,
    name: 'XWorldLTD',
    variant: 'xworld',
  },
  {
    id: 2,
    name: 'ZynovaStudio',
    variant: 'zynova',
  },
]

const BALANCE = {
  total: '10,000 Credits',
  remaining: '1,649',
}

function ProjectAvatar({ variant, className = '' }) {
  if (variant === 'xworld') {
    return (
      <div className={`project-brand project-brand--xworld ${className}`}>
        <img src={xWorldLogo} alt="" className="project-brand__img" />
      </div>
    )
  }

  return (
    <div className={`project-brand project-brand--zynova ${className}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="project-brand__svg">
        <defs>
          <linearGradient id="zynova-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#177cff" />
            <stop offset="100%" stopColor="#0f4ce0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#zynova-bg)" />
        <path d="M33 30H66L43 56H61L34 72H56" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ProjectChevron({ open }) {
  return (
    <svg className={`project-trigger__chevron ${open ? 'project-trigger__chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 9L12 4L17 9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15L12 20L17 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectBell() {
  return (
    <span className="project-trigger__bell" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M18 9.7C18 6.2 15.6 3.8 12 3.8S6 6.2 6 9.7v3.1l-1.5 2.5c-.3.6.1 1.2.8 1.2h13.4c.7 0 1.1-.7.8-1.2L18 12.8V9.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.6 18.2c.5 1 1.3 1.5 2.4 1.5s1.9-.5 2.4-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export default function ProjectList({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [active, setActive] = useState(PROJECTS[0])
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setClosing(true)
        window.setTimeout(() => {
          setOpen(false)
          setClosing(false)
        }, 180)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleClose = () => {
    setClosing(true)
    window.setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 180)
  }

  const toggleOpen = () => {
    if (open) {
      handleClose()
      return
    }

    setOpen(true)
  }

  const selectProject = (project) => {
    setActive(project)
    handleClose()
  }

  const openSettings = () => {
    handleClose()
    onNavigate?.('settings')
  }

  return (
    <div className="project-list" ref={wrapperRef}>
      <button
        type="button"
        className={`project-trigger ${open ? 'project-trigger--open' : ''}`}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ProjectBell />
        <ProjectAvatar variant={active.variant} className="project-trigger__avatar" />
        <span className="project-trigger__name">{active.name}</span>
        <ProjectChevron open={open} />
      </button>

      {open && (
        <div className={`project-dropdown ${closing ? 'project-dropdown--closing' : ''}`} role="listbox">
          <div className="project-dropdown__surface">
            <div className="project-dropdown__stack">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`project-card ${active.id === project.id ? 'project-card--active' : ''}`}
                  onClick={() => selectProject(project)}
                  role="option"
                  aria-selected={active.id === project.id}
                >
                  <ProjectAvatar variant={project.variant} className="project-card__avatar" />
                  <span className="project-card__name">{project.name}</span>
                </button>
              ))}
            </div>

            <div className="project-balance">
              <div className="project-balance__header">
                <div className="project-balance__label">
                  <span className="project-balance__ring" aria-hidden="true" />
                  <span>Balance</span>
                </div>
                <button type="button" className="project-balance__upgrade">
                  Upgrade
                </button>
              </div>

              <div className="project-balance__rows">
                <div className="project-balance__row">
                  <span className="project-balance__muted">Total</span>
                  <span className="project-balance__value">{BALANCE.total}</span>
                </div>
                <div className="project-balance__row">
                  <span className="project-balance__muted">Remaining</span>
                  <span className="project-balance__value">{BALANCE.remaining}</span>
                </div>
              </div>
            </div>

            <div className="project-dropdown__links">
              <button type="button" className="project-dropdown__link" onClick={openSettings}>Settings</button>
              <button type="button" className="project-dropdown__link" onClick={handleClose}>Upgrade Your Plan</button>
              <button type="button" className="project-dropdown__link project-dropdown__link--danger" onClick={handleClose}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
