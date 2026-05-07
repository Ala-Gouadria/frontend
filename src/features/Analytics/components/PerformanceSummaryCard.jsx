import { useState } from 'react'
import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { performanceSummaryCardData } from '../data/analyticsMockData.js'
import styles from './PerformanceSummaryCard.module.css'

function SummarySparkline({ points, fillPoints }) {
  return (
    <svg className={styles.summarySparkline} viewBox="0 0 194 52" aria-hidden="true">
      <defs>
        <linearGradient id="performance-summary-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--trend-fill-top)" />
          <stop offset="100%" stopColor="var(--trend-fill-bottom)" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} className={styles.summarySparkFill} />
      <polyline points={points} className={styles.summarySparkLine} />
    </svg>
  )
}

function DottedChart({ metric, activeColumnKey, onActivate }) {
  const maxCount = Math.max(...metric.columns.map((column) => column.count), 1)
  const columnCount = metric.columns.length

  return (
    <div className={styles.chartShell} onMouseLeave={() => onActivate(null)}>
      {activeColumnKey ? (
        <div
          className={styles.chartTooltip}
          style={{ left: `${((activeColumnKey.index + 0.5) / columnCount) * 100}%` }}
        >
          <strong>{activeColumnKey.label}</strong>
          <span>{activeColumnKey.value}</span>
        </div>
      ) : null}
      <svg
        className={styles.dotChart}
        viewBox="0 0 108 40"
        aria-hidden="true"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onActivate(null)
          }
        }}
      >
        {metric.columns.map((column, columnIndex) => {
          const isActive = activeColumnKey?.id === `${metric.label}-${column.label}`
          const shouldDim = activeColumnKey && !isActive

          return (
            <g key={`${metric.label}-${column.label}`}>
              {Array.from({ length: maxCount }).map((_, rowIndex) => {
                /*
                 * rowIndex 0 = bottom dot  (y = 31)
                 * rowIndex N = top dot     (y = 31 - N*5)
                 *
                 * Fill UPWARD: show dots from the bottom first.
                 * A dot is visible when its rowIndex is below the column's count.
                 * Previously: maxCount - rowIndex <= column.count  → top-down fill ✗
                 * Fixed:      rowIndex < column.count              → bottom-up fill ✓
                 */
                const visible = rowIndex < column.count
                const x = 10 + columnIndex * 16
                const y = 31 - rowIndex * 5

                return (
                  <circle
                    key={`${metric.label}-${column.label}-${rowIndex}`}
                    cx={x}
                    cy={y}
                    r="1.4"
                    className={`${styles.chartDot} ${visible ? styles.chartDotVisible : styles.chartDotHidden} ${shouldDim ? styles.chartDotDimmed : ''}`}
                    style={{ '--dot-index': rowIndex }}
                  />
                )
              })}
              <rect
                x={columnIndex * 16}
                y="0"
                width="16"
                height="40"
                className={styles.chartHitArea}
                onMouseEnter={() =>
                  onActivate({
                    id: `${metric.label}-${column.label}`,
                    label: column.label,
                    value: column.value,
                    index: columnIndex,
                  })
                }
                onFocus={() =>
                  onActivate({
                    id: `${metric.label}-${column.label}`,
                    label: column.label,
                    value: column.value,
                    index: columnIndex,
                  })
                }
                tabIndex="0"
                role="button"
                aria-label={`${metric.label} on ${column.label}: ${column.value}`}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function PerformanceSummaryCard({ data = performanceSummaryCardData }) {
  const { title, subtitle, status, snapshotLabel, snapshotState, snapshotTone, snapshotChart, panelTitle, isPriority, results, insight, ctaLabel } = data
  const [activeColumnByMetric, setActiveColumnByMetric] = useState({})

  const isPositive = snapshotTone !== 'negative' && !snapshotState.toLowerCase().includes('declin')

  const themeVars = isPositive
    ? {
        '--trend-line': '#90ad17',
        '--trend-fill-top': 'rgba(204, 230, 79, 0.38)',
        '--trend-fill-bottom': 'rgba(204, 230, 79, 0)',
        '--trend-text': '#7da20a',
      }
    : {
        '--trend-line': '#ff7b6d',
        '--trend-fill-top': 'rgba(255, 123, 109, 0.22)',
        '--trend-fill-bottom': 'rgba(255, 123, 109, 0)',
        '--trend-text': '#d85c50',
      }

  return (
    <article className={styles.card} style={themeVars}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.snapshotRow}>
        <div className={styles.snapshotMeta}>
          <span className={styles.snapshotLabel}>{snapshotLabel}</span>
          <strong className={styles.snapshotState}>{snapshotState}</strong>
        </div>
        <SummarySparkline {...snapshotChart} />
      </div>

      <section className={`${styles.resultsPanel} ${isPriority ? styles.resultsPanelPriority : styles.resultsPanelFlat}`}>
        <div className={styles.resultsPanelInner}>
          <div className={styles.panelHeader}>{panelTitle}</div>
          <div className={styles.resultsInner}>
            {results.map((item) => (
              <div className={styles.resultCol} key={item.label}>
                <span className={styles.resultLabel}>{item.label}</span>
                <strong className={styles.resultValue}>{item.value}</strong>
                <DottedChart
                  metric={item}
                  activeColumnKey={activeColumnByMetric[item.label]}
                  onActivate={(column) =>
                    setActiveColumnByMetric((current) => ({
                      ...current,
                      [item.label]: column,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

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