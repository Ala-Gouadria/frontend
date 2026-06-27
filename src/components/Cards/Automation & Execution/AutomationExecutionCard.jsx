import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  AutomationArcGauge,
  QualityBlocks,
} from '../../visuals-parts'
import { automationExecutionCardData } from '../../../api/automationExecutionMockData.js'
import { useWorkflowsData } from '../../../hooks/useAutomationData'
import './Automation & ExecutionCardShared.css'
import './AutomationExecutionCard.css'

const TOTAL_SEGMENTS = 30

function getPercent(value) {
  const percent = Number.parseFloat(String(value).replace('%', ''))
  return Number.isFinite(percent) ? percent : 0
}

function getTone(value) {
  const percent = getPercent(value)
  if (percent >= 70) return 'green'
  if (percent >= 50) return 'blue'
  return 'orange'
}

const LANE_TONES = {
  'High Intent': 'green',
  'Campaign Launch': 'blue',
  'Audience Sync': 'orange',
}

function laneBlocks(value, tone) {
  const active = Math.round(TOTAL_SEGMENTS * getPercent(value) / 100)
  const inactive = TOTAL_SEGMENTS - active
  return [
    { tone, count: active },
    ...(inactive > 0 ? [{ tone: `${tone}-muted`, count: inactive }] : []),
  ]
}

function transformData(workflows, mockData) {
  if (!workflows) return null

  if (workflows.length === 0) {
    return {
      ...mockData,
      status: 'No Data',
      subtitle: 'No workflows yet',
      stateLabel: 'Automation State',
      stateValue: 'Idle',
      gauge: { progress: 0, label: '0 Workflows', sublabel: 'No workflows run yet' },
      lanes: [
        { label: 'Completed', value: '0%' },
        { label: 'Running', value: '0%' },
        { label: 'Queued', value: '0%' },
      ],
      insight: 'No automation workflows have run yet. Ask Nora to do something to kick off a workflow.',
    }
  }

  const total = workflows.length
  const count = (s) => workflows.filter((w) => w.status === s).length
  const completed = count('completed')
  const running = count('running')
  const queued = count('pending')
  const pct = (n) => `${Math.round((n / total) * 100)}%`
  const completionRate = Math.round((completed / total) * 100)

  return {
    ...mockData,
    status: 'Live',
    stateLabel: 'Automation State',
    stateValue: running > 0 ? `${running} Running` : `${total} Workflows`,
    gauge: {
      progress: completionRate,
      label: `${completionRate}% Completed`,
      sublabel: `${completed}/${total} workflows`,
    },
    lanes: [
      { label: 'Completed', value: pct(completed) },
      { label: 'Running', value: pct(running) },
      { label: 'Queued', value: pct(queued) },
    ],
    insight: `${total} workflow${total === 1 ? '' : 's'} tracked — ${completed} completed, ${running} running, ${queued} queued.`,
  }
}

export function AutomationExecutionCard({ data: propData, useRealData = true }) {
  const { items: workflows, loading } = useWorkflowsData()

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && workflows) {
      const transformed = transformData(workflows, automationExecutionCardData)
      if (transformed) return transformed
    }
    return automationExecutionCardData
  }, [propData, useRealData, workflows])

  return (
    <article className={`analytics-card automation-card automation-execution-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="analytics-card__row automation-card__topline automation-execution-card__state">
        <span className="analytics-card__label">{data.stateLabel}</span>
        <strong className="analytics-card__value analytics-card__value--good">{data.stateValue}</strong>
      </section>

      <AutomationArcGauge
        progress={data.gauge.progress}
        label={data.gauge.label}
        detail={`${data.stateValue} • ${data.gauge.sublabel}`}
        className="automation-execution-card__gauge"
      />

      <section className="automation-execution-card__lanes">
        <h3>{data.laneTitle}</h3>
        {data.lanes.map((lane) => {
          const tone = LANE_TONES[lane.label] ?? getTone(lane.value)

          return (
            <div
              key={lane.label}
              className={`automation-execution-card__lane automation-execution-card__lane--${tone}`}
              style={{ '--lane-fill': `${getPercent(lane.value)}%` }}
            >
              <div className="automation-execution-card__lane-head">
                <span>{lane.label}</span>
                <strong>{lane.value}</strong>
              </div>
              <QualityBlocks
                blocks={laneBlocks(lane.value, tone)}
                className="automation-execution-card__lane-blocks"
                aria-label={`${lane.label}: ${lane.value}`}
              />
            </div>
          )
        })}
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight || 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.'}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default AutomationExecutionCard