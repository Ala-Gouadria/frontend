import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { growthStrategyCardData } from '../data/strategyIntelligenceMockData.js'
import styles from './GrowthStrategyCard.module.css'

function FocusChart({ chart }) {
  return (
    <svg className={styles.focusChart} viewBox="0 0 270 46" aria-hidden="true">
      <defs>
        <linearGradient id="growth-focus-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 228, 91, 0.42)" />
          <stop offset="100%" stopColor="rgba(201, 228, 91, 0)" />
        </linearGradient>
      </defs>
      <polygon points={chart.fillPoints} className={styles.focusFill} />
      <polyline points={chart.points} className={styles.focusLine} />
    </svg>
  )
}

export function GrowthStrategyCard({ data = growthStrategyCardData }) {
  const { title, subtitle, status, focusLabel, focusValue, focusChart, legend, stack, reasonsTitle, reasonItems, bottomStack, insight, ctaLabel } = data

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
        <div className={styles.focusMeta}>
          <span className={styles.focusLabel}>{focusLabel}</span>
          <strong className={styles.focusValue}>{focusValue}</strong>
        </div>
        <FocusChart chart={focusChart} />
      </div>

      <div className={styles.legendRow}>
        {legend.map((item) => (
          <div key={item.label} className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles[item.tone]}`} />
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.stackRow}>
        {stack.map((group) =>
          Array.from({ length: group.count }).map((_, index) => (
            <span key={`${group.tone}-${index}`} className={`${styles.stackBlock} ${styles[group.tone]}`} />
          )),
        )}
      </div>

      <section className={styles.reasonPanel}>
        <div className={styles.reasonHeader}>{reasonsTitle}</div>
        <div className={styles.reasonBody}>
          <div className={styles.reasonList}>
            {reasonItems.map((item) => (
              <div key={item.label} className={styles.reasonRow}>
                <div className={styles.reasonInfo}>
                  <span className={`${styles.reasonSwatch} ${styles[item.tone]}`} />
                  <span>{item.label}</span>
                </div>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.bottomStack}>
            {bottomStack.map((group) => {
              const blockTone = group.tone.replace('Light', '')

              return Array.from({ length: group.count }).map((_, index) => (
                <span key={`${group.tone}-bottom-${index}`} className={`${styles.stackBlock} ${styles[blockTone]}`} />
              ))
            })}
          </div>
        </div>
      </section>

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
