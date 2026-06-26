import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  DottedDataBars,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { systemMonitoringCardData } from '../../../api/automationExecutionMockData.js'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import './Automation & ExecutionCardShared.css'
import './SystemMonitoringCard.css'

function transformData(socialData, mockData) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      ...mockData,
      title: 'System Monitoring',
      subtitle: 'No data available',
      status: 'No Data',
      pulseLabel: 'System Pulse',
      pulseValue: 'Offline',
      summaryMetrics: mockData.summaryMetrics.map(m => ({ ...m, value: '0', columns: m.columns.map(c => ({ ...c, count: 0 })) })),
      services: mockData.services.map(s => ({ ...s, uptime: '0%', latency: '--', healthScore: 0 })),
      insight: 'No system data available. Connect your integrations to monitor system health.',
    }
  }

  const connectedPlatforms = Object.keys(socialData.platforms).length

  return {
    ...mockData,
    status: 'Live',
    pulseValue: connectedPlatforms > 0 ? 'All Systems Online' : 'Offline',
    insight: `${connectedPlatforms} integrations connected. System monitoring active.`,
  }
}

export function SystemMonitoringCard({ data: propData, useRealData = true }) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && socialData) {
      const transformed = transformData(socialData, systemMonitoringCardData)
      if (transformed) return transformed
    }
    return systemMonitoringCardData
  }, [propData, useRealData, socialData])

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
      <section className="system-monitoring-card__panel">
        <h3>{data.panelTitle}</h3>
        <div className="system-monitoring-card__metrics">
          {data.summaryMetrics.map((metric) => (
            <div
              key={metric.label}
              className="system-monitoring-card__metric"
              data-tooltip={`${metric.label}: ${metric.value}`}
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <DottedDataBars
                columns={metric.columns}
                tone={metric.label === 'Incidents' ? 'red' : 'ink'}
              />
            </div>
          ))}
        </div>
      </section>

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
              <SegmentedStripedBar
                value={(service.healthScore / 5) * 100}
                segments={5}
                activeSegments={service.healthScore}
                tone="blue"
                label={`${service.label}: ${service.uptime} uptime • ${service.latency}`}
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
