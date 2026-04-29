import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { trafficSourceBreakdownCardData } from '../data/analyticsMockData.js'
import styles from './TrafficSourceBreakdownCard.module.css'

function Sparkline({ chart, id }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 194 52" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(204, 230, 79, 0.38)" />
          <stop offset="100%" stopColor="rgba(204, 230, 79, 0)" />
        </linearGradient>
      </defs>
      <polygon
        points={chart.fillPoints}
        className={styles.sparkFill}
        style={{ fill: `url(#${id})` }}
      />
      <polyline points={chart.points} className={styles.sparkLine} />
    </svg>
  )
}

export function TrafficSourceBreakdownCard({ data = trafficSourceBreakdownCardData }) {
  const {
    title,
    subtitle,
    status,
    topSourceLabel,
    topSourceValue,
    topSourceChart,
    mixTitle,
    sources,
    insight,
    ctaLabel,
  } = data

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
        <div className={styles.sourceMeta}>
          <span className={styles.sourceLabel}>{topSourceLabel}</span>
          <strong className={styles.sourceValue}>{topSourceValue}</strong>
        </div>
        <Sparkline chart={topSourceChart} id="traffic-source-top-fill" />
      </div>

      <div className={styles.mixSection}>
        <div className={styles.mixTitle}>{mixTitle}</div>
        <div className={styles.mixList}>
          {sources.map((source, index) => (
            <div
              key={source.label}
              className={styles.mixRow}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.mixHead}>
                <span>{source.label}</span>
                <span className={styles.mixValues}>
                  <span>{source.percent}</span>
                  <span className={styles[source.tone]}>{source.delta}</span>
                </span>
              </div>
              <div
                className={styles.mixTrack}
                data-tooltip={source.tooltip}
              >
                <div
                  className={styles.mixFill}
                  style={{
                    width: source.width,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img
            src={logoMark}
            alt=""
            aria-hidden="true"
            className={styles.insightLogo}
          />
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