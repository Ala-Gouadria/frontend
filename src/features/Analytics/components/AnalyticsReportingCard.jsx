import { useState } from 'react'
import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { analyticsReportingCardData } from '../data/analyticsMockData.js'
import styles from './AnalyticsReportingCard.module.css'

function toPercentNumber(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function pointsToString(points) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

function buildAreaPoints(upperSeries, lowerSeries) {
  return [...upperSeries, ...[...lowerSeries].reverse()].map((point) => `${point.x},${point.y}`).join(' ')
}

function renderRiskMessage(message) {
  const match = String(message).match(/(-?\d+%)/)

  if (!match) {
    return message
  }

  const [highlight] = match
  const [before, after] = String(message).split(highlight)

  return (
    <>
      {before}
      <strong>{highlight}</strong>
      {after}
    </>
  )
}

function MiniBars({ bars }) {
  return (
    <svg className={styles.metricBars} viewBox="0 0 120 58" aria-hidden="true">
      {bars.map((bar, index) => (
        <rect
          key={`${bar}-${index}`}
          x={index * 8.4}
          y={56 - bar / 1.4}
          width="2.4"
          height={bar / 1.4}
          rx="1.2"
          className={styles.metricBar}
          style={{ '--bar-index': index }}
        />
      ))}
    </svg>
  )
}

function MiniLine({ points, fillPoints }) {
  return (
    <svg className={styles.metricLineChart} viewBox="0 0 194 58" aria-hidden="true">
      <defs>
        <linearGradient id="analytics-reporting-top-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--mini-fill-top)" />
          <stop offset="100%" stopColor="var(--mini-fill-bottom)" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} className={styles.metricLineFill} />
      <polyline points={points} className={styles.metricLineStroke} />
    </svg>
  )
}

export function AnalyticsReportingCard({ data = analyticsReportingCardData }) {
  const { title, subtitle, status, metrics, chartTitle, revenueChart, risk, progress, insight, ctaLabel } = data

  const growthMetric = metrics.find((metric) => metric.label.toLowerCase().includes('growth'))
  const growthValue = toPercentNumber(growthMetric?.value)
  const isPositiveGrowth = growthValue >= 0

  const chartTheme = isPositiveGrowth
    ? {
        '--trend-line': '#88a80b',
        '--trend-line-soft': '#b5bc56',
        '--trend-fill-top': '#b7dc1a',
        '--trend-fill-bottom': '#699a00',
        '--trend-glow': 'rgba(197, 232, 32, 0.36)',
        '--mini-fill-top': 'rgba(207, 233, 73, 0.38)',
        '--mini-fill-bottom': 'rgba(207, 233, 73, 0)',
        '--metric-accent': '#79a10b',
        '--status-glow': 'rgba(170, 213, 36, 0.28)',
      }
    : {
        '--trend-line': '#ff7b6d',
        '--trend-line-soft': '#ffc2b4',
        '--trend-fill-top': '#ffb7ae',
        '--trend-fill-bottom': '#ff7b6d',
        '--trend-glow': 'rgba(255, 123, 109, 0.28)',
        '--mini-fill-top': 'rgba(255, 123, 109, 0.22)',
        '--mini-fill-bottom': 'rgba(255, 123, 109, 0)',
        '--metric-accent': '#d85c50',
        '--status-glow': 'rgba(170, 213, 36, 0.28)',
      }

  const upperSeries = revenueChart.upperSeries ?? []
  const lowerSeries = revenueChart.lowerSeries ?? []
  const defaultActiveIndex = revenueChart.activeIndex ?? 0
  const [activePointIndex, setActivePointIndex] = useState(defaultActiveIndex)
  const activePoint = upperSeries[activePointIndex] ?? upperSeries[0]

  const upperPoints = pointsToString(upperSeries)
  const lowerPoints = pointsToString(lowerSeries)
  const areaPoints = buildAreaPoints(upperSeries, lowerSeries)

  const progressPercent = toPercentNumber(progress.value)
  const segmentCount = progress.segments ?? 21
  const activeSegments = Math.round((progressPercent / 100) * segmentCount)

  return (
    <article className={styles.card} style={chartTheme}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.metricsGrid}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metricBlock}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <strong className={styles.metricValue}>{metric.value}</strong>
            {metric.detail ? <span className={styles.metricDetail}>{metric.detail}</span> : <span className={styles.metricSpacer} />}
            {metric.type === 'bars' ? <MiniBars bars={metric.bars} /> : <MiniLine points={metric.points} fillPoints={metric.fillPoints} />}
          </div>
        ))}
      </div>

      <div className={styles.chartSection}>
        <div className={styles.sectionTitle}>{chartTitle}</div>
        <svg className={styles.revenueChart} viewBox="0 0 372 140" aria-hidden="true">
          <defs>
            <linearGradient id="analytics-reporting-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--trend-fill-top)" />
              <stop offset="100%" stopColor="var(--trend-fill-bottom)" />
            </linearGradient>
            <filter id="analytics-reporting-glow" x="-10%" y="-20%" width="120%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon points={areaPoints} className={styles.revenueFillGlow} />
          <polygon points={areaPoints} className={styles.revenueFill} />
          <polyline points={upperPoints} className={styles.revenueUpperLine} />
          <polyline points={lowerPoints} className={styles.revenueLowerLine} />
          {activePoint ? <line x1={activePoint.x} x2={activePoint.x} y1="24" y2="134" className={styles.focusLine} /> : null}
          {upperSeries.map((point, index) => (
            <g key={`${point.x}-${point.y}`}>
              <circle cx={point.x} cy={point.y} r="3" className={styles.chartMarker} />
              <circle
                cx={point.x}
                cy={lowerSeries[index]?.y ?? point.y}
                r="2.8"
                className={styles.chartMarker}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                className={styles.chartHitArea}
                onMouseEnter={() => setActivePointIndex(index)}
                onFocus={() => setActivePointIndex(index)}
                tabIndex="0"
                role="button"
                aria-label={`Revenue point ${index + 1}, ${point.tooltip}`}
              />
            </g>
          ))}
          {activePoint ? (
            <g transform={`translate(${activePoint.x}, ${activePoint.y + 36})`}>
              <g className={styles.badgeGroup}>
                <rect x="-22" y="-12" width="44" height="24" rx="12" className={styles.badgeBubble} />
                <text textAnchor="middle" dy="4" className={styles.badgeText}>
                  {activePoint.tooltip}
                </text>
              </g>
            </g>
          ) : null}
        </svg>
      </div>

      <div className={styles.riskRow}>
        <span className={styles.riskIcon}>
          <span className={styles.riskIconInner}>!</span>
        </span>
        <span className={styles.riskLabel}>{risk.label}</span>
        <span className={styles.riskText}>{renderRiskMessage(risk.message)}</span>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>{progress.label}</span>
          <span>{progress.value}</span>
        </div>
        <div className={styles.progressBlocks}>
          {Array.from({ length: segmentCount }).map((_, index) => (
            <span
              key={`progress-segment-${index}`}
              className={`${styles.progressBlock} ${index < activeSegments ? styles.progressBlockActive : styles.progressBlockInactive}`}
              style={{ '--segment-delay': `${index * 45}ms` }}
            />
          ))}
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
