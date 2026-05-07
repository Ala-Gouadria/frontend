import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { pipelineTrackingCardData } from '../data/salesAndLeadsMockData.js'
import styles from './PipelineTrackingCard.module.css'

function Sparkline({ chart, id }) {
  return (
    <svg className={styles.sparkline} viewBox="0 0 298 48" aria-hidden="true">
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

export function PipelineTrackingCard({ data = pipelineTrackingCardData }) {
  const {
    title,
    subtitle,
    status,
    pipelineLabel,
    pipelineValue,
    pipelineDelta,
    topChart,
    stages,
    winRateLabel,
    winRateValue,
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
        <div className={styles.topMeta}>
          <span className={styles.topLabel}>{pipelineLabel}</span>
          <div className={styles.topValueRow}>
            <strong className={styles.topValue}>{pipelineValue}</strong>
            <span className={styles.topDelta}>{pipelineDelta}</span>
          </div>
        </div>
        <svg className={styles.topChart} viewBox="0 0 270 46" aria-hidden="true">
          <defs>
            <linearGradient id="pipeline-top-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(201, 228, 91, 0.42)" />
              <stop offset="100%" stopColor="rgba(201, 228, 91, 0)" />
            </linearGradient>
          </defs>
          <polygon points={topChart.fillPoints} className={styles.sparkFill} />
          <polyline points={topChart.points} className={styles.sparkLine} />
        </svg>
      </div>

      <div className={styles.stageList}>
        {stages.map((stage) => (
          <div key={stage.label} className={styles.stageRow}>
            <span>{stage.label}</span>
            <strong className={styles[stage.tone]}>{stage.value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.winRateRow}>
        <span>{winRateLabel}</span>
        <strong>{winRateValue}</strong>
      </div>

      <Sparkline chart={bottomChart} id="pipeline-bottom" />

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
