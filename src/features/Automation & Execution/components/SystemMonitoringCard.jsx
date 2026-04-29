import { useState } from 'react'
import logoMark from '../../../assets/Logo/Nora_Componennts_Logo.png'
import { systemMonitoringCardData } from '../data/automationExecutionMockData.js'
import styles from './SystemMonitoringCard.module.css'

function DottedChart({ metric, activeColumn, onActivate }) {
  const maxCount = Math.max(...metric.columns.map((column) => column.count), 1)
  const columnCount = metric.columns.length

  return (
    <div className={styles.metricChartShell} onMouseLeave={() => onActivate(null)}>
      {activeColumn ? (
        <div
          className={styles.metricTooltip}
          style={{ left: `${((activeColumn.index + 0.5) / columnCount) * 100}%` }}
        >
          <strong>{activeColumn.label}</strong>
          <span>{activeColumn.value}</span>
        </div>
      ) : null}
      <svg
        className={styles.metricBars}
        viewBox="0 0 98 34"
        aria-hidden="true"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onActivate(null)
          }
        }}
      >
        {metric.columns.map((column, columnIndex) => {
          const isActive = activeColumn?.id === `${metric.label}-${column.label}`
          const shouldDim = activeColumn && !isActive

          return (
            <g key={`${metric.label}-${column.label}`}>
              {Array.from({ length: maxCount }).map((_, rowIndex) => {
                const visible = maxCount - rowIndex <= column.count
                const x = 8 + columnIndex * 13
                const y = 26 - rowIndex * 4

                return (
                  <circle
                    key={`${metric.label}-${column.label}-${rowIndex}`}
                    cx={x}
                    cy={y}
                    r="1.2"
                    className={`${styles.barDot} ${visible ? styles.barDotVisible : styles.barDotHidden} ${shouldDim ? styles.barDotDimmed : ''}`}
                    style={{ '--dot-index': rowIndex }}
                  />
                )
              })}
              <rect
                x={columnIndex * 13}
                y="0"
                width="13"
                height="34"
                className={styles.metricHitArea}
                onMouseEnter={() =>
                  onActivate({
                    id: `${metric.label}-${column.label}`,
                    label: column.label,
                    value: column.value,
                    index: columnIndex,
                  })
                }
                onFocus={() =>
                  onActivate({
                    id: `${metric.label}-${column.label}`,
                    label: column.label,
                    value: column.value,
                    index: columnIndex,
                  })
                }
                tabIndex="0"
                role="button"
                aria-label={`${metric.label} ${column.label} ${column.value}`}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function SystemMonitoringCard({ data = systemMonitoringCardData }) {
  const { title, subtitle, status, pulseLabel, pulseValue, panelTitle, summaryMetrics, healthTitle, healthMeta, services, insight, ctaLabel } = data
  const [activeColumnByMetric, setActiveColumnByMetric] = useState({})

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.status}>{status}</span>
      </div>

      <div className={styles.pulseSection}>
        <span className={styles.pulseLabel}>{pulseLabel}</span>
        <strong className={styles.pulseValue}>{pulseValue}</strong>
      </div>

      <section className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.panelHeader}>{panelTitle}</div>
          <div className={styles.panelBody}>
            {summaryMetrics.map((item) => (
              <div key={item.label} className={styles.metric}>
                <span className={styles.metricLabel}>{item.label}</span>
                <strong className={styles.metricValue}>{item.value}</strong>
                <DottedChart
                  metric={item}
                  activeColumn={activeColumnByMetric[item.label]}
                  onActivate={(column) =>
                    setActiveColumnByMetric((current) => ({
                      ...current,
                      [item.label]: column,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.serviceSection}>
        <div className={styles.sectionHead}>
          <span>{healthTitle}</span>
          <span>{healthMeta}</span>
        </div>
        <div className={styles.serviceList}>
          {services.map((service) => (
            <div key={service.label} className={styles.serviceItem}>
              <div className={styles.serviceTop}>
                <div className={styles.serviceInfo}>
                  <strong>{service.label}</strong>
                  <span className={styles[service.noteTone]}>{service.note}</span>
                </div>
                <div className={styles.serviceStats}>
                  <span>{service.uptime}</span>
                  <strong className={service.noteTone === 'slow' ? styles.latencyAlert : styles.latencyValue}>{service.latency}</strong>
                </div>
              </div>
              <div className={styles.blockRow}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={`${service.label}-${index}`}
                    className={`${styles.block} ${index < service.healthScore ? styles.active : styles.inactive}`}
                    style={{ '--block-index': `${index}` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.insight}>
        <div className={styles.insightHeader}>
          <img src={logoMark} alt="" aria-hidden="true" className={styles.insightLogo} />
          <span className={styles.insightTitle}>AI Insight</span>
        </div>
        <p>{insight}</p>
      </div>

      <button type="button" className={styles.cta}>
        {ctaLabel}
      </button>
    </article>
  )
}
