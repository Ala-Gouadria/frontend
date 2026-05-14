import { useEffect, useMemo, useRef, useState } from 'react'
import './Setup.css'
import { setupApi } from '../../api/setupApi'
import NoraLogo from '../../assets/logo/Nora-logo.png'
import ProfileIcon from '../../assets/icons/Set-up-Nav/Profilesetup.png'
import BusinessIcon from '../../assets/icons/Set-up-Nav/Businesssetup.png'
import BrandIcon from '../../assets/icons/Set-up-Nav/BrandIdentity.png'
import AudienceIcon from '../../assets/icons/Set-up-Nav/TargetedAudience.png'
import ChannelsIcon from '../../assets/icons/Set-up-Nav/Channels&Integration.png'
import ContentIcon from '../../assets/icons/Set-up-Nav/Contentdirection.png'
import GoalIcon from '../../assets/icons/Set-up-Nav/BusinessGoal.png'
import OptimIcon from '../../assets/icons/Set-up-Nav/OptimizationInputs.png'
import PillButton from '../../components/pages-parts/PillButton'
const STEP_ICONS = {
  profile: ProfileIcon,
  business: BusinessIcon,
  brand: BrandIcon,
  audience: AudienceIcon,
  channels: ChannelsIcon,
  content: ContentIcon,
  goals: GoalIcon,
  optimization: OptimIcon,
}

function UploadField({ field, value = [], onUpload, onRemove }) {
  const inputRef = useRef(null)

  return (
    <div className={`f-wrap${field.width === 'half' ? ' f-half' : ' f-full'}`}>
      {field.label ? <label className="f-label">{field.label}</label> : null}
      <div className="f-upload">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c4cce8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <button type="button" className="f-upload-btn" onClick={() => inputRef.current?.click()}>
          Drop or Browse
        </button>
        <span className="f-upload-h">{field.helper}</span>

        {value.length > 0 ? (
          <div className="f-upload-files">
            {value.map((file) => (
              <div key={file.id} className="f-upload-file">
                <span>{file.name}</span>
                <button type="button" onClick={() => onRemove(field.id, file.id)}>x</button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept={field.accept}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          if (files.length > 0) {
            onUpload(field.id, files)
          }
          event.target.value = ''
        }}
      />
    </div>
  )
}

function FieldRenderer({ field, stepValues, onChange, onToggleChip, onUpload, onRemoveUpload }) {
  const value = stepValues[field.id]
  const wrapClassName = `f-wrap${field.width === 'half' ? ' f-half' : ' f-full'}`

  if (field.type === 'select') {
    return (
      <div className={wrapClassName}>
        {field.label ? <label className="f-label">{field.label}</label> : null}
        <div className="f-sel-wrap">
          <select className="f-select" value={value ?? ''} onChange={(event) => onChange(field.id, event.target.value)}>
            <option value="">{field.placeholder}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <svg className="f-caret" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className={wrapClassName}>
        {field.label ? (
          <label className="f-label">
            {field.label}
            {field.optional ? <span className="f-optional"> (optional)</span> : null}
          </label>
        ) : null}
        <textarea
          className={`f-textarea${field.dashed ? ' f-dashed' : ''}`}
          placeholder={field.placeholder}
          rows={4}
          value={value ?? ''}
          onChange={(event) => onChange(field.id, event.target.value)}
        />
      </div>
    )
  }

  if (field.type === 'upload') {
    return (
      <UploadField
        field={field}
        value={Array.isArray(value) ? value : []}
        onUpload={onUpload}
        onRemove={onRemoveUpload}
      />
    )
  }

  if (field.type === 'chips') {
    const selected = Array.isArray(value) ? value : []

    return (
      <div className={wrapClassName}>
        <label className="f-label">{field.label}</label>
        <div className="chips-row">
          {field.options.map((option) => {
            const active = selected.includes(option)

            return (
              <button
                key={option}
                type="button"
                className={`chip${active ? ' chip-on' : ''}`}
                onClick={() => onToggleChip(field.id, option)}
              >
                {active ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
                {option}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (field.type === 'color') {
    return (
      <div className={wrapClassName}>
        <label className="f-label">{field.label}</label>
        <div className="color-row">
          <div className="color-swatch" style={{ background: value || field.placeholder || '#2F80ED' }} />
          <input
            className="f-input"
            value={value ?? ''}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={wrapClassName}>
      {field.label ? <label className="f-label">{field.label}</label> : null}
      <input
        className="f-input"
        type={field.type === 'url' ? 'url' : 'text'}
        placeholder={field.placeholder}
        value={value ?? ''}
        onChange={(event) => onChange(field.id, event.target.value)}
      />
    </div>
  )
}

function WhyMatters({ text }) {
  return (
    <div className="ob-why">
      <p className="ob-why-t">WHY THIS MATTERS</p>
      <p className="ob-why-b">{text}</p>
    </div>
  )
}

export default function Setup({ onComplete }) {
  const [content, setContent] = useState(null)
  const [steps, setSteps] = useState([])
  const [values, setValues] = useState({})
  const [stepProgress, setStepProgress] = useState({})
  const [overallProgress, setOverallProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [anim, setAnim] = useState('in')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    let active = true

    ;(async () => {
      const response = await setupApi.getFlow()
      if (!active) {
        return
      }

      setContent(response.content)
      setSteps(response.steps)
      setValues(response.values)
      setStepProgress(response.stepProgress)
      setOverallProgress(response.overallProgress)
      setLoading(false)
    })()

    return () => {
      active = false
      window.clearTimeout(timerRef.current)
    }
  }, [])

  const currentStep = steps[stepIndex]
  const currentValues = currentStep ? values[currentStep.id] ?? {} : {}
  const completedSteps = useMemo(
    () => Object.values(stepProgress).filter((percent) => percent === 100).length,
    [stepProgress],
  )
  const currentStepPercent = currentStep ? stepProgress[currentStep.id] ?? 0 : 0
  const isLastStep = stepIndex === steps.length - 1

  const animateToStep = (nextIndex, direction) => {
    window.clearTimeout(timerRef.current)
    setAnim(direction === 'fwd' ? 'out-fwd' : 'out-bck')
    timerRef.current = window.setTimeout(() => {
      setStepIndex(nextIndex)
      setAnim('in')
    }, 230)
  }

  const persistStep = async (stepId, nextValues, nextMessage) => {
    setSaving(true)

    try {
      const response = await setupApi.saveStep({
        steps,
        values: nextValues,
        stepId,
      })

      setStepProgress(response.stepProgress)
      setOverallProgress(response.overallProgress)
      setStatusMessage(nextMessage ?? `Saved ${response.stepId} step at ${new Date(response.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`)
      return response
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (fieldId, nextValue) => {
    if (!currentStep) {
      return
    }

    setValues((current) => ({
      ...current,
      [currentStep.id]: {
        ...current[currentStep.id],
        [fieldId]: nextValue,
      },
    }))
    setStatusMessage('')
  }

  const handleToggleChip = (fieldId, option) => {
    const currentSelection = Array.isArray(currentValues[fieldId]) ? currentValues[fieldId] : []
    const nextSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option)
      : [...currentSelection, option]

    handleFieldChange(fieldId, nextSelection)
  }

  const handleUpload = async (fieldId, files) => {
    if (!currentStep) {
      return
    }

    setSaving(true)

    try {
      const uploaded = await setupApi.uploadFieldFiles(fieldId, files)
      setValues((current) => ({
        ...current,
        [currentStep.id]: {
          ...current[currentStep.id],
          [fieldId]: [...(current[currentStep.id]?.[fieldId] ?? []), ...uploaded],
        },
      }))
      setStatusMessage(`${uploaded.length} file${uploaded.length > 1 ? 's' : ''} added to ${fieldId}.`)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveUpload = (fieldId, fileId) => {
    if (!currentStep) {
      return
    }

    setValues((current) => ({
      ...current,
      [currentStep.id]: {
        ...current[currentStep.id],
        [fieldId]: (current[currentStep.id]?.[fieldId] ?? []).filter((file) => file.id !== fileId),
      },
    }))
  }

  const handleSelectStep = async (nextIndex) => {
    if (!currentStep || nextIndex === stepIndex) {
      return
    }

    const nextValues = values
    await persistStep(currentStep.id, nextValues)
    animateToStep(nextIndex, nextIndex > stepIndex ? 'fwd' : 'bck')
  }

  const handlePrevious = async () => {
    if (!currentStep || stepIndex === 0) {
      return
    }

    await persistStep(currentStep.id, values)
    animateToStep(stepIndex - 1, 'bck')
  }

  const handleSkip = async () => {
    if (!currentStep || isLastStep) {
      return
    }

    await persistStep(currentStep.id, values, `Skipped ${currentStep.label} for now.`)
    animateToStep(stepIndex + 1, 'fwd')
  }

  const handleNext = async () => {
    if (!currentStep) {
      return
    }

    const nextValues = values

    if (isLastStep) {
      setSaving(true)
      try {
        const response = await setupApi.completeFlow({ steps, values: nextValues })
        setStepProgress(response.stepProgress)
        setOverallProgress(response.overallProgress)
        setStatusMessage(response.summary)
        window.setTimeout(() => {
          onComplete?.()
        }, 650)
      } finally {
        setSaving(false)
      }
      return
    }

    await persistStep(currentStep.id, nextValues)
    animateToStep(stepIndex + 1, 'fwd')
  }

  if (loading || !content || !currentStep) {
    return (
      <div className="ob-root setup-root">
        <div className="ob-loading">Loading onboarding flow...</div>
      </div>
    )
  }

  return (
    <div className="ob-root setup-root">
      <header className="ob-hdr">
        <div className="ob-hdr-row">
          <div className="ob-brand">
            <img src={NoraLogo} alt="Nora" className="ob-logo" />
            <span className="ob-tagline">{content.tagline}</span>
          </div>

          <div className="ob-prog-card">
            <div className="ob-prog-top">
              <span><b>Account</b> Setup</span>
              <span className="pct-num"><b>{overallProgress}%</b> Complete</span>
            </div>
            <div className="ob-prog-bar">
              <div className="ob-prog-fill" style={{ width: `${overallProgress}%` }} />
            </div>
            <div className="ob-prog-strip">
              <span>{completedSteps} out of <b>{steps.length}</b> steps completed</span>
              <span>{steps.length - completedSteps} Steps Remaining</span>
            </div>
          </div>
        </div>

        <div className="ob-hdr-hl">
          <h1 className="ob-headline">
            <span className="hl-blue">{content.headlineLead}</span>{' '}
            <span className="hl-orange">{content.headlineAccent}</span>
          </h1>
          <p className="ob-headline-sub">{content.headlineSubcopy}</p>
        </div>
      </header>

      <div className="ob-body">
        <aside className="ob-sidebar">
          <p className="ob-sb-head">{content.sidebarTitle}</p>
          <p className="ob-sb-sub">{content.sidebarSubcopy}</p>
          <nav>
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                className={`ob-nav-item${stepIndex === index ? ' active' : ''}`}
                onClick={() => {
                  void handleSelectStep(index)
                }}
              >
                <img src={STEP_ICONS[step.iconKey]} alt="" className="ob-nav-icon" />
                <span className="ob-nav-label">{step.label}</span>
                <span className="ob-nav-pct">{stepProgress[step.id] ?? 0}%</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className={`ob-main ob-anim-${anim}`}>
          <div className="ob-card">
            <div className="ob-card-head">
              <div>
                <h2 className="ob-card-title">
                  {currentStep.titleLead} <span>{currentStep.titleTail}</span>
                </h2>
                <p className="ob-card-sub">{currentStep.subtitle}</p>
              </div>
              <div className="ob-pill">
                <span className="ob-pill-dot" />
                <span className="ob-pill-txt">{currentStepPercent}% Progress</span>
              </div>
            </div>

            <div className="ob-sep" />

            {statusMessage ? <div className="ob-status">{statusMessage}</div> : null}

            <div className="ob-fields">
              <div className="ob-fields-grid">
                {currentStep.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    stepValues={currentValues}
                    onChange={handleFieldChange}
                    onToggleChip={handleToggleChip}
                    onUpload={(fieldId, files) => {
                      void handleUpload(fieldId, files)
                    }}
                    onRemoveUpload={handleRemoveUpload}
                  />
                ))}
              </div>
            </div>

            <WhyMatters text={currentStep.whyMatters} />

            <div className="ob-foot">
              <button
                type="button"
                className="ob-btn-ghost"
                onClick={() => {
                  void handlePrevious()
                }}
                disabled={stepIndex === 0 || saving}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Go to Previous Step
              </button>
              <div className="ob-foot-r">
                <button type="button" className="ob-btn-skip" onClick={() => { void handleSkip() }} disabled={isLastStep || saving}>
                  Skip for now
                </button>
                <PillButton
                  onClick={() => { void handleNext() }}
                  disabled={saving}
                  width="136px"
                  height="36px"
                >
                  {saving ? 'SAVING...' : isLastStep ? 'FINISH' : 'NEXT'}
                </PillButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
