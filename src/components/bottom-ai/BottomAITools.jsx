import './BottomAITools.css'

import { useState } from 'react'
import { useControls, useTransformEffect } from 'react-zoom-pan-pinch'

import cursorIcon from '../../assets/icons/Nora-AI-Icon/cursor-icon.svg'
import eyeIcon from '../../assets/icons/Nora-AI-Icon/eye-icon.svg'
import handIcon from '../../assets/icons/Nora-AI-Icon/four-finger-icon.svg'
import startIcon from '../../assets/icons/Nora-AI-Icon/Start-icon.svg'
import stopIcon from '../../assets/icons/Nora-AI-Icon/Stop-icon.svg'
import noraLogo from '../../assets/logo/Ask-Nora-Logo.png'

function BottomAIActionCluster({ onAskNora, onTaskOpen }) {
  const [isTaskRunning, setIsTaskRunning] = useState(false)

  const handleTaskToggle = () => {
    setIsTaskRunning(r => !r)
    onTaskOpen?.()
  }

  return (
    <>
      <button
        type="button"
        className="bottom-ai-tools__pill bottom-ai-tools__pill--ask"
        onClick={() => onAskNora?.('ask-nora')}
      >
        <img src={noraLogo} alt="" aria-hidden="true" className="bottom-ai-tools__logo-icon" />
        <span className="bottom-ai-tools__label">Ask Nora about your business</span>
      </button>

      <div className="bottom-ai-tools__status-group">
        <button
          type="button"
          className={`bottom-ai-tools__pill bottom-ai-tools__pill--task ${isTaskRunning ? 'bottom-ai-tools__pill--task--running' : ''}`}
          onClick={handleTaskToggle}
          aria-pressed={isTaskRunning}
          aria-label={isTaskRunning ? 'Stop task' : 'Start task'}
        >
          {/* Green fill layer — animates like a download bar */}
          <span className={`bottom-ai-tools__task-fill ${isTaskRunning ? 'bottom-ai-tools__task-fill--active' : ''}`} />

          <span className="bottom-ai-tools__task-icon-wrap">
            <img
              src={startIcon}
              alt=""
              aria-hidden="true"
              className={`bottom-ai-tools__task-icon bottom-ai-tools__task-icon--start ${isTaskRunning ? 'bottom-ai-tools__task-icon--hidden' : ''}`}
            />
            <img
              src={stopIcon}
              alt=""
              aria-hidden="true"
              className={`bottom-ai-tools__task-icon bottom-ai-tools__task-icon--stop ${isTaskRunning ? '' : 'bottom-ai-tools__task-icon--hidden'}`}
            />
          </span>

          <span className="bottom-ai-tools__label">Task Overview</span>
        </button>

        <button type="button" className="bottom-ai-tools__pill bottom-ai-tools__pill--analyzing">
          <span className="bottom-ai-tools__analyzing-shimmer" />
          <span className="bottom-ai-tools__stop-wrap">
            <img src={stopIcon} alt="" aria-hidden="true" className="bottom-ai-tools__stop-icon" />
          </span>
          <span className="bottom-ai-tools__label">Analyzing competitors m...</span>
        </button>
      </div>
    </>
  )
}

export function BottomAIStatusTools({ onAskNora, onTaskOpen }) {
  return (
    <div className="bottom-ai-tools bottom-ai-tools--status-only">
      <div className="bottom-ai-tools__row">
        <BottomAIActionCluster onAskNora={onAskNora} onTaskOpen={onTaskOpen} />
      </div>
    </div>
  )
}

function formatZoomPercent(currentScale, initialScale) {
  return `${Math.max(1, Math.round((currentScale / initialScale) * 100))}%`
}

export default function BottomAITools({ scale, initialScale, mode = 'hand', onModeChange, onTaskOpen }) {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  const [zoomPercent, setZoomPercent] = useState(() => formatZoomPercent(scale ?? initialScale, initialScale))
  const [isZooming, setIsZooming] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  useTransformEffect((ref) => {
    const currentScale = ref?.state?.scale ?? initialScale
    setZoomPercent(formatZoomPercent(currentScale, initialScale))
  })

  const handleZoom = (direction) => {
    setIsZooming(true)
    if (direction === 'in') {
      zoomIn(0.08, 180, 'easeOut')
    } else {
      zoomOut(0.08, 180, 'easeOut')
    }
    window.setTimeout(() => setIsZooming(false), 160)
  }

  return (
    <div className="bottom-ai-tools">
      <div className="bottom-ai-tools__row">
        <div className={`bottom-ai-tools__view-tools ${viewOpen ? 'bottom-ai-tools__view-tools--open' : ''}`}>
          <button
            type="button"
            className="bottom-ai-tools__view-toggle"
            onClick={() => setViewOpen((current) => !current)}
            aria-label={viewOpen ? 'Hide view tools' : 'Show view tools'}
            aria-expanded={viewOpen}
          >
            <img src={eyeIcon} alt="" aria-hidden="true" className="bottom-ai-tools__view-icon" />
          </button>

          <div className="bottom-ai-tools__view-panel">
            <div className="bottom-ai-tools__zoom-reset">
              <button type="button" className="bottom-ai-tools__circle-btn--flat" onClick={() => handleZoom('in')} aria-label="Zoom in">
                <span className="bottom-ai-tools__math-symbol">+</span>
              </button>

              <span
                className={`bottom-ai-tools__zoom-value ${isZooming ? 'bottom-ai-tools__zoom-value--active' : ''}`}
                aria-live="polite"
              >
                {zoomPercent}
              </span>

              <button type="button" className="bottom-ai-tools__circle-btn--flat" onClick={() => handleZoom('out')} aria-label="Zoom out">
                <span className="bottom-ai-tools__math-symbol">-</span>
              </button>

              <button type="button" className="bottom-ai-tools__pill bottom-ai-tools__pill--reset" onClick={() => resetTransform()} aria-label="Reset view">
                Reset View
              </button>
            </div>

            <div className="bottom-ai-tools__group--bg">
              <button
                type="button"
                className={`bottom-ai-tools__circle-btn--mode ${mode === 'cursor' ? 'bottom-ai-tools__circle-btn--mode--selected bottom-ai-tools__circle-btn--mode--active' : ''}`}
                onClick={() => onModeChange?.('cursor')}
                aria-label="Cursor mode"
                aria-pressed={mode === 'cursor'}
              >
                <img src={cursorIcon} alt="" aria-hidden="true" className="bottom-ai-tools__icon" />
              </button>

              <button
                type="button"
                className={`bottom-ai-tools__circle-btn--mode ${mode === 'hand' ? 'bottom-ai-tools__circle-btn--mode--selected bottom-ai-tools__circle-btn--mode--active' : ''}`}
                onClick={() => onModeChange?.('hand')}
                aria-label="Hand mode"
                aria-pressed={mode === 'hand'}
              >
                <img src={handIcon} alt="" aria-hidden="true" className="bottom-ai-tools__icon" />
              </button>
            </div>
          </div>
        </div>

        <BottomAIActionCluster onAskNora={onModeChange} onTaskOpen={onTaskOpen} />
      </div>
    </div>
  )
}