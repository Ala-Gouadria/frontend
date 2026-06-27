import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { workflowAutomationCardData } from '../../../api/automationExecutionMockData.js'
import { useWorkflowsData } from '../../../hooks/useAutomationData'
import './Automation & ExecutionCardShared.css'
import './WorkflowAutomationCard.css'

function getWorkflowProgress(workflow) {
  const total = workflow.blocks.length || 1
  const completed = workflow.blocks.reduce((sum, value) => sum + Math.min(Number(value) || 0, 1), 0)

  return Math.round((completed / total) * 100)
}

// Map a workflow lifecycle status → display state + segmented progress blocks.
const STATUS_VIEW = {
  completed: { state: 'Completed', blocks: [1, 1, 1, 1, 1], tone: 'running' },
  running: { state: 'Running', blocks: [1, 1, 1, 0.4, 0.2], tone: 'running' },
  pending: { state: 'Queued', blocks: [1, 0.3, 0.3, 0.3, 0.3], tone: 'queued' },
  failed: { state: 'Failed', blocks: [1, 1, 0.2, 0, 0], tone: 'scheduled' },
  cancelled: { state: 'Cancelled', blocks: [1, 0.2, 0, 0, 0], tone: 'scheduled' },
}

function truncate(text, max = 32) {
  const s = String(text || '').trim()
  return s.length > max ? `${s.slice(0, max - 1)}…` : s
}

function transformData(workflows, mockData) {
  if (!workflows) return null

  if (workflows.length === 0) {
    return {
      ...mockData,
      status: 'No Data',
      subtitle: 'No workflows yet',
      pulseLabel: 'Workflow Pulse',
      pulseValue: 'Idle',
      workflows: [],
      insight: 'No automation workflows have run yet. Ask Nora to do something and a workflow will appear here.',
    }
  }

  const running = workflows.filter((w) => w.status === 'running').length
  const completed = workflows.filter((w) => w.status === 'completed').length

  const chains = workflows.slice(0, 4).map((w) => {
    const view = STATUS_VIEW[w.status] ?? STATUS_VIEW.pending
    return {
      label: truncate(w.intent) || 'Workflow',
      note: w.agentName ? `${w.agentName} agent` : 'Trigger',
      state: view.state,
      result: w.agentName || view.state,
      blocks: view.blocks,
      tone: view.tone,
    }
  })

  return {
    ...mockData,
    status: 'Live',
    pulseValue:
      running > 0 ? `${running} running` : `${completed} completed`,
    workflows: chains,
    insight: `${workflows.length} workflow${workflows.length === 1 ? '' : 's'} tracked — ${completed} completed, ${running} running.`,
  }
}

export function WorkflowAutomationCard({ data: propData, useRealData = true }) {
  const { items: workflows, loading } = useWorkflowsData()

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && workflows) {
      const transformed = transformData(workflows, workflowAutomationCardData)
      if (transformed) return transformed
    }
    return workflowAutomationCardData
  }, [propData, useRealData, workflows])

  return (
    <article className={`analytics-card automation-card workflow-automation-card ${loading ? 'loading' : ''}`}>
      <header className="analytics-card__header">
        <div>
          <h2 className="analytics-card__title">{data.title}</h2>
          <p className="analytics-card__subtitle">{data.subtitle}</p>
        </div>
        <span className="analytics-card__status">{data.status}</span>
      </header>

      <section className="workflow-automation-card__pulse">
        <span>{data.pulseLabel}</span>
        <strong>{data.pulseValue}</strong>
      </section>

      <section className="workflow-automation-card__panel">
        <div className="workflow-automation-card__panel-title">
          <span>{data.chainsTitle}</span>
          <span>{data.chainsMeta}</span>
        </div>
        <div className="workflow-automation-card__workflows">
          {data.workflows.map((workflow) => {
            const progress = getWorkflowProgress(workflow)
            const activeSegments = workflow.blocks.filter((value) => value >= 1).length

            return (
              <div key={workflow.label} className="workflow-automation-card__workflow">
                <div className="workflow-automation-card__workflow-head">
                  <div>
                    <strong>{workflow.label}</strong>
                    <span>{workflow.note}</span>
                  </div>
                  <div>
                    <span>{workflow.state}</span>
                    <strong>{workflow.result}</strong>
                  </div>
                </div>
                <SegmentedStripedBar
                  value={progress}
                  segments={5}
                  activeSegments={activeSegments}
                  tone="blue"
                  label={`${workflow.label}: ${progress}% • ${workflow.result}`}
                />
              </div>
            )
          })}
        </div>
      </section>

      <footer className="analytics-card__footer">
        <AiInsight>{data.insight || 'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.'}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default WorkflowAutomationCard
