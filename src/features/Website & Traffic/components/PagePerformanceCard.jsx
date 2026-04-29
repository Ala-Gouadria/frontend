import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { pagePerformanceCardData } from '../data/websiteTrafficMockData.js'
import styles from './PagePerformanceCard.module.css'

function Gauge({ item }) {
  const circumference = 250
  const offset = circumference * (1 - item.progress)
  return (
    <div className={styles.gaugeWrap}>
      <svg className={styles.gauge} viewBox="0 0 160 92" aria-hidden="true">
        <path d="M 12 80 A 56 56 0 0 1 148 80" className={styles.gaugeBack} />
        <path d="M 12 80 A 56 56 0 0 1 148 80" className={styles.gaugeFront} />
        <path d="M 12 80 A 56 56 0 0 1 148 80" className={styles.gaugeProgress} pathLength="250" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className={styles.gaugeValue}><strong>{item.value}</strong><span>{item.label}</span></div>
    </div>
  )
}

export function PagePerformanceCard({ data = pagePerformanceCardData }) {
  const { title, subtitle, status, gauges, leftTitle, rightTitle, pages, insight, ctaLabel } = data
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}><div><h2 className={styles.title}>{title}</h2><p className={styles.subtitle}>{subtitle}</p></div><span className={styles.status}>{status}</span></div>
      <div className={styles.gauges}>{gauges.map((item) => <Gauge key={item.label} item={item} />)}</div>
      <div className={styles.sectionHead}><span>{leftTitle}</span><span>{rightTitle}</span></div>
      <div className={styles.pageList}>{pages.map((page) => <div key={page.label} className={styles.pageItem}><div className={styles.pageTop}><div className={styles.pageInfo}><strong>{page.label}</strong><span>{page.note}</span></div><div className={styles.pageScore}><span>{page.value}</span><strong>{page.tag}</strong></div></div><div className={styles.track}><div className={styles.trackFill} style={{ width: page.width }} /></div></div>)}</div>
      <div className={styles.insight}><div className={styles.insightHeader}><img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} /><span>AI Insight</span></div><p>{insight}</p></div>
      <button type="button" className={styles.cta}>{ctaLabel}</button>
    </article>
  )
}
