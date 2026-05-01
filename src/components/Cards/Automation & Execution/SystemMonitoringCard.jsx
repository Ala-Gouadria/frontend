import {
  AiActionButton,
  AiInsight,
  DottedDataBars,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { systemMonitoringCardData } from '../../../features/Automation & Execution/data/automationExecutionMockData.js'
import './Automation & ExecutionCardShared.css'
import './SystemMonitoringCard.css'

export function SystemMonitoringCard({ data = systemMonitoringCardData }) {
  const insight =
    'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.'

  return (
    <article className="analytics-card automation-card system-monitoring-card">
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="system-monitoring-card__pulse">
        <span>{data.pulseLabel}</span>
        <strong>{data.pulseValue}</strong>
      </section>

      <section className="system-monitoring-card__panel">
        <h3>{data.panelTitle}</h3>
        <div className="system-monitoring-card__metrics">
            {data.summaryMetrics.map((metric) => (
              <div key={metric.label} className="system-monitoring-card__metric" data-tooltip={`${metric.label}: ${metric.value}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <DottedDataBars columns={metric.columns} tone={metric.label === 'Incidents' ? 'red' : 'ink'} />
              </div>
            ))}
        </div>
      </section>

      <section className="system-monitoring-card__services">
        <div className="system-monitoring-card__section-head">
          <span>{data.healthTitle}</span>
          <span>{data.healthMeta}</span>
        </div>
        <div className="system-monitoring-card__service-list">
          {data.services.map((service) => (
              <div key={service.label} className="system-monitoring-card__service">
                <div className="system-monitoring-card__service-head">
                  <div>
                    <strong>{service.label}</strong>
                    <span className={`system-monitoring-card__note system-monitoring-card__note--${service.noteTone}`}>{service.note}</span>
                  </div>
                  <div>
                    <span>{service.uptime}</span>
                    <strong>{service.latency}</strong>
                  </div>
                </div>
                <SegmentedStripedBar
                  value={(service.healthScore / 5) * 100}
                  segments={5}
                  tone="blue"
                  label={`${service.label}: ${service.uptime} uptime • ${service.latency}`}
                />
              </div>
          ))}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default SystemMonitoringCard
