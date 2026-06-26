import { useMemo } from 'react'
import {
  AiActionButton,
  AiInsight,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { workflowAutomationCardData } from '../../../api/automationExecutionMockData.js'
import { useSocialData } from '../../../hooks/useAnalyticsData'
import './Automation & ExecutionCardShared.css'
import './WorkflowAutomationCard.css'

function getWorkflowProgress(workflow) {
  const total = workflow.blocks.length || 1
  const completed = workflow.blocks.reduce((sum, value) => sum + Math.min(Number(value) || 0, 1), 0)

  return Math.round((completed / total) * 100)
}

function transformData(socialData, mockData) {
  if (!socialData) return null

  // If no platforms data, show zeros
  if (!socialData.platforms || Object.keys(socialData.platforms).length === 0) {
    return {
      ...mockData,
      title: 'Workflow Automation',
      subtitle: 'No data available',
      status: 'No Data',
      pulseLabel: 'Workflow Pulse',
      pulseValue: 'Inactive',
      workflows: mockData.workflows.map(w => ({ ...w, state: 'Inactive', result: '0%', blocks: [0, 0, 0, 0, 0] })),
      insight: 'No workflow data available. Connect your integrations to enable workflows.',
    }
  }

  const connectedPlatforms = Object.keys(socialData.platforms).length

  return {
    ...mockData,
    status: 'Live',
    pulseValue: connectedPlatforms > 0 ? 'Active' : 'Inactive',
    insight: `${connectedPlatforms} integrations connected. Workflow automation ready.`,
  }
}

export function WorkflowAutomationCard({ data: propData, useRealData = true }) {
  const { data: socialData, loading } = useSocialData({ days: 30 })

  const data = useMemo(() => {
    if (propData) return propData
    if (useRealData && socialData) {
      const transformed = transformData(socialData, workflowAutomationCardData)
      if (transformed) return transformed
    }
    return workflowAutomationCardData
  }, [propData, useRealData, socialData])

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
