import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { userBehaviorCardData } from '../data/websiteTrafficMockData.js'
import styles from './UserBehaviorCard.module.css'

function TopSpark({ chart, id }) {
  return (
    <svg className={styles.topSpark} viewBox="0 0 234 40" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(201,228,91,.42)" /><stop offset="100%" stopColor="rgba(201,228,91,0)" /></linearGradient></defs>
      <polygon points={chart.fillPoints} className={styles.sparkFill} style={{ fill: `url(#${id})` }} />
      <polyline points={chart.points} className={styles.sparkLine} />
    </svg>
  )
}

export function UserBehaviorCard({ data = userBehaviorCardData }) {
  const { title, subtitle, status, trendLabel, trendValue, trendDelta, topChart, panelTitle, metrics, userflowTitle, userflow, insight, ctaLabel } = data
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}><div><h2 className={styles.title}>{title}</h2><p className={styles.subtitle}>{subtitle}</p></div><span className={styles.status}>{status}</span></div>
      <div className={styles.topRow}><div className={styles.trendMeta}><span className={styles.trendLabel}>{trendLabel}</span><div className={styles.trendValueRow}><strong className={styles.trendValue}>{trendValue}</strong><span className={styles.trendDelta}>{trendDelta}</span></div></div><TopSpark chart={topChart} id="user-behavior-top" /></div>
      <section className={styles.panel}><div className={styles.panelHeader}>{panelTitle}</div><div className={styles.panelBody}>{metrics.map((item) => <div key={item.label} className={styles.metric}><span>{item.label}</span><strong className={item.tone === 'red' ? styles.red : ''}>{item.value}</strong><svg className={styles.metricBars} viewBox="0 0 98 50" aria-hidden="true">{item.bars.map((bar, index) => <rect key={`${item.label}-${bar}-${index}`} x={index * 7.4} y={48 - bar / 1.4} width="2.4" height={bar / 1.4} rx="1.2" className={styles.bar} />)}</svg></div>)}</div></section>
      <div className={styles.flowSection}><div className={styles.sectionTitle}>{userflowTitle}</div>{userflow.map((item) => <div key={item.label} className={styles.trackItem}><div className={styles.trackHead}><strong>{item.label}</strong><span>{item.value}</span></div><div className={styles.track}><div className={styles.trackFill} style={{ width: item.width }} /></div></div>)}</div>
      <div className={styles.insight}><div className={styles.insightHeader}><img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} /><span>AI Insight</span></div><p>{insight}</p></div>
      <button type="button" className={styles.cta}>{ctaLabel}</button>
    </article>
  )
}
