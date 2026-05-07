import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { leadGenerationCardData } from '../data/salesAndLeadsMockData.js'
import styles from './LeadGenerationCard.module.css'

function Sparkline({ chart, id }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 270 46" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 228, 91, 0.42)" />
          <stop offset="100%" stopColor="rgba(201, 228, 91, 0)" />
        </linearGradient>
      </defs>
      <polygon points={chart.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      <polyline points={chart.points} className={styles.sparkLine} />
    </svg>
  )
}

function getNumber(value) {
  const number = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(number) ? number : 0
}

function getPercent(value) {
  return getNumber(value)
}

function getProgressTone(percent) {
  if (percent >= 50) {
    return 'green'
  }

  if (percent >= 35) {
    return 'blue'
  }

  return 'red'
}

function getRelativeTone(value, maxValue) {
  if (maxValue <= 0) {
    return 'green'
  }

  const ratio = value / maxValue

  if (ratio >= 0.9) {
    return 'green'
  }

  if (ratio >= 0.68) {
    return 'blue'
  }

  return 'red'
}

export function LeadGenerationCard({ data = leadGenerationCardData }) {
  const {
    title,
    subtitle,
    status,
    flowLabel,
    flowValue,
    topChart,
    panelTitle,
    sources,
    sourceLabel,
    sourceValue,
    sourceMetric,
    trackLabel,
    trackValue,
    trackWidth,
    insight,
    ctaLabel,
  } = data
  const maxSourceValue = Math.max(...sources.map((item) => getNumber(item.value)), 0)
  const trackPercent = getPercent(trackValue || trackWidth)
  const trackTone = getProgressTone(trackPercent)
  const trackFillWidth = trackPercent > 0 ? `${trackPercent}%` : trackWidth

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
        <div className={styles.topMeta}>
          <span className={styles.topLabel}>{flowLabel}</span>
          <strong className={styles.topValue}>{flowValue}</strong>
        </div>
        <Sparkline chart={topChart} id="lead-generation-top" />
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>{panelTitle}</div>
        <div className={styles.panelBody}>
          {sources.map((item, sourceIndex) => {
            const sourceValueNumber = getNumber(item.value)
            const sourceTone = getRelativeTone(sourceValueNumber, maxSourceValue)
            const peakBar = Math.max(...item.bars)

            return (
              <div
                key={item.label}
                className={`${styles.sourceCol} ${styles[`${sourceTone}Source`]}`}
                style={{ '--source-delay': `${sourceIndex * 90}ms` }}
              >
                <span className={styles.sourceName}>{item.label}</span>
                <strong className={styles.sourceCount}>{item.value}</strong>
                <div
                  className={styles.sourceChartWrap}
                  data-tooltip={`${item.label}: ${item.value} leads | Peak ${peakBar}`}
                >
                  <svg className={styles.sourceBars} viewBox="0 0 98 50" role="img" aria-label={`${item.label} source chart`}>
                    {item.bars.map((bar, index) => (
                      <rect
                        key={`${item.label}-${bar}-${index}`}
                        x={index * 7.4}
                        y={48 - bar / 1.4}
                        width="2.4"
                        height={bar / 1.4}
                        rx="1.2"
                        className={styles.bar}
                        style={{ '--bar-index': `${index}` }}
                      >
                        <title>{`${item.label} point ${index + 1}: ${bar}`}</title>
                      </rect>
                    ))}
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className={`${styles.sourceSection} ${styles[`${trackTone}Track`]}`}>
        <div className={styles.sourceHeader}>
          <span>{sourceLabel}</span>
        </div>
        <div className={styles.sourceRow}>
          <strong className={styles.sourceValue}>{sourceValue}</strong>
          <strong className={styles.sourceMetric}>{sourceMetric}</strong>
        </div>
        <div className={styles.trackHeader}>
          <span>{trackLabel}</span>
          <span>{trackValue}</span>
        </div>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: trackFillWidth }} />
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span>AI Insight</span>
        </div>
        <p>{insight}</p>
      </div>

      <button type="button" className={styles.cta}>
        {ctaLabel}
      </button>
    </article>
  )
}
