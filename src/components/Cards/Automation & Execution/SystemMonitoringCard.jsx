import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  ColoredPanel,
  DottedDataBars,
  TaskProgressBar,
} from '../../visuals-parts'
import { systemMonitoringCardData } from '../../../api/automationExecutionMockData.js'
import { useSystemHealth } from '../../../hooks/useAutomationData'
import './Automation & ExecutionCardShared.css'
import './SystemMonitoringCard.css'

// Friendly names for the backend health checks.
const SERVICE_LABELS = { database: 'Database', redis: 'Redis / Queue', aiService: 'AI Service' }
const STATUS_NOTE = {
  ok: { note: 'Healthy', noteTone: 'healthy', healthScore: 5 },
  degraded: { note: 'Degraded', noteTone: 'slow', healthScore: 3 },
  error: { note: 'Down', noteTone: 'slow', healthScore: 1 },
}

function formatUptime(seconds) {
  if (seconds == null) return '—'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function transformData(health, mockData) {
  if (!health) return null

  const checks = health.checks ?? {}
  const entries = Object.entries(checks)
  const okCount = entries.filter(([, v]) => v === 'ok').length
  const total = entries.length || 1
  const incidents = entries.filter(([, v]) => v !== 'ok').length

  const services = entries.map(([key, value]) => {
    const view = STATUS_NOTE[value] ?? STATUS_NOTE.error
    return {
      label: SERVICE_LABELS[key] ?? key,
      note: view.note,
      noteTone: view.noteTone,
      uptime: value === 'ok' ? 'Online' : 'Offline',
      latency: '—',
      healthScore: view.healthScore,
    }
  })

  // Keep the mock column sparklines as decoration; override headline values
  // with real health data.
  const summaryMetrics = [
    { ...mockData.summaryMetrics[0], label: 'Uptime', value: formatUptime(health.uptimeSeconds) },
    { ...mockData.summaryMetrics[1], label: 'Incidents', value: String(incidents) },
    { ...mockData.summaryMetrics[2], label: 'Services', value: `${okCount}/${total}` },
  ]

  return {
    ...mockData,
    status: health.status === 'ready' ? 'Live' : 'Degraded',
    pulseLabel: 'System Pulse',
    pulseValue:
      incidents === 0 ? 'All Systems Online' : `${incidents} service${incidents === 1 ? '' : 's'} degraded`,
    summaryMetrics,
    services: services.length > 0 ? services : mockData.services,
    insight:
      incidents === 0
        ? `All ${total} core services healthy. Backend up ${formatUptime(health.uptimeSeconds)}.`
        : `${incidents} of ${total} services need attention: ${services
            .filter((s) => s.note !== 'Healthy')
            .map((s) => s.label)
            .join(', ')}.`,
  }
}

export function SystemMonitoringCard({ data: propData, useRealData = true }) {
  const { health, loading } = useSystemHealth()

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && health) {
      const transformed = transformData(health, systemMonitoringCardData)
      if (transformed) return transformed
    }
    return systemMonitoringCardData
  }, [propData, useRealData, health])

  return (
    <article className={`analytics-card automation-card system-monitoring-card ${loading ? 'loading' : ''}`}>

      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      {/* ── System pulse ── */}
      <section className="system-monitoring-card__pulse">
        <span>{data.pulseLabel}</span>
        <strong>{data.pulseValue}</strong>
      </section>

      {/* ── Reasons panel ── */}
      <ColoredPanel title={data.panelTitle} bodyClassName="system-monitoring-card__metrics">
        {data.summaryMetrics.map((metric) => (
          <div
            key={metric.label}
            className="system-monitoring-card__metric"
            data-tooltip={`${metric.label}: ${metric.value}`}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <DottedDataBars columns={metric.columns} tone="ink" />
          </div>
        ))}
      </ColoredPanel>

      {/* ── Service health ── */}
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
                  <span>{service.note}</span>
                </div>
                <div>
                  <span>{service.uptime}</span>
                  <strong>{service.latency}</strong>
                </div>
              </div>
              <TaskProgressBar
                value={(service.healthScore / 5) * 100}
                segments={5}
                activeSegments={service.healthScore}
              />
            </div>
          ))}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>

    </article>
  )
}

export default SystemMonitoringCard
