import { useMemo, useState } from 'react'
import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { campaignPerformanceCardData } from '../data/analyticsMockData.js'
import styles from './CampaignPerformanceCard.module.css'

function buildLinePath(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function buildAreaPath(upperSeries, lowerSeries) {
  const top = upperSeries.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const bottom = [...lowerSeries].reverse().map((point) => `L ${point.x} ${point.y}`).join(' ')

  return `${top} ${bottom} Z`
}

function ProgressRing({ progress, delay }) {
  const radius = 15
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - progress)

  return (
    <svg className={styles.ring} viewBox="0 0 40 40" aria-hidden="true" style={{ '--ring-delay': `${delay}ms` }}>
      <circle cx="20" cy="20" r={radius} className={styles.ringTrack} />
      <circle
        cx="20"
        cy="20"
        r={radius}
        className={styles.ringProgress}
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
      />
    </svg>
  )
}

function MiniCampaignChart({ campaign }) {
  const isNegative = campaign.tone === 'negative' || campaign.value.trim().startsWith('-')
  const chartStyle = isNegative
    ? {
        '--mini-line': '#ff7269',
        '--mini-fill-top': 'rgba(255, 125, 112, 0.3)',
        '--mini-fill-bottom': 'rgba(255, 125, 112, 0)',
        '--mini-value': '#db5c50',
      }
    : {
        '--mini-line': '#88aa12',
        '--mini-fill-top': 'rgba(205, 232, 79, 0.34)',
        '--mini-fill-bottom': 'rgba(205, 232, 79, 0)',
        '--mini-value': '#7fa20b',
      }

  return (
    <div className={styles.panelItem} style={chartStyle}>
      <span className={styles.panelItemLabel}>{campaign.label}</span>
      <strong className={styles.panelItemValue}>{campaign.value}</strong>
      <svg className={styles.panelChart} viewBox="0 0 172 64" aria-hidden="true">
        <defs>
          <linearGradient id={`campaign-mini-fill-${campaign.label.replace(/\s+/g, '-').toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--mini-fill-top)" />
            <stop offset="100%" stopColor="var(--mini-fill-bottom)" />
          </linearGradient>
        </defs>
        <polygon
          points={campaign.fillPoints}
          className={styles.panelChartFill}
          style={{ fill: `url(#campaign-mini-fill-${campaign.label.replace(/\s+/g, '-').toLowerCase()})` }}
        />
        <polyline points={campaign.points} className={styles.panelChartLine} />
      </svg>
    </div>
  )
}

export function CampaignPerformanceCard({ data = campaignPerformanceCardData }) {
  const { title, subtitle, status, activeLabel, activeValue, campaignRings, panelTitle, campaigns, spendTitle, spendChart, insight, ctaLabel } = data

  const [activeIndex, setActiveIndex] = useState(spendChart.activeIndex ?? 0)

  const spendAreaPath = useMemo(
    () => buildAreaPath(spendChart.upperSeries, spendChart.lowerSeries),
    [spendChart.lowerSeries, spendChart.upperSeries],
  )
  const spendUpperPath = useMemo(() => buildLinePath(spendChart.upperSeries), [spendChart.upperSeries])
  const spendLowerPath = useMemo(() => buildLinePath(spendChart.lowerSeries), [spendChart.lowerSeries])

  const activePoint = spendChart.upperSeries[activeIndex] ?? spendChart.upperSeries[0]

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
        <div className={styles.activeMeta}>
          <span className={styles.activeLabel}>{activeLabel}</span>
          <strong className={styles.activeValue}>{activeValue}</strong>
        </div>
        <div className={styles.ringRow}>
          {campaignRings.map((ring, index) => (
            <ProgressRing key={ring.id} progress={ring.progress} delay={index * 90} />
          ))}
        </div>
      </div>

      <section className={styles.resultsPanel}>
        <div className={styles.resultsPanelInner}>
          <div className={styles.panelHeader}>{panelTitle}</div>
          <div className={styles.panelInner}>
            {campaigns.map((campaign) => (
              <MiniCampaignChart key={campaign.label} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.spendSection}>
        <div className={styles.spendTitle}>{spendTitle}</div>
        <svg
          className={styles.spendChart}
          viewBox="0 0 372 140"
          aria-hidden="true"
          onMouseLeave={() => setActiveIndex(spendChart.activeIndex ?? 0)}
        >
          <defs>
            <linearGradient id="campaign-performance-main-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4ea40" />
              <stop offset="100%" stopColor="#76a100" />
            </linearGradient>
          </defs>

          <path d={spendAreaPath} className={styles.spendFill} />
          <path d={spendUpperPath} className={styles.spendUpperLine} />
          <path d={spendLowerPath} className={styles.spendLowerLine} />

          <line x1={activePoint.x} x2={activePoint.x} y1="26" y2="134" className={styles.spendFocusLine} />

          {spendChart.upperSeries.map((point, index) => (
            <g key={`${point.x}-${point.y}`}>
              <circle cx={point.x} cy={point.y} r="3.1" className={styles.spendNode} />
              <circle cx={spendChart.lowerSeries[index].x} cy={spendChart.lowerSeries[index].y} r="2.9" className={styles.spendLowerNode} />
              <rect
                x={point.x - 18}
                y="0"
                width="36"
                height="140"
                className={styles.spendHitArea}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                tabIndex="0"
                role="button"
                aria-label={`Spend point ${index + 1}: ${point.tooltip}`}
              />
            </g>
          ))}

          <g transform={`translate(${activePoint.x}, ${activePoint.y + 40})`}>
            <g className={styles.spendBadgeGroup}>
              <rect x="-28" y="-12" width="56" height="24" rx="12" className={styles.spendBadge} />
              <text textAnchor="middle" dy="4" className={styles.spendBadgeText}>
                {activePoint.tooltip}
              </text>
            </g>
          </g>
        </svg>
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
