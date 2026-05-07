import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { conversionFunnelCardData } from '../data/analyticsMockData.js'
import styles from './ConversionFunnelCard.module.css'

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

export function ConversionFunnelCard({ data = conversionFunnelCardData }) {
  const {
    title,
    subtitle,
    status,
    visitsLabel,
    visitsValue,
    visitsChart,
    funnelTitle,
    stages,
    totalConversionLabel,
    totalConversionValue,
    bottomChart,
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
        <div className={styles.visitsMeta}>
          <span className={styles.visitsLabel}>{visitsLabel}</span>
          <strong className={styles.visitsValue}>{visitsValue}</strong>
        </div>
        <Sparkline chart={visitsChart} id="conversion-funnel-top-fill" />
      </div>

      <div className={styles.funnelSection}>
        <div className={styles.funnelTitle}>{funnelTitle}</div>
        <div className={styles.stageList}>
          {stages.map((stage, index) => (
            <div
              key={stage.label}
              className={styles.stageRow}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.stageHead}>
                <span>{stage.label}</span>
                <span>{stage.percent}</span>
              </div>
              <div
                className={styles.stageTrack}
                data-tooltip={stage.tooltip}
              >
                <div
                  className={styles.stageFill}
                  style={{
                    width: stage.width,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>{totalConversionLabel}</span>
        <strong className={styles.totalValue}>{totalConversionValue}</strong>
      </div>

      <Sparkline chart={bottomChart} id="conversion-funnel-bottom-fill" />

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