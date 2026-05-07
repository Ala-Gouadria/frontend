import logoMark from '../../../assets/logo/Nora_Componennts_Logo.png'
import { conversionSignalsCardData } from '../data/websiteTrafficMockData.js'
import styles from './ConversionSignalsCard.module.css'

export function ConversionSignalsCard({ data = conversionSignalsCardData }) {
  const { title, subtitle, status, panelTitle, metrics, ladderTitle, ladderMeta, ladder, insight, ctaLabel } = data
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}><div><h2 className={styles.title}>{title}</h2><p className={styles.subtitle}>{subtitle}</p></div><span className={styles.status}>{status}</span></div>
      <section className={styles.panel}><div className={styles.panelHeader}>{panelTitle}</div><div className={styles.panelBody}>{metrics.map((item) => <div key={item.label} className={styles.metric}><span>{item.label}</span><div className={styles.metricValue}><strong>{item.value}</strong><span className={item.delta.startsWith('-') ? styles.negative : styles.positive}>{item.delta}</span></div><svg className={styles.metricBars} viewBox="0 0 98 50" aria-hidden="true">{item.bars.map((bar, index) => <rect key={`${item.label}-${bar}-${index}`} x={index * 7.4} y={48 - bar / 1.4} width="2.4" height={bar / 1.4} rx="1.2" className={styles.bar} />)}</svg></div>)}</div></section>
      <div className={styles.ladderSection}><div className={styles.sectionHeader}><span>{ladderTitle}</span><span>{ladderMeta}</span></div>{ladder.map((item) => <div key={item.label} className={styles.trackItem}><div className={styles.trackHead}><span>{item.label}</span><span>{item.value}</span></div><div className={styles.track}><div className={styles.trackFill} style={{ width: item.width }} /></div></div>)}</div>
      <div className={styles.insight}><div className={styles.insightHeader}><img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} /><span>AI Insight</span></div><p>{insight}</p></div>
      <button type="button" className={styles.cta}>{ctaLabel}</button>
    </article>
  )
}
