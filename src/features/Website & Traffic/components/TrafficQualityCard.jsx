import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { trafficQualityCardData } from '../data/websiteTrafficMockData.js'
import styles from './TrafficQualityCard.module.css'

function TopSpark({ chart, id }) {
  return (
    <svg className={styles.topSpark} viewBox="0 0 234 40" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(201,228,91,.42)" /><stop offset="100%" stopColor="rgba(201,228,91,0)" /></linearGradient></defs>
      <polygon points={chart.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      <polyline points={chart.points} className={styles.sparkLine} />
    </svg>
  )
}

export function TrafficQualityCard({ data = trafficQualityCardData }) {
  const { title, subtitle, status, trendLabel, trendValue, trendDelta, topChart, gauge, panelTitle, panelMetrics, intentMixTitle, intentMixMeta, intentMix, sourceQualityTitle, sourceQualityMeta, sources, insight, ctaLabel } = data
  const circumference = 520
  const offset = circumference * (1 - gauge.progress)
  const angle = Math.PI * (1 - gauge.progress)
  const capX = 180 + 152 * Math.cos(angle)
  const capY = 160 - 152 * Math.sin(angle)

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}><div><h2 className={styles.title}>{title}</h2><p className={styles.subtitle}>{subtitle}</p></div><span className={styles.status}>{status}</span></div>
      <div className={styles.topRow}>
        <div className={styles.trendMeta}><span className={styles.trendLabel}>{trendLabel}</span><div className={styles.trendValueRow}><strong className={styles.trendValue}>{trendValue}</strong><span className={styles.trendDelta}>{trendDelta}</span></div></div>
        <TopSpark chart={topChart} id="traffic-quality-top" />
      </div>
      <div className={styles.gaugeWrap}>
        <svg className={styles.gauge} viewBox="0 0 360 190" aria-hidden="true">
          <path d="M 28 160 A 152 152 0 0 1 332 160" className={styles.gaugeBack} />
          <path d="M 28 160 A 152 152 0 0 1 332 160" className={styles.gaugeFront} />
          <path d="M 28 160 A 152 152 0 0 1 332 160" className={styles.gaugeProgress} pathLength="520" strokeDasharray={circumference} strokeDashoffset={offset} />
          <circle cx={capX} cy={capY} r="15" className={styles.gaugeCap} />
        </svg>
        <div className={styles.gaugeValue}><strong>{gauge.current}</strong><span>{gauge.label}</span></div>
      </div>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>{panelTitle}</div>
        <div className={styles.panelBody}>
          {panelMetrics.map((item, index) => (
            <div key={item.label} className={styles.metricCard}>
              <span>{item.label}</span><strong>{item.value}</strong>
              {item.type === 'bars' ? (
                <svg className={styles.metricBars} viewBox="0 0 98 50" aria-hidden="true">
                  {item.bars.map((bar, barIndex) => <rect key={`${item.label}-${bar}-${barIndex}`} x={barIndex * 7.4} y={48 - bar / 1.4} width="2.4" height={bar / 1.4} rx="1.2" className={styles.bar} />)}
                </svg>
              ) : (
                <svg className={styles.metricLine} viewBox="0 0 270 46" aria-hidden="true">
                  <defs><linearGradient id={`quality-line-${index}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(201,228,91,.42)" /><stop offset="100%" stopColor="rgba(201,228,91,0)" /></linearGradient></defs>
                  <polygon points={item.fillPoints} className={styles.sparkFill} style={{ fill: `url(#quality-line-${index})` }} />
                  <polyline points={item.points} className={styles.sparkLine} />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>
      <div className={styles.mixSection}>
        <div className={styles.sectionHeader}><span>{intentMixTitle}</span><span>{intentMixMeta}</span></div>
        {intentMix.map((item) => <div key={item.label} className={styles.trackItem}><div className={styles.trackHead}><span>{item.label}</span><span>{item.value}</span></div><div className={styles.track}><div className={styles.trackFill} style={{ width: item.width }} /></div></div>)}
      </div>
      <div className={styles.sourceSection}>
        <div className={styles.sectionHeader}><span>{sourceQualityTitle}</span><span>{sourceQualityMeta}</span></div>
        {sources.map((item) => <div key={item.label} className={styles.sourceItem}><div className={styles.sourceTop}><div className={styles.sourceInfo}><strong>{item.label}</strong><span>{item.note}</span></div><div className={styles.sourceScore}><span>{item.score}</span><strong className={styles[item.tone]}>{item.tag}</strong></div></div><div className={styles.track}><div className={`${styles.trackFill} ${styles[item.tone]}`} style={{ width: item.width }} /></div></div>)}
      </div>
      <div className={styles.insight}><div className={styles.insightHeader}><img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} /><span>AI Insight</span></div><p>{insight}</p></div>
      <button type="button" className={styles.cta}>{ctaLabel}</button>
    </article>
  )
}
