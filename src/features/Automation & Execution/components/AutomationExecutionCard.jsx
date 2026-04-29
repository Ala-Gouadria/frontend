import { useEffect, useMemo, useState } from 'react'
import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { automationExecutionCardData } from '../data/automationExecutionMockData.js'
import styles from './AutomationExecutionCard.module.css'

function buildArcPath(cx, cy, radius) {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`
}

function getArcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : 0
}

function getProgressTone(progress) {
  if (progress >= 0.6) {
    return 'green'
  }

  if (progress >= 0.45) {
    return 'blue'
  }

  return 'red'
}

export function AutomationExecutionCard({ data = automationExecutionCardData }) {
  const { title, subtitle, status, stateLabel, stateValue, gauge, laneTitle, lanes, insight, ctaLabel } = data
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const ringLength = 100
  const gaugeTone = getProgressTone(gauge.progress)

  useEffect(() => {
    const duration = 1400
    const start = performance.now()
    let frameId = 0

    const tick = (time) => {
      const elapsed = Math.min((time - start) / duration, 1)
      const eased = 1 - (1 - elapsed) ** 3

      setAnimatedProgress(gauge.progress * eased)

      if (elapsed < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [gauge.progress])

  const gaugePath = useMemo(() => buildArcPath(180, 160, 148), [])
  const capPosition = useMemo(() => getArcPoint(180, 160, 148, animatedProgress), [animatedProgress])

  return (
    <article className={`${styles.card} ${styles[`${gaugeTone}Theme`]}`}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.stateRow}>
        <span>{stateLabel}</span>
        <strong>{stateValue}</strong>
      </div>

      <div className={styles.gaugeWrap}>
        <svg className={styles.gauge} viewBox="0 0 360 190" aria-hidden="true">
          <path d={gaugePath} className={styles.gaugeGlow} />
          <path d={gaugePath} className={styles.gaugeBack} />
          <path d={gaugePath} className={styles.gaugeFront} />
          <path
            d={gaugePath}
            className={styles.gaugeProgress}
            pathLength={ringLength}
            strokeDasharray={`${animatedProgress * ringLength} ${ringLength}`}
            strokeDashoffset="0"
          />
          {Array.from({ length: 15 }).map((_, index) => {
            const progress = index / 14
            const tickPoint = getArcPoint(180, 160, 162, progress)
            const innerPoint = getArcPoint(180, 160, 154, progress)

            return (
              <line
                key={`tick-${index}`}
                x1={tickPoint.x}
                y1={tickPoint.y}
                x2={innerPoint.x}
                y2={innerPoint.y}
                className={styles.gaugeTick}
              />
            )
          })}
          <circle cx={capPosition.x} cy={capPosition.y} r="12" className={styles.gaugeCap} />
        </svg>
        <div className={styles.gaugeValue}>
          <strong>{gauge.label}</strong>
          <span>{gauge.sublabel}</span>
        </div>
      </div>

      <div className={styles.laneSection}>
        <div className={styles.laneTitle}>{laneTitle}</div>
        <div className={styles.laneList}>
          {lanes.map((lane, laneIndex) => {
            const laneProgress = getPercent(lane.value) / 100
            const laneTone = getProgressTone(laneProgress)
            const totalBlocks = lane.total ?? 20
            const activeBlocks = lane.active ?? Math.round(totalBlocks * laneProgress)

            return (
            <div
              key={lane.label}
              className={`${styles.laneItem} ${styles[`${laneTone}Lane`]}`}
              style={{ '--lane-delay': `${laneIndex * 110}ms` }}
            >
              <div className={styles.laneHead}>
                <strong>{lane.label}</strong>
                <span>{lane.value}</span>
              </div>
              <div className={styles.blockRow}>
                {Array.from({ length: totalBlocks }).map((_, index) => (
                  <span
                    key={`${lane.label}-${index}`}
                    className={`${styles.block} ${index < activeBlocks ? styles.activeBlock : styles.inactive}`}
                    style={{
                      '--block-index': `${index}`,
                      '--block-delay': `${laneIndex * 90 + index * 34}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
            )
          })}
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span className={styles.insightTitle}>AI Insight</span>
        </div>
        <p>{insight}</p>
      </div>

      <button type="button" className={styles.cta}>
        {ctaLabel}
      </button>
    </article>
  )
}
