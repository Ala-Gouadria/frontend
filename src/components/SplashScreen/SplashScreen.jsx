import { useEffect, useMemo, useState } from 'react'
import PillButton from '../pages-parts/PillButton'
import './SplashScreen.css'

import bgSrc from '../../assets/splash_screen/bg.svg'
import logoSrc from '../../assets/splash_screen/logo.svg'

function clampProgress(value) {
  if (!Number.isFinite(value)) {
    return 35
  }

  return Math.min(100, Math.max(0, Math.round(value)))
}

export default function SplashScreen({
  progress,
  title = 'Getting your system ready',
  subtitle = 'Connecting everything so Nora can run your business smoothly',
  loadingLabel = 'LOADING.....',
}) {
  const controlledProgress = typeof progress === 'number'
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (controlledProgress) {
      return undefined
    }

    let frameId = 0
    const startedAt = performance.now()

    const tick = (time) => {
      const elapsed = time - startedAt
      const nextProgress = Math.min(35, Math.round((elapsed / 1450) * 35))
      setAnimatedProgress(nextProgress)

      if (nextProgress < 35) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [controlledProgress, progress])

  const displayProgress = clampProgress(controlledProgress ? progress : animatedProgress)
  const progressStyle = useMemo(
    () => ({
      '--splash-progress': displayProgress,
      '--splash-progress-angle': `${(displayProgress / 100) * 360}deg`,
    }),
    [displayProgress],
  )

  return (
    <main className="splash-screen" aria-busy="true" aria-live="polite" style={progressStyle}>
      <section className="splash-screen__content" aria-label={title}>
        <div className="splash-screen__orb-wrap">
          <img src={bgSrc} alt="" className="splash-screen__orb-glow" aria-hidden="true" />
          <div className="splash-screen__ring" aria-hidden="true" />
          <div className="splash-screen__orb">
            <span className="splash-screen__percent">{displayProgress}%</span>
            <span className="splash-screen__logo-mask">
              <img src={logoSrc} alt="Nora" className="splash-screen__logo" />
            </span>
          </div>
        </div>

        <div className="splash-screen__copy">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <PillButton
            className="splash-screen__pill"
            width="162px"
            height="36px"
            compact
            disabled
            variant="primary"
          >
            {loadingLabel}
          </PillButton>
        </div>
      </section>
    </main>
  )
}
