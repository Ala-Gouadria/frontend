import { useMemo, useState } from 'react'
import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { salesReportCardData } from '../data/analyticsMockData.js'
import styles from './SalesReportCard.module.css'

function parsePointString(points) {
  return points.split(' ').map((pair) => {
    const [x, y] = pair.split(',').map(Number)
    return { x, y }
  })
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

function ResultChart({ item }) {
  const points = useMemo(() => parsePointString(item.points), [item.points])
  const [activeIndex, setActiveIndex] = useState(points.length - 1)
  const activePoint = points[activeIndex]

  const chartStyle =
    item.tone === 'negative' || item.value.startsWith('-')
      ? {
          '--result-line': '#ff7465',
          '--result-fill-top': 'rgba(255, 125, 112, 0.3)',
          '--result-fill-bottom': 'rgba(255, 125, 112, 0)',
          '--result-value': '#d85c50',
        }
      : {
          '--result-line': '#90ad17',
          '--result-fill-top': 'rgba(204, 230, 79, 0.38)',
          '--result-fill-bottom': 'rgba(204, 230, 79, 0)',
          '--result-value': '#6f9a00',
        }

  return (
    <div className={styles.resultCol} style={chartStyle}>
      <span className={styles.resultLabel}>{item.label}</span>
      <strong className={styles.resultValue}>{item.value}</strong>
      <div className={styles.resultChartShell} onMouseLeave={() => setActiveIndex(points.length - 1)}>
        {activePoint ? (
          <div
            className={styles.resultTooltip}
            style={{ left: `${((activeIndex + 0.5) / points.length) * 100}%` }}
          >
            {item.tooltips?.[activeIndex] ?? activePoint.y}
          </div>
        ) : null}
        <svg className={styles.resultChart} viewBox="0 0 172 64" aria-hidden="true">
          <defs>
            <linearGradient id={`sales-${item.label.replace(/\s+/g, '-').toLowerCase()}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--result-fill-top)" />
              <stop offset="100%" stopColor="var(--result-fill-bottom)" />
            </linearGradient>
          </defs>
          <polygon
            points={item.fillPoints}
            className={styles.resultFill}
            style={{ fill: `url(#sales-${item.label.replace(/\s+/g, '-').toLowerCase()}-fill)` }}
          />
          <polyline points={item.points} className={styles.resultLine} />
          {points.map((point, index) => (
            <rect
              key={`${item.label}-${point.x}-${point.y}`}
              x={point.x - 8}
              y="0"
              width="16"
              height="64"
              className={styles.resultHitArea}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              tabIndex="0"
              role="button"
              aria-label={`${item.label} ${item.tooltips?.[index] ?? point.y}`}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export function SalesReportCard({ data = salesReportCardData }) {
  const { title, subtitle, status, growthLabel, growthValue, growthChart, panelTitle, results, sourceTitle, sourceLegend, sourceBlocks, insight, ctaLabel } = data
  const [activeTone, setActiveTone] = useState(null)

  return (
    <article className={styles.card}>
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
        <Sparkline chart={growthChart} id="sales-report-growth-fill" />
      </div>

      <section className={styles.resultsPanel}>
        <div className={styles.resultsPanelInner}>
          <div className={styles.panelHeader}>{panelTitle}</div>
          <div className={styles.resultsInner}>
            {results.map((item) => (
              <ResultChart key={item.label} item={item} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sourceSection}>
        <div className={styles.sourceTitle}>{sourceTitle}</div>
        <div className={styles.legendRow}>
          {sourceLegend.map((item) => {
            const isDimmed = activeTone && activeTone !== item.tone

            return (
              <button
                key={item.label}
                type="button"
                className={`${styles.legendItem} ${isDimmed ? styles.legendDimmed : ''}`}
                onMouseEnter={() => setActiveTone(item.tone)}
                onMouseLeave={() => setActiveTone(null)}
                onFocus={() => setActiveTone(item.tone)}
                onBlur={() => setActiveTone(null)}
              >
                <span className={`${styles.legendSwatch} ${styles[item.tone]}`} />
                <span>{item.label}</span>
                <span>{item.value}</span>
              </button>
            )
          })}
        </div>
        <div className={styles.blockRow}>
          {sourceBlocks.flatMap((group) =>
            Array.from({ length: group.count }).map((_, index) => {
              const isDimmed = activeTone && activeTone !== group.tone

              return (
                <span
                  key={`${group.tone}-${index}`}
                  className={`${styles.sourceBlock} ${styles[group.tone]} ${isDimmed ? styles.sourceBlockDimmed : ''}`}
                  style={{ '--block-index': index }}
                />
              )
            }),
          )}
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
