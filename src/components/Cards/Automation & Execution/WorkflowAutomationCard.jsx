import {
  AiActionButton,
  AiInsight,
  SegmentedStripedBar,
} from '../../visuals-parts'
import { workflowAutomationCardData } from '../../../features/Automation & Execution/data/automationExecutionMockData.js'
import './Automation & ExecutionCardShared.css'
import './WorkflowAutomationCard.css'

function getWorkflowProgress(workflow) {
  const total = workflow.blocks.length || 1
  const completed = workflow.blocks.reduce((sum, value) => sum + Math.min(Number(value) || 0, 1), 0)

  return Math.round((completed / total) * 100)
}

export function WorkflowAutomationCard({ data = workflowAutomationCardData }) {
  const insight =
    'Strong signals from Traffic, Returning Users combined with conversion drop suggest retargeting will recover lost conversions.'

  return (
    <article className="analytics-card automation-card workflow-automation-card">
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
        <AiInsight>{insight}</AiInsight>
        <AiActionButton>{data.ctaLabel}</AiActionButton>
      </footer>
    </article>
  )
}

export default WorkflowAutomationCard
