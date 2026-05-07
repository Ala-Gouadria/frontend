import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { seoInsightsCardData } from '../data/websiteTrafficMockData.js'
import styles from './SEOInsightsCard.module.css'

function Sparkline({ chart, id, tooltip }) {
  return (
    <div className={styles.sparklineWrap} data-tooltip={tooltip}>
      <svg className={styles.sparkline} viewBox="0 0 234 40" role="img" aria-label={tooltip}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201, 228, 91, 0.42)" />
            <stop offset="100%" stopColor="rgba(201, 228, 91, 0)" />
          </linearGradient>
        </defs>
        <title>{tooltip}</title>
        <polygon points={chart.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
        <polyline points={chart.points} className={styles.sparkLine} />
      </svg>
    </div>
  )
}

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))

  return Number.isFinite(percent) ? percent : 0
}

function getDelta(value) {
  const delta = Number.parseFloat(String(value).replace('+', ''))

  return Number.isFinite(delta) ? delta : 0
}

function getKeywordTone(delta) {
  if (delta > 1) {
    return 'green'
  }

  if (delta > 0) {
    return 'blue'
  }

  return 'red'
}

export function SEOInsightsCard({ data = seoInsightsCardData }) {
  const { title, subtitle, status, trendLabel, trendValue, trendDelta, topChart, gauge, keywordsTitle, keywordsMeta, keywords, insight, ctaLabel } = data
  const circumference = 520
  const offset = circumference * (1 - gauge.progress)
  const angle = Math.PI * (1 - gauge.progress)
  const centerX = 180
  const centerY = 160
  const radius = 152
  const capX = centerX + radius * Math.cos(angle)
  const capY = centerY - radius * Math.sin(angle)

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
        <div className={styles.trendMeta}>
          <span className={styles.trendLabel}>{trendLabel}</span>
          <div className={styles.trendValueRow}>
            <strong className={styles.trendValue}>{trendValue}</strong>
            <span className={styles.trendDelta}>{trendDelta}</span>
          </div>
        </div>
        <Sparkline chart={topChart} id="seo-top" tooltip={`${trendLabel}: ${trendDelta}`} />
      </div>

      <div className={styles.gaugeWrap}>
        <svg className={styles.gauge} viewBox="0 0 360 190" aria-hidden="true">
          <path d="M 28 160 A 152 152 0 0 1 332 160" className={styles.gaugeBack} />
          <path d="M 28 160 A 152 152 0 0 1 332 160" className={styles.gaugeFront} />
          <path
            d="M 28 160 A 152 152 0 0 1 332 160"
            className={styles.gaugeProgress}
            pathLength="520"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <circle cx={capX} cy={capY} r="15" className={styles.gaugeCap} />
        </svg>
        <div className={styles.gaugeValue}>
          <strong>{gauge.current}</strong>
          <span>{gauge.label}</span>
        </div>
      </div>

      <div className={styles.keywordSection}>
        <div className={styles.keywordHeader}>
          <span>{keywordsTitle}</span>
          <span>{keywordsMeta}</span>
        </div>
        <div className={styles.keywordList}>
          {keywords.map((item, index) => {
            const delta = getDelta(item.delta)
            const tone = getKeywordTone(delta)
            const width = `${getPercent(item.width)}%`

            return (
              <div
                key={item.label}
                className={`${styles.keywordItem} ${styles[`${tone}Keyword`]}`}
                style={{ '--keyword-delay': `${index * 110}ms` }}
              >
                <div className={styles.keywordTop}>
                  <div className={styles.keywordInfo}>
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </div>
                  <div className={styles.keywordRank}>
                    <strong>{item.rank}</strong>
                    <span>{item.delta}</span>
                  </div>
                </div>
                <div
                  className={styles.track}
                  data-tooltip={`${item.label}: ${item.rank}, ${item.delta}, ${item.note}`}
                >
                  <div className={styles.trackFill} style={{ width }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span>AI Insight</span>
        </div>
        <p>{insight}</p>
      </div>

      <button type="button" className={styles.cta}>{ctaLabel}</button>
    </article>
  )
}
