import { useEffect, useMemo, useState } from 'react'
import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { portfolioAnalyticsCardData } from '../data/analyticsMockData.js'
import styles from './PortfolioAnalyticsCard.module.css'

function getArcPoint(cx, cy, radius, progress) {
  const angle = Math.PI * (1 - progress)

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}

function buildArcPath(cx, cy, radius) {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`
}

function Sparkline({ chart, id }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 194 52" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(204, 230, 79, 0.38)" />
          <stop offset="100%" stopColor="rgba(204, 230, 79, 0)" />
        </linearGradient>
      </defs>
      <polygon points={chart.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      <polyline points={chart.points} className={styles.sparkLine} />
    </svg>
  )
}

function DottedSummaryChart({ item, activeColumn, onActivate }) {
  const maxCount = Math.max(...item.columns.map((column) => column.count), 1)
  const columnCount = item.columns.length

  return (
    <div className={styles.summaryChartShell} onMouseLeave={() => onActivate(null)}>
      {activeColumn ? (
        <div
          className={styles.summaryTooltip}
          style={{ left: `${((activeColumn.index + 0.5) / columnCount) * 100}%` }}
        >
          <strong>{activeColumn.label}</strong>
          <span>{activeColumn.value}</span>
        </div>
      ) : null}
      <svg
        className={styles.summaryBars}
        viewBox="0 0 108 34"
        aria-hidden="true"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onActivate(null)
          }
        }}
      >
        {item.columns.map((column, columnIndex) => {
          const isActive = activeColumn?.id === `${item.label}-${column.label}`
          const shouldDim = activeColumn && !isActive

          return (
            <g key={`${item.label}-${column.label}`}>
              {Array.from({ length: maxCount }).map((_, rowIndex) => {
                /*
                 * rowIndex 0 = bottom dot  (y = 25)
                 * rowIndex N = top dot     (y = 25 - N*4)
                 *
                 * Fill UPWARD: dots become visible from the bottom first.
                 * Previously: maxCount - rowIndex <= column.count  → top-down ✗
                 * Fixed:      rowIndex < column.count              → bottom-up ✓
                 */
                const visible = rowIndex < column.count
                const x = 10 + columnIndex * 14
                const y = 25 - rowIndex * 4

                return (
                  <circle
                    key={`${item.label}-${column.label}-${rowIndex}`}
                    cx={x}
                    cy={y}
                    r="1.3"
                    className={`${styles.summaryDot} ${visible ? styles.summaryDotVisible : styles.summaryDotHidden} ${shouldDim ? styles.summaryDotDimmed : ''}`}
                    style={{ '--dot-index': rowIndex }}
                  />
                )
              })}
              <rect
                x={columnIndex * 14}
                y="0"
                width="14"
                height="34"
                className={styles.summaryHitArea}
                onMouseEnter={() =>
                  onActivate({
                    id: `${item.label}-${column.label}`,
                    label: column.label,
                    value: column.value,
                    index: columnIndex,
                  })
                }
                onFocus={() =>
                  onActivate({
                    id: `${item.label}-${column.label}`,
                    label: column.label,
                    value: column.value,
                    index: columnIndex,
                  })
                }
                tabIndex="0"
                role="button"
                aria-label={`${item.label} on ${column.label}: ${column.value}`}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function LineSummaryChart({ item }) {
  return (
    <svg className={styles.summaryLineChart} viewBox="0 0 172 64" aria-hidden="true">
      <defs>
        <linearGradient id="portfolio-assets-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(202, 230, 88, 0.38)" />
          <stop offset="100%" stopColor="rgba(202, 230, 88, 0)" />
        </linearGradient>
      </defs>
      <g transform="translate(0,-8)">
        <polygon points={item.fillPoints} className={styles.summaryLineFill} />
        <polyline points={item.points} className={styles.summaryLine} />
      </g>
    </svg>
  )
}

function SummaryItem({ item, activeColumn, onActivate }) {
  return (
    <div className={styles.summaryItem}>
      <span className={styles.summaryLabel}>{item.label}</span>
      <strong className={styles.summaryValue}>{item.value}</strong>
      {item.type === 'bars' ? (
        <DottedSummaryChart item={item} activeColumn={activeColumn} onActivate={onActivate} />
      ) : (
        <LineSummaryChart item={item} />
      )}
    </div>
  )
}

export function PortfolioAnalyticsCard({ data = portfolioAnalyticsCardData }) {
  const { title, subtitle, status, growthLabel, growthValue, growthChart, panelTitle, summaryItems, gaugeTitle, gauge, insight, ctaLabel } = data
  const { current, target, progress } = gauge

  const [activeColumnByMetric, setActiveColumnByMetric] = useState({})
  const [displayCurrent, setDisplayCurrent] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const duration = 1400
    const start = performance.now()
    let frameId = 0

    const tick = (time) => {
      const elapsed = Math.min((time - start) / duration, 1)
      const eased = 1 - (1 - elapsed) ** 3

      setDisplayCurrent(Math.round(current * eased))
      setAnimatedProgress(progress * eased)

      if (elapsed < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [current, progress])

  const gaugeTone = progress >= 0.7 ? 'healthy' : progress >= 0.4 ? 'warning' : 'critical'

  const gaugeVars =
    gaugeTone === 'critical'
      ? {
          '--gauge-track': 'rgba(255, 202, 182, 0.76)',
          '--gauge-progress': '#ff6d5b',
          '--gauge-shadow': 'rgba(255, 109, 91, 0.22)',
          '--gauge-value': '#d85c50',
        }
      : gaugeTone === 'warning'
        ? {
            '--gauge-track': 'rgba(242, 224, 161, 0.76)',
            '--gauge-progress': '#e4b339',
            '--gauge-shadow': 'rgba(228, 179, 57, 0.22)',
            '--gauge-value': '#bf8a14',
          }
        : {
            '--gauge-track': 'rgba(220, 236, 199, 0.76)',
            '--gauge-progress': '#97b814',
            '--gauge-shadow': 'rgba(187, 220, 48, 0.24)',
            '--gauge-value': '#6f9a00',
          }

  const ringLength = 100
  const gaugePath = useMemo(() => buildArcPath(180, 160, 148), [])
  const capPosition = useMemo(() => getArcPoint(180, 160, 148, animatedProgress), [animatedProgress])

  return (
    <article className={styles.card} style={gaugeVars}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.topRow}>
        <div className={styles.growthMeta}>
          <span className={styles.growthLabel}>{growthLabel}</span>
          <strong className={styles.growthValue}>{growthValue}</strong>
        </div>
        <Sparkline chart={growthChart} id="portfolio-growth-fill" />
      </div>

      <section className={styles.summaryPanel}>
        <div className={styles.summaryPanelInner}>
          <div className={styles.panelHeader}>{panelTitle}</div>
          <div className={styles.summaryInner}>
            {summaryItems.map((item) => (
              <SummaryItem
                key={item.label}
                item={item}
                activeColumn={activeColumnByMetric[item.label]}
                onActivate={(column) =>
                  setActiveColumnByMetric((current) => ({
                    ...current,
                    [item.label]: column,
                  }))
                }
              />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.gaugeSection}>
        <div className={styles.gaugeTitle}>{gaugeTitle}</div>
        <div className={styles.gaugeWrap}>
          <svg className={styles.gauge} viewBox="0 0 360 186" aria-hidden="true">
            <path d={gaugePath} className={styles.gaugeGlowTrack} />
            <path d={gaugePath} className={styles.gaugeTrack} />
            <path
              d={gaugePath}
              className={styles.gaugeProgress}
              pathLength={ringLength}
              strokeDasharray={`${animatedProgress * ringLength} ${ringLength}`}
              strokeDashoffset="0"
            />
            <circle cx={capPosition.x} cy={capPosition.y} r="16" className={styles.gaugeCap} />
          </svg>
          <div className={styles.gaugeValue}>
            {displayCurrent}/{target}
          </div>
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